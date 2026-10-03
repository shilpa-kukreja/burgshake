import { Router } from "express";
import { body } from "express-validator";

import {
  adminListCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminToggleCoupon,
  adminDeleteCoupon,
} from "../controllers/coupon.admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/", adminListCoupons);

router.post(
  "/",
  [
    body("couponCode").trim().notEmpty().withMessage("Coupon code required"),
    body("discount")
      .isFloat({ min: 0 })
      .withMessage("Discount must be a positive number"),
    body("discounttype")
      .isIn(["flat", "percent"])
      .withMessage("Discount type must be flat or percent"),
    body("expiryDate")
      .isISO8601()
      .withMessage("Valid expiry date required"),
    body("minPurchaseAmount").optional().isFloat({ min: 0 }),
    body("maxDiscountAmount").optional({ nullable: true }).isFloat({ min: 0 }),
  ],
  validate,
  adminCreateCoupon
);

router.patch("/:id", adminUpdateCoupon);
router.patch("/:id/toggle", adminToggleCoupon);
router.delete("/:id", adminDeleteCoupon);

export default router;