import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    /* How much comes off — "flat" ₹ or "percent" % */
    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [0, "Discount cannot be negative"],
    },

    discounttype: {
      type: String,
      required: true,
      enum: ["flat", "percent"],
      lowercase: true,
    },

    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },

    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* Only applies when discounttype === "percent" */
    maxDiscountAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /* Optional usage cap — useful later */
    maxUses: {
      type: Number,
      default: null,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;