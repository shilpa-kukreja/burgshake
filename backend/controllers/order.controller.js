import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../services/razorpay.service.js";

/* ── Outlet lookup (matches frontend) ─────────────── */
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

/* ── Validate + normalise payload ─────────────────── */
function validateOrderPayload(body) {
  const {
    items,
    customer,
    outlet,
    date,
    timeSlot,
    timeSlotLabel,
    payment,
    notes,
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

  if (!outlet || !OUTLETS[outlet]) {
    throw new ApiError(400, "Invalid pickup outlet.");
  }

  if (!date || !["today", "tomorrow"].includes(date)) {
    throw new ApiError(400, "Invalid pickup date.");
  }

  if (!timeSlot || !timeSlotLabel) {
    throw new ApiError(400, "Pickup time is required.");
  }

  if (!["razorpay", "counter"].includes(payment)) {
    throw new ApiError(400, "Invalid payment method.");
  }

  /* Recalculate totals server-side (never trust client) */
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * Number(i.qty || 1),
    0
  );
  const tax = Math.round(subtotal * 0.05);

  return { subtotal, tax };
}

/* ═══════════════════════════════════════════════════
   POST /api/orders
   Create order (either pay-at-counter or Razorpay flow)
   ═══════════════════════════════════════════════════ */
export async function createOrder(req, res, next) {
  try {
    const {
      items,
      customer,
      outlet,
      date,
      timeSlot,
      timeSlotLabel,
      payment,
      notes,
      couponCode,
      discount: clientDiscount,
    } = req.body;

    const { subtotal, tax } = validateOrderPayload(req.body);

    /* Sanitise discount — cap it so total never goes negative */
    const discount = Math.min(
      Math.max(0, Number(clientDiscount) || 0),
      subtotal + tax
    );

    const total = Math.max(0, subtotal + tax - discount);

    const outletInfo = OUTLETS[outlet];

    /* Base order object (created in both flows) */
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
        outletId: outlet,
        outletName: outletInfo.name,
        outletAddress: outletInfo.address,
        date,
        timeSlot,
        timeSlotLabel,
      },
      subtotal,
      tax,
      discount,
      couponCode: couponCode || "",
      total,
      notes: (notes || "").slice(0, 500),
      payment,
      paymentLabel: payment === "razorpay" ? "Paid Online" : "Pay at Counter",
    };

    /* ── Pay at counter ────────────────────────────── */
    if (payment === "counter") {
      const order = await Order.create({
        ...orderData,
        status: "confirmed",
        paymentStatus: "pending",
      });

      return res.status(201).json(
        new ApiResponse(
          201,
          { order },
          "Order placed. Pay at counter when you pick up."
        )
      );
    }

    /* ── Pay online (Razorpay) ─────────────────────── */
    /* 1. Create the order first as pending */
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

    /* 3. Save Razorpay order id back to our order */
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
   Verify Razorpay payment signature
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

    /* Find our order by razorpay.orderId */
    const order = await Order.findOne({
      "razorpay.orderId": razorpay_order_id,
    });

    if (!order) {
      throw new ApiError(404, "Order not found for this payment.");
    }

    /* Verify signature */
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

    /* Update order as paid */
    order.paymentStatus = "paid";
    order.status = "confirmed";
    order.razorpay.paymentId = razorpay_payment_id;
    order.razorpay.signature = razorpay_signature;
    order.razorpay.paidAt = new Date();
    await order.save();

    res.json(
      new ApiResponse(200, { order }, "Payment verified. Order confirmed.")
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/orders/my
   Customer's order history
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
   Get one order (must be owner or admin)
   ═══════════════════════════════════════════════════ */
export async function getOrderByNumber(req, res, next) {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    }).lean();

    if (!order) throw new ApiError(404, "Order not found.");

    /* Only owner or admin */
    const isOwner =
      req.user && order.userId && order.userId.toString() === req.user._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError(403, "You cannot view this order.");
    }

    res.json(new ApiResponse(200, { order }, "Order found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/orders/:orderNumber/cancel
   Customer can cancel if still pending/confirmed
   ═══════════════════════════════════════════════════ */
export async function cancelOrder(req, res, next) {
  try {
    if (!req.user) throw new ApiError(401, "Not authenticated.");

    const order = await Order.findOne({
      orderNumber: req.params.orderNumber,
    });

    if (!order) throw new ApiError(404, "Order not found.");

    /* Owner only */
    if (
      !order.userId ||
      order.userId.toString() !== req.user._id.toString()
    ) {
      throw new ApiError(403, "You cannot cancel this order.");
    }

    /* Only cancellable if not yet preparing */
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