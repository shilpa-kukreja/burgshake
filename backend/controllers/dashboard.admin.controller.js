import User from "../models/User.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Contact from "../models/Contact.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/dashboard
   Combined stats for the admin home screen
   ═══════════════════════════════════════════════════ */
export async function adminDashboard(req, res, next) {
  try {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      newUsersToday,
      totalOrders,
      ordersToday,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedToday,
      cancelledToday,
      totalMenuItems,
      availableMenuItems,
      totalContacts,
      newContacts,
      revenueToday,
      revenueMonth,
      revenueAllTime,
      recentOrders,
      topItems,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),

      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "preparing" }),
      Order.countDocuments({ status: "ready" }),
      Order.countDocuments({
        status: "completed",
        updatedAt: { $gte: startOfToday },
      }),
      Order.countDocuments({
        status: "cancelled",
        createdAt: { $gte: startOfToday },
      }),

      MenuItem.countDocuments(),
      MenuItem.countDocuments({ isAvailable: true }),

      Contact.countDocuments(),
      Contact.countDocuments({ status: "new" }),

      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            paymentStatus: "paid",
          },
        },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            paymentStatus: "paid",
          },
        },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),

      /* Latest 8 orders */
      Order.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select("orderNumber customer.name total status paymentStatus createdAt")
        .lean(),

      /* Top 5 items by order frequency */
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.id",
            name: { $first: "$items.name" },
            img: { $first: "$items.img" },
            orderCount: { $sum: "$items.qty" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },
          },
        },
        { $sort: { orderCount: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          users: {
            total: totalUsers,
            newToday: newUsersToday,
          },
          orders: {
            total: totalOrders,
            today: ordersToday,
            pending: pendingOrders,
            preparing: preparingOrders,
            ready: readyOrders,
            completedToday,
            cancelledToday,
          },
          menu: {
            total: totalMenuItems,
            available: availableMenuItems,
            hidden: totalMenuItems - availableMenuItems,
          },
          contacts: {
            total: totalContacts,
            new: newContacts,
          },
          revenue: {
            today: revenueToday[0]?.sum || 0,
            month: revenueMonth[0]?.sum || 0,
            allTime: revenueAllTime[0]?.sum || 0,
          },
          recentOrders,
          topItems,
          generatedAt: now.toISOString(),
        },
        "Dashboard data"
      )
    );
  } catch (err) {
    next(err);
  }
}