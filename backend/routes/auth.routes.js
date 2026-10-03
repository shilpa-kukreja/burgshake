import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/* Strict limiter for OTP sends — per IP */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,                 // 15 minutes
  max: process.env.NODE_ENV === "development" ? 100 : 5,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
  },
});

/* ── Public: OTP flow ─────────────────────────────── */

router.post(
  "/send-otp",
  otpLimiter,
  [
    body("phone")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
  ],
  validate,
  sendOtp
);

router.post(
  "/verify-otp",
  [
    body("phone")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("otp")
      .trim()
      .matches(/^\d{6}$/)
      .withMessage("OTP must be 6 digits"),
    body("name").optional().trim().isLength({ min: 2, max: 60 }),
    body("email").optional().trim().isEmail(),
  ],
  validate,
  verifyOtp
);

/* ── Public: admin email/password ─────────────────── */

router.post("/login", [
  body("email").trim().isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
], validate, login);

/* Keep register as-is for now. Consider protecting it later
   (protect + adminOnly) if only admins should create accounts. */
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2, max: 60 }),
    body("email").trim().isEmail().normalizeEmail(),
    body("phone").trim().matches(/^\d{10}$/),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  register
);

router.post("/logout", logout);

/* ── Protected ────────────────────────────────────── */

router.get("/me", protect, me);

router.patch(
  "/profile",
  protect,
  [
    body("name").optional().trim().isLength({ min: 2, max: 60 }),
    body("phone").optional().trim().matches(/^\d{10}$/),
    body("email").optional().trim().isEmail(),
  ],
  validate,
  updateProfile
);

router.patch(
  "/password",
  protect,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  validate,
  changePassword
);

export default router;