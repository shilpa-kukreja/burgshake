import { Router } from "express";
import { body } from "express-validator";

import {
  adminListMenu,
  adminGetMenuById,
  adminCreateMenu,
  adminUpdateMenu,
  adminDeleteMenu,
  adminToggleAvailability,
  adminToggleFeatured,
  adminToggleBestseller,
  adminMenuStats,
} from "../controllers/menu.admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/* Everything below is admin-only */
router.use(protect, adminOnly);

/* ── Stats — MUST come before /menu/:slug ─────────── */
router.get("/menu/stats/summary", adminMenuStats);

/* ── Menu CRUD ────────────────────────────────────── */
router.get("/menu", adminListMenu);

router.get("/menu/:slug", adminGetMenuById);

router.post(
  "/menu",
  [
    body("name").trim().isLength({ min: 2, max: 80 })
      .withMessage("Name must be 2–80 characters"),
    body("desc").trim().isLength({ min: 10, max: 280 })
      .withMessage("Description must be 10–280 characters"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("img").trim().notEmpty().withMessage("Main image is required"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("longDesc")
  .optional()
  .isString()
  .isLength({ max: 2000 })
  .withMessage("Long description must be under 2000 characters"),

body("ratingBreakdown")
  .optional()
  .isObject()
  .withMessage("ratingBreakdown must be an object"),

/* Per-key numeric checks — only run if ratingBreakdown was sent */
body("ratingBreakdown.star5").optional().isInt({ min: 0 }),
body("ratingBreakdown.star4").optional().isInt({ min: 0 }),
body("ratingBreakdown.star3").optional().isInt({ min: 0 }),
body("ratingBreakdown.star2").optional().isInt({ min: 0 }),
body("ratingBreakdown.star1").optional().isInt({ min: 0 }),
  ],
  validate,
  adminCreateMenu
);

router.patch("/menu/:slug", adminUpdateMenu);

router.delete("/menu/:slug", adminDeleteMenu);

/* ── Quick toggles ────────────────────────────────── */
router.patch("/menu/:slug/toggle-availability", adminToggleAvailability);
router.patch("/menu/:slug/toggle-featured",     adminToggleFeatured);
router.patch("/menu/:slug/toggle-bestseller",   adminToggleBestseller);

export default router;