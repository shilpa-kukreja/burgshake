import Subscriber from "../models/Subscriber.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   POST /api/subscribe
   ═══════════════════════════════════════════════════ */
export async function subscribe(req, res, next) {
  try {
    const email = req.body.email?.toLowerCase().trim();

    /* Already in the list? Return success — don't error. */
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.json(
        new ApiResponse(200, { email: existing.email }, "You're already subscribed!")
      );
    }

    const subscriber = await Subscriber.create({ email });

    res.status(201).json(
      new ApiResponse(201, { email: subscriber.email }, "You're on the list!")
    );
  } catch (err) {
    next(err);
  }
}