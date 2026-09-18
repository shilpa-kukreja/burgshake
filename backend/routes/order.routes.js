import { Router } from "express";
import { body } from "express-validator";

import {
  createOrder,
  verifyOrderPayment,
  getMyOrders,
  getOrderByNumber,
  cancelOrder,
} from "../controllers/order.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const Orderrouter = Router();

/* ── Public-ish: guests can order too ─────────────── */
/* Optional auth: if token exists, we attach req.user */
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/token.js";
import User from "../models/User.js";

async function optionalAuth(req, res, next) {
  try {
    let token = null;

    if (req.cookies?.token) token = req.cookies.token;
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) req.user = user;
    }
  } catch {
    /* ignore — guest order */
  }
  next();
}

/* ── Create order (guest or logged in) ───────────── */
Orderrouter.post(
  "/",
  optionalAuth,
  [
    body("items").isArray({ min: 1 }).withMessage("Cart is empty"),
    body("customer.name").trim().notEmpty().withMessage("Name required"),
    body("customer.phone")
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("customer.email").trim().isEmail().withMessage("Valid email required"),
    body("outlet")
      .isIn(["bandra", "andheri"])
      .withMessage("Invalid outlet"),
    body("date").isIn(["today", "tomorrow"]).withMessage("Invalid date"),
    body("timeSlot").trim().notEmpty().withMessage("Time slot required"),
    body("payment")
      .isIn(["razorpay", "counter"])
      .withMessage("Invalid payment method"),
  ],
  validate,
  createOrder
);

/* ── Verify Razorpay payment ──────────────────────── */
Orderrouter.post("/verify", verifyOrderPayment);

/* ── Protected: customer order history ───────────── */
Orderrouter.get("/my", protect, getMyOrders);

/* ── Get single order ─────────────────────────────── */
Orderrouter.get("/:orderNumber", optionalAuth, getOrderByNumber);

/* ── Cancel order ─────────────────────────────────── */
Orderrouter.post("/:orderNumber/cancel", protect, cancelOrder);

export default Orderrouter;