import { Router } from "express";
import { body } from "express-validator";

import {
  register,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/* ── Public routes ────────────────────────────────── */

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage("Name must be 2–60 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Valid email required")
      .normalizeEmail(),
    body("phone")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/logout", logout);

/* ── Protected routes ─────────────────────────────── */

router.get("/me", protect, me);

router.patch(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 60 })
      .withMessage("Name must be 2–60 characters"),
    body("phone")
      .optional()
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("email").optional().trim().isEmail().withMessage("Valid email required"),
  ],
  validate,
  updateProfile
);

router.patch(
  "/password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  validate,
  changePassword
);






export default router;