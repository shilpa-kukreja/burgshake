import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   Base visibility filter — applied to every admin query
   ─────────────────────────────────────────────────
   • Counter orders  → always visible (they are confirmed on creation)
   • Online orders   → visible ONLY after payment succeeds
   • Failed / pending online orders → hidden from admin entirely
   ═══════════════════════════════════════════════════ */
const ADMIN_VISIBLE = {
  $or: [
    { payment: "counter" },
    { payment: "razorpay", paymentStatus: "paid" },
  ],
};

/* ═══════════════════════════════════════════════════
   GET /api/admin/orders
   List all orders with filters
   ═══════════════════════════════════════════════════ */
export async function adminListOrders(req, res, next) {
  try {
    const {
      status,
      paymentStatus,
      outlet,
      date,
      search,
      page = 1,
      limit = 30,
    } = req.query;

    /* All ad-hoc filters go here. The visibility filter is merged
       later with $and so it can never be accidentally overwritten. */
    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (paymentStatus && paymentStatus !== "all")
      filter.paymentStatus = paymentStatus;
    if (outlet && outlet !== "all") filter["pickup.outletId"] = outlet;

    /* Date range */
    if (date === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      filter.createdAt = { $gte: start };
    } else if (date === "week") {
      const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: start };
    } else if (date === "month") {
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: start };
    }

    /* Search by order number / customer name / phone */
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { orderNumber: { $regex: q, $options: "i" } },
        { "customer.name": { $regex: q, $options: "i" } },
        { "customer.phone": { $regex: q, $options: "i" } },
      ];
    }

    /* 🔑 Merge visibility filter with everything else via $and.
       This is what hides unpaid online orders from the dashboard. */
    const finalFilter = {
      $and: [ADMIN_VISIBLE, filter],
    };

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(finalFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(finalFilter),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          orders,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        `${total} orders`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/orders/:orderNumber
   Get a single order
   ─────────────────────────────────────────────────
   Admin can still open a pending online order by number
   (e.g. from a URL) — that's fine, they're admin.
   ═══════════════════════════════════════════════════ */
export async function adminGetOrder(req, res, next) {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (!order) throw new ApiError(404, "Order not found.");
    res.json(new ApiResponse(200, { order }, "Order found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/orders/:orderNumber/status
   Update status: pending → confirmed → preparing → ready → completed
   ═══════════════════════════════════════════════════ */
export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { status, note } = req.body;

    const allowed = [
      "pending", "confirmed", "preparing",
      "ready", "completed", "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new ApiError(400, "Invalid status.");
    }

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (!order) throw new ApiError(404, "Order not found.");

    order.status = status;
    order.statusHistory.push({
      status,
      at: new Date(),
      note: note || "",
    });
    await order.save();

    res.json(new ApiResponse(200, { order }, `Status updated: ${status}`));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/orders/:orderNumber/payment
   Manually mark payment status (e.g. counter payments)
   ═══════════════════════════════════════════════════ */
export async function adminUpdatePaymentStatus(req, res, next) {
  try {
    const { paymentStatus } = req.body;

    const allowed = ["pending", "paid", "failed", "refunded"];
    if (!allowed.includes(paymentStatus)) {
      throw new ApiError(400, "Invalid payment status.");
    }

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (!order) throw new ApiError(404, "Order not found.");

    order.paymentStatus = paymentStatus;

    /* When admin marks a counter order as paid, record the time */
    if (paymentStatus === "paid" && order.payment === "counter") {
      if (!order.razorpay) order.razorpay = {};
      order.razorpay.paidAt = new Date();
    }

    await order.save();

    res.json(
      new ApiResponse(200, { order }, `Payment status: ${paymentStatus}`)
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/orders/:orderNumber
   Hard delete (careful — for cleanup only)
   ═══════════════════════════════════════════════════ */
export async function adminDeleteOrder(req, res, next) {
  try {
    const order = await Order.findOneAndDelete({
      orderNumber: req.params.orderNumber,
    });
    if (!order) throw new ApiError(404, "Order not found.");
    res.json(new ApiResponse(200, null, "Order deleted"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/orders/stats/summary
   Dashboard stats — scoped to ADMIN_VISIBLE so unpaid
   online orders never inflate the numbers.
   ═══════════════════════════════════════════════════ */
export async function adminOrderStats(req, res, next) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    /* Wrap all stat queries with $and: [ADMIN_VISIBLE, ...] */
    const withVisible = (extra = {}) => ({
      $and: [ADMIN_VISIBLE, extra],
    });

    const [
      total,
      today,
      month,
      pending,
      preparing,
      ready,
      completed,
      cancelled,
      revenueToday,
      revenueMonth,
      revenueTotal,
    ] = await Promise.all([
      Order.countDocuments(withVisible()),
      Order.countDocuments(
        withVisible({ createdAt: { $gte: startOfToday } })
      ),
      Order.countDocuments(
        withVisible({ createdAt: { $gte: startOfMonth } })
      ),
      Order.countDocuments(withVisible({ status: "pending" })),
      Order.countDocuments(withVisible({ status: "preparing" })),
      Order.countDocuments(withVisible({ status: "ready" })),
      Order.countDocuments(withVisible({ status: "completed" })),
      Order.countDocuments(withVisible({ status: "cancelled" })),
      Order.aggregate([
        {
          $match: {
            $and: [
              ADMIN_VISIBLE,
              { createdAt: { $gte: startOfToday }, paymentStatus: "paid" },
            ],
          },
        },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [
              ADMIN_VISIBLE,
              { createdAt: { $gte: startOfMonth }, paymentStatus: "paid" },
            ],
          },
        },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            $and: [ADMIN_VISIBLE, { paymentStatus: "paid" }],
          },
        },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          orders: { total, today, month },
          status: { pending, preparing, ready, completed, cancelled },
          revenue: {
            today: revenueToday[0]?.sum || 0,
            month: revenueMonth[0]?.sum || 0,
            total: revenueTotal[0]?.sum || 0,
          },
        },
        "Order stats"
      )
    );
  } catch (err) {
    next(err);
  }
}