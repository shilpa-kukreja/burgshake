import User from "../models/User.js";
import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/users
   List all users with filters
   ═══════════════════════════════════════════════════ */
export async function adminListUsers(req, res, next) {
  try {
    const {
      role,
      status,          // "active" | "inactive"
      search,
      sort = "newest",
      page = 1,
      limit = 30,
    } = req.query;

    const filter = {};

    if (role && role !== "all") filter.role = role;
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    let sortObj = { createdAt: -1 };
    switch (sort) {
      case "oldest": sortObj = { createdAt: 1 }; break;
      case "name": sortObj = { name: 1 }; break;
      case "lastLogin": sortObj = { lastLoginAt: -1 }; break;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      User.countDocuments(filter),
    ]);

    /* Attach order count + total spent per user (in parallel) */
    const userIds = users.map((u) => u._id);
    const orderStats = await Order.aggregate([
      { $match: { userId: { $in: userIds } } },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpent: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0] },
          },
        },
      },
    ]);

    const statMap = {};
    orderStats.forEach((s) => {
      statMap[s._id.toString()] = {
        orderCount: s.orderCount,
        totalSpent: s.totalSpent,
      };
    });

    const enriched = users.map((u) => ({
      ...u,
      password: undefined,
      orderCount: statMap[u._id.toString()]?.orderCount || 0,
      totalSpent: statMap[u._id.toString()]?.totalSpent || 0,
    }));

    res.json(
      new ApiResponse(
        200,
        {
          users: enriched,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        `${total} users`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/users/:id
   View a single user with their order history
   ═══════════════════════════════════════════════════ */
export async function adminGetUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) throw new ApiError(404, "User not found.");

    delete user.password;

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const totalSpent = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((s, o) => s + o.total, 0);

    res.json(
      new ApiResponse(
        200,
        {
          user: {
            ...user,
            orderCount: orders.length,
            totalSpent,
          },
          orders,
        },
        "User found"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/users/:id/role
   Promote/demote user (user ↔ admin)
   ═══════════════════════════════════════════════════ */
export async function adminUpdateUserRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      throw new ApiError(400, "Role must be 'user' or 'admin'.");
    }

    /* Prevent self-demotion */
    if (req.user._id.toString() === req.params.id && role !== "admin") {
      throw new ApiError(400, "You cannot remove your own admin access.");
    }

    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");

    user.role = role;
    await user.save();

    res.json(
      new ApiResponse(
        200,
        { user: user.toSafeObject() },
        `User role updated to "${role}"`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/users/:id/toggle-active
   Block / unblock a user
   ═══════════════════════════════════════════════════ */
export async function adminToggleUserActive(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");

    /* Prevent self-block */
    if (req.user._id.toString() === user._id.toString()) {
      throw new ApiError(400, "You cannot block your own account.");
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json(
      new ApiResponse(
        200,
        { id: user._id, isActive: user.isActive },
        user.isActive ? "User unblocked" : "User blocked"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/users/:id
   Hard delete (careful — should rarely be used)
   ═══════════════════════════════════════════════════ */
export async function adminDeleteUser(req, res, next) {
  try {
    if (req.user._id.toString() === req.params.id) {
      throw new ApiError(400, "You cannot delete your own account.");
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");

    res.json(new ApiResponse(200, null, "User deleted"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/users/stats/summary
   ═══════════════════════════════════════════════════ */
export async function adminUserStats(req, res, next) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, admins, active, blocked, newToday, newMonth] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
        User.countDocuments({ createdAt: { $gte: startOfToday } }),
        User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      ]);

    res.json(
      new ApiResponse(
        200,
        {
          total,
          admins,
          active,
          blocked,
          newToday,
          newMonth,
        },
        "User stats"
      )
    );
  } catch (err) {
    next(err);
  }
}