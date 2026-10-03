import Coupon from "../models/Coupon.js";
import { ApiError } from "./ApiError.js";

/**
 * Compute the rupee discount for a coupon + amount.
 * The single source of truth — never duplicate this logic.
 */
export function computeCouponDiscount(coupon, amount) {
  let discount = 0;

  if (coupon.discounttype === "flat") {
    discount = coupon.discount;
  } else if (coupon.discounttype === "percent") {
    discount = Math.round((amount * coupon.discount) / 100);
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  }

  return Math.min(discount, amount);
}

/**
 * Validate a coupon code against an order amount.
 * Throws ApiError if invalid.
 * Returns { coupon, discount } if valid.
 */
export async function resolveCoupon({ code, amount }) {
  if (!code) return { coupon: null, discount: 0 };

  const normalized = String(code).trim().toUpperCase();
  if (!normalized) return { coupon: null, discount: 0 };

  const coupon = await Coupon.findOne({ couponCode: normalized, isActive: true });
  if (!coupon) throw new ApiError(400, "Invalid coupon code.");

  if (new Date(coupon.expiryDate) < new Date()) {
    throw new ApiError(400, "This coupon has expired.");
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, "This coupon has reached its usage limit.");
  }

  if (amount < coupon.minPurchaseAmount) {
    throw new ApiError(
      400,
      `Minimum order of ₹${coupon.minPurchaseAmount} required for this coupon.`
    );
  }

  const discount = computeCouponDiscount(coupon, amount);
  return { coupon, discount };
}