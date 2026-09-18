import crypto from "crypto";
import { getRazorpay } from "../config/razorpay.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/* ── Create a Razorpay order ──────────────────────── */
export async function createRazorpayOrder({ amount, receipt, notes = {} }) {
  try {
    const razorpay = getRazorpay();

    /* Razorpay expects amount in paise (₹1 = 100 paise) */
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (err) {
    console.error("Razorpay create error:", err);
    throw new ApiError(502, "Failed to create payment order. Try again.");
  }
}

/* ── Verify payment signature ─────────────────────── */
export function verifyRazorpaySignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
}