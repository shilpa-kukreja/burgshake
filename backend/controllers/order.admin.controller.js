import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
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
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      throw new ApiError(400, "Invalid status.");
    }

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });
    if (!order) throw new ApiError(404, "Order not found.");

    order.status = status;
    if (note) {
      /* will be pushed to statusHistory by pre-save hook */
    }
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
    if (paymentStatus === "paid" && order.payment === "counter") {
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
   Dashboard stats
   ═══════════════════════════════════════════════════ */
export async function adminOrderStats(req, res, next) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

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
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "preparing" }),
      Order.countDocuments({ status: "ready" }),
      Order.countDocuments({ status: "completed" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfToday }, paymentStatus: "paid" } },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: "paid" } },
        { $group: { _id: null, sum: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
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