import Subscriber from "../models/Subscriber.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/subscribers
   ═══════════════════════════════════════════════════ */
export async function adminListSubscribers(req, res, next) {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    res.json(
      new ApiResponse(200, { subscribers }, `${subscribers.length} subscribers`)
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/subscribers/:id
   ═══════════════════════════════════════════════════ */
export async function adminDeleteSubscriber(req, res, next) {
  try {
    const sub = await Subscriber.findByIdAndDelete(req.params.id);
    if (!sub) throw new ApiError(404, "Subscriber not found.");
    res.json(new ApiResponse(200, null, "Subscriber removed"));
  } catch (err) {
    next(err);
  }
}