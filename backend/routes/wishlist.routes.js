import { Router } from "express";
import { body } from "express-validator";

import {
  getMyWishlist,
  toggleWishlistItem,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveWishlistToCart,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/* All wishlist routes require authentication */
router.use(protect);

/* ── Read ────────────────────────────────────────── */
router.get("/", getMyWishlist);

/* ── Add / toggle ────────────────────────────────── */
router.post(
  "/toggle",
  [body("itemId").trim().notEmpty().withMessage("itemId required")],
  validate,
  toggleWishlistItem
);

router.post(
  "/add",
  [body("itemId").trim().notEmpty().withMessage("itemId required")],
  validate,
  addToWishlist
);

/* ── Remove ──────────────────────────────────────── */
router.delete("/:itemId", removeFromWishlist);
router.delete("/", clearWishlist);

/* ── Move to cart ────────────────────────────────── */
router.post("/move-to-cart", moveWishlistToCart);

export default router;