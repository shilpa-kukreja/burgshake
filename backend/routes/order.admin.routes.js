import { Router } from "express";
import { body } from "express-validator";

import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
  adminDeleteOrder,
  adminOrderStats,
} from "../controllers/order.admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(protect, adminOnly);

/* Stats first — before /:orderNumber */
router.get("/stats/summary", adminOrderStats);

router.get("/", adminListOrders);
router.get("/:orderNumber", adminGetOrder);

router.patch(
  "/:orderNumber/status",
  [
    body("status")
      .isIn(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"])
      .withMessage("Invalid status"),
    body("note").optional().isString().isLength({ max: 300 }),
  ],
  validate,
  adminUpdateOrderStatus
);

router.patch(
  "/:orderNumber/payment",
  [
    body("paymentStatus")
      .isIn(["pending", "paid", "failed", "refunded"])
      .withMessage("Invalid payment status"),
  ],
  validate,
  adminUpdatePaymentStatus
);

router.delete("/:orderNumber", adminDeleteOrder);

export default router;