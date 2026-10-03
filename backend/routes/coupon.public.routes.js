import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

import {
  applyCoupon,
  listActiveCoupons,
} from "../controllers/coupon.public.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/* Prevent code-guessing floods */
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                 // 15 min
  max: process.env.NODE_ENV === "development" ? 200 : 30,
  message: {
    success: false,
    message: "Too many coupon attempts. Please try again later.",
  },
});

router.post(
  "/apply",
  applyLimiter,
  [
    body("couponCode").trim().notEmpty().withMessage("Coupon code required"),
    body("totalAmount")
      .isNumeric()
      .withMessage("Total amount must be a number"),
  ],
  validate,
  applyCoupon
);

router.get("/active", listActiveCoupons);

export default router;