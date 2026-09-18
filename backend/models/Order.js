import mongoose from "mongoose";

/* ── Line item sub-schema ─────────────────────────── */
const orderItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1, default: 1 },
    img: { type: String, default: "" },
    customizations: {
      bun: { type: String, default: null },
      patty: { type: String, default: null },
      extras: { type: [String], default: [] },
    },
  },
  { _id: false }
);

/* ── Customer sub-schema ──────────────────────────── */
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

/* ── Pickup sub-schema (takeaway-only) ────────────── */
const pickupSchema = new mongoose.Schema(
  {
    outletId: { type: String, required: true }, // "bandra"
    outletName: { type: String, required: true }, // "Bandra West"
    outletAddress: { type: String, required: true },
    date: { type: String, required: true }, // "today" | "tomorrow"
    timeSlot: { type: String, required: true }, // "14:30"
    timeSlotLabel: { type: String, required: true }, // "2:30 PM"
  },
  { _id: false }
);

/* ── Main order schema ────────────────────────────── */
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /* Who placed it */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    customer: {
      type: customerSchema,
      required: true,
    },

    /* What they ordered */
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v) => v.length > 0, "Order must have at least one item"],
    },

    /* Pickup (takeaway) */
    pickup: {
      type: pickupSchema,
      required: true,
    },

    /* Pricing */
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, required: true, min: 0 },

    /* Special instructions */
    notes: { type: String, default: "", maxlength: 500 },

    /* Payment */
    payment: {
      type: String,
      enum: ["razorpay", "counter"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentLabel: { type: String, default: "" },

    /* Razorpay-specific (only filled if online) */
    razorpay: {
      orderId: { type: String, default: null },
      paymentId: { type: String, default: null },
      signature: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },

    /* Order status */
    status: {
      type: String,
      enum: [
        "pending",      // created, awaiting payment (online) or ready for pickup (counter)
        "confirmed",    // paid / accepted
        "preparing",    // kitchen is cooking
        "ready",        // ready for pickup
        "completed",    // customer picked up
        "cancelled",    // cancelled
      ],
      default: "pending",
      index: true,
    },

    /* Timestamps for status changes */
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

/* ── Generate order number before save ────────────── */
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `BS-${year}-${random}`;
  }
  next();
});

/* ── Push to status history on status change ──────── */
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status, at: new Date() });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;