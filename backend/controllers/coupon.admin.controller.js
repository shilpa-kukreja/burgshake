import Coupon from "../models/Coupon.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/coupons
   ═══════════════════════════════════════════════════ */
export async function adminListCoupons(req, res, next) {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status === "active") {
      filter.isActive = true;
      filter.expiryDate = { $gte: new Date() };
    } else if (status === "expired") {
      filter.expiryDate = { $lt: new Date() };
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (search?.trim()) {
      filter.couponCode = { $regex: search.trim().toUpperCase(), $options: "i" };
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();

    res.json(
      new ApiResponse(200, { coupons }, `${coupons.length} coupons`)
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/admin/coupons
   ═══════════════════════════════════════════════════ */
export async function adminCreateCoupon(req, res, next) {
  try {
    const {
      couponCode,
      discount,
      discounttype,
      expiryDate,
      minPurchaseAmount,
      maxDiscountAmount,
      isActive,
      maxUses,
    } = req.body;

    const code = String(couponCode || "").trim().toUpperCase();

    const existing = await Coupon.findOne({ couponCode: code });
    if (existing) {
      throw new ApiError(409, "A coupon with this code already exists.");
    }

    const coupon = await Coupon.create({
      couponCode: code,
      discount,
      discounttype,
      expiryDate,
      minPurchaseAmount: minPurchaseAmount ?? 0,
      maxDiscountAmount: maxDiscountAmount ?? null,
      isActive: isActive ?? true,
      maxUses: maxUses ?? null,
    });

    res.status(201).json(new ApiResponse(201, { coupon }, "Coupon created"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/coupons/:id
   ═══════════════════════════════════════════════════ */
export async function adminUpdateCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found.");

    /* If code is being changed, check for collisions */
    if (req.body.couponCode !== undefined) {
      const code = String(req.body.couponCode).trim().toUpperCase();
      if (code !== coupon.couponCode) {
        const taken = await Coupon.exists({
          couponCode: code,
          _id: { $ne: coupon._id },
        });
        if (taken) {
          throw new ApiError(409, "A coupon with this code already exists.");
        }
      }
    }

    const allowed = [
      "couponCode",
      "discount",
      "discounttype",
      "expiryDate",
      "minPurchaseAmount",
      "maxDiscountAmount",
      "isActive",
      "maxUses",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        coupon[key] =
          key === "couponCode"
            ? String(req.body[key]).trim().toUpperCase()
            : req.body[key];
      }
    });

    await coupon.save();

    res.json(new ApiResponse(200, { coupon }, "Coupon updated"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/coupons/:id/toggle
   ═══════════════════════════════════════════════════ */
export async function adminToggleCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found.");

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.json(
      new ApiResponse(
        200,
        { id: coupon._id, isActive: coupon.isActive },
        coupon.isActive ? "Coupon activated" : "Coupon deactivated"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/coupons/:id
   ═══════════════════════════════════════════════════ */
export async function adminDeleteCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError(404, "Coupon not found.");

    res.json(new ApiResponse(200, null, "Coupon deleted"));
  } catch (err) {
    next(err);
  }
}