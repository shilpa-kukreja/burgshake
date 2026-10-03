import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { resolveCoupon } from "../utils/couponUtils.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../services/razorpay.service.js";

/* ── Outlet lookup ────────────────────────────────── */
const OUTLETS = {
  bandra: {
    name: "Bandra West",
    address: "12 Linking Road, Bandra West, Mumbai",
  },
  andheri: {
    name: "Andheri East",
    address: "45 MIDC Road, Andheri East, Mumbai",
  },
};

/* Orders at or above this must be paid online */
const ONLINE_PAYMENT_THRESHOLD = 500;

/* ── Validate + normalise ─────────────────────────── */
function validateOrderPayload(body) {
  const {
    items,
    customer,
    outlet,
    date,
    timeSlot,
    timeSlotLabel,
    payment,
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart is empty.");
  }

  if (!customer?.name || !customer?.phone || !customer?.email) {
    throw new ApiError(400, "Customer name, phone, and email are required.");
  }

  if (!/^\d{10}$/.test(customer.phone)) {
    throw new ApiError(400, "Phone must be 10 digits.");
  }

  if (!/^\S+@\S+\.\S+$/.test(customer.email)) {
    throw new ApiError(400, "Invalid email address.");
  }

  /* Accept either an outlet id string, OR an object { id, name, address } */
  const outletId =
    typeof outlet === "string" ? outlet : outlet?.id;
  if (!outletId || !OUTLETS[outletId]) {
    throw new ApiError(400, "Invalid pickup outlet.");
  }

  /* Accept ISO date "YYYY-MM-DD" (today up to +7 days) */
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, "Invalid pickup date.");
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pickupDate = new Date(`${date}T00:00:00`);
  const daysAhead = Math.round((pickupDate - today) / 86400000);
  if (daysAhead < 0 || daysAhead > 7) {
    throw new ApiError(400, "Pickup date must be within the next 7 days.");
  }

  if (!timeSlot || !timeSlotLabel) {
    throw new ApiError(400, "Pickup time is required.");
  }

  if (!["razorpay", "counter"].includes(payment)) {
    throw new ApiError(400, "Invalid payment method.");
  }

  /* Recalculate subtotal + tax server-side — never trust the client */
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty || 1),
    0
  );
  const tax = Math.round(subtotal * 0.05);

  return { subtotal, tax, outletId };
}

/* ═══════════════════════════════════════════════════
   POST /api/orders
   ═══════════════════════════════════════════════════ */
