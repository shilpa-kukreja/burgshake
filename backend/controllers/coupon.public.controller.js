import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { computeCouponDiscount } from "../utils/couponUtils.js";


/* ═══════════════════════════════════════════════════
   POST /api/coupons/apply
   Validate a code and compute the discount
   ═══════════════════════════════════════════════════ */
export async function applyCoupon(req, res, next) {
  try {
    const { couponCode, totalAmount } = req.body;

    const amount = Number(totalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new ApiError(400, "Invalid total amount.");
    }

    const code = String(couponCode || "").trim().toUpperCase();
    if (!code) {
      throw new ApiError(400, "Please enter a coupon code.");
    }

    const coupon = await Coupon.findOne({ couponCode: code, isActive: true });
    if (!coupon) {
      throw new ApiError(404, "Invalid coupon code.");
    }

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
    const newTotalAmount = Math.max(amount - discount, 0);

    res.json(
      new ApiResponse(
        200,
        {
          discount,
          newTotalAmount,
          coupon: {
            code: coupon.couponCode,
            discount: coupon.discount,
            discounttype: coupon.discounttype,
            maxDiscountAmount: coupon.maxDiscountAmount,
            minPurchaseAmount: coupon.minPurchaseAmount,
          },
        },
        `You saved ₹${discount}!`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/coupons/active
   Public list of currently valid coupons (for the UI hints)
   ═══════════════════════════════════════════════════ */
export async function listActiveCoupons(req, res, next) {
  try {
    const now = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .select("couponCode discount discounttype minPurchaseAmount maxDiscountAmount expiryDate")
      .lean();

    res.json(
      new ApiResponse(200, { coupons }, `${coupons.length} active coupons`)
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════ */

/* Single source of truth for the discount math */
// export function computeCouponDiscount(coupon, amount) {
//   let discount = 0;

//   if (coupon.discounttype === "flat") {
//     discount = coupon.discount;
//   } else if (coupon.discounttype === "percent") {
//     discount = Math.round((amount * coupon.discount) / 100);
//     if (coupon.maxDiscountAmount) {
//       discount = Math.min(discount, coupon.maxDiscountAmount);
//     }
//   }

//   /* Never discount more than the amount itself */
//   return Math.min(discount, amount);
// }