export async function createOrder(req, res, next) {
  try {
    const {
      items,
      customer,
      date,
      timeSlot,
      timeSlotLabel,
      payment,
      notes,
      couponCode,
    } = req.body;

    const { subtotal, tax, outletId } = validateOrderPayload(req.body);

    /* ── SERVER-SIDE discount computation ──────────── */
    const { coupon, discount } = await resolveCoupon({
      code: couponCode,
      amount: subtotal,
    });

    const total = Math.max(0, subtotal + tax - discount);

    /* ── Enforce payment threshold ─────────────────── */
    if (total >= ONLINE_PAYMENT_THRESHOLD && payment !== "razorpay") {
      throw new ApiError(
        400,
        `Orders of ₹${ONLINE_PAYMENT_THRESHOLD} or more must be paid online.`
      );
    }

    const outletInfo = OUTLETS[outletId];

    const orderData = {
      userId: req.user?._id || null,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.toLowerCase().trim(),
      },
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: Number(i.price),
        qty: Number(i.qty || 1),
        img: i.img || "",
        customizations: i.customizations || undefined,
      })),
      pickup: {
        outletId,
        outletName: outletInfo.name,
        outletAddress: outletInfo.address,
        date,
        timeSlot,
        timeSlotLabel,
      },
      subtotal,
      tax,
      discount,
      couponCode: coupon?.couponCode || "",
      total,
      notes: (notes || "").slice(0, 500),
      payment,
      paymentLabel: payment === "razorpay" ? "Paid Online" : "Pay at Counter",
    };

    /* ═══ PAY AT COUNTER ═══════════════════════════ */
    if (payment === "counter") {
      const order = await Order.create({
        ...orderData,
        status: "confirmed",
        paymentStatus: "pending",
      });

      /* Increment coupon usage now — order is confirmed */
      if (coupon) {
        await Coupon.findByIdAndUpdate(coupon._id, {
          $inc: { usedCount: 1 },
        });
      }

      return res.status(201).json(
        new ApiResponse(
          201,
          { order },
          "Order placed. Pay at counter when you pick up."
        )
      );
    }

    /* ═══ PAY ONLINE (Razorpay) ════════════════════ */
    /* 1. Create order as pending. Coupon increment happens at verify. */
    const order = await Order.create({
      ...orderData,
      status: "pending",
      paymentStatus: "pending",
    });

    /* 2. Create Razorpay order */
    const rzOrder = await createRazorpayOrder({
      amount: total,
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        customerName: customer.name,
      },
    });

    /* 3. Save Razorpay order id */
    order.razorpay.orderId = rzOrder.id;
    await order.save();

    res.status(201).json(
      new ApiResponse(
        201,
        {
          order,
          razorpay: {
            orderId: rzOrder.id,
            amount: rzOrder.amount,
            currency: rzOrder.currency,
          },
        },
        "Order created. Complete payment to confirm."
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/orders/verify
   ═══════════════════════════════════════════════════ */
export async function verifyOrderPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, "Missing payment verification details.");
    }

    const order = await Order.findOne({
      "razorpay.orderId": razorpay_order_id,
    });

    if (!order) {
      throw new ApiError(404, "Order not found for this payment.");
    }

    /* Idempotency — don't double-process */
    if (order.paymentStatus === "paid") {
      return res.json(
        new ApiResponse(200, { order }, "Payment already verified.")
      );
    }

    const valid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!valid) {
      order.paymentStatus = "failed";
      order.status = "cancelled";
      await order.save();
      throw new ApiError(400, "Payment verification failed.");
    }

    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    order.razorpay.paidAt = new Date();
    await order.save();

    /* Increment coupon usage on successful payment */
    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        { couponCode: order.couponCode },
        { $inc: { usedCount: 1 } }
      );
    }

    res.json(
      new ApiResponse(200, { order }, "Payment verified. Order confirmed.")
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/orders/my
   ═══════════════════════════════════════════════════ */
export async function getMyOrders(req, res, next) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated.");

    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      new ApiResponse(
        200,
        { orders, count: orders.length },
        `${orders.length} orders found`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/orders/:orderNumber
   ═══════════════════════════════════════════════════ */
export async function getOrderByNumber(req, res, next) {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).lean();

    if (!order) throw new ApiError(404, "Order not found.");

    const isOwner =
      req.user &&
      order.userId &&
      order.userId.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === "admin";
    const isGuestOrder = !order.userId;

    /* Guest orders are readable by order number alone — the number
       IS the secret (like a receipt code). Logged-in orders require
       owner or admin. */
    if (!isOwner && !isAdmin && !isGuestOrder) {
      throw new ApiError(403, "You cannot view this order.");
    }

    res.json(new ApiResponse(200, { order }, "Order found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/orders/:orderNumber/cancel
   ═══════════════════════════════════════════════════ */
export async function cancelOrder(req, res, next) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated.");

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });

    if (!order) throw new ApiError(404, "Order not found.");

    if (
      !order.userId ||
      order.userId.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, "You cannot cancel this order.");
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new ApiError(
        400,
        "This order can no longer be cancelled. Please call the outlet."
      );
    }

    order.status = "cancelled";
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }
    await order.save();

    res.json(
      new ApiResponse(
        200,
        { order },
        "Order cancelled. Refund (if any) will be processed shortly."
      )
    );
  } catch (err) {
    next(err);
  }
}