import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { adminListMenu , adminGetMenuById,
  adminCreateMenu,
  adminUpdateMenu,
  adminDeleteMenu,
  adminToggleAvailability,
  adminToggleFeatured,
  adminToggleBestseller,
  adminMenuStats, } from "../controllers/menu.controller.js";

const Menurouter = Router();

/* ── Everything below is admin-only ──────────────── */
Menurouter.use(protect, adminOnly);

/* ── Menu stats ──────────────────────────────────── */
Menurouter.get("/menu/stats/summary", adminMenuStats);

/* ── Menu CRUD ───────────────────────────────────── */
Menurouter.get("/menu", adminListMenu);

Menurouter.get("/menu/:slug", adminGetMenuById);

Menurouter.post(
  "/menu",
  [
    body("name").trim().isLength({ min: 2, max: 80 }),
    body("desc").trim().isLength({ min: 10, max: 280 }),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("img").trim().isURL().withMessage("Image must be a valid URL"),
    body("category").trim().notEmpty().withMessage("Category is required"),
  ],
  validate,
  adminCreateMenu
);

Menurouter.patch("/menu/:slug", adminUpdateMenu);

Menurouter.delete("/menu/:slug", adminDeleteMenu);

/* ── Quick toggles ───────────────────────────────── */
Menurouter.patch("/menu/:slug/toggle-availability", adminToggleAvailability);
Menurouter.patch("/menu/:slug/toggle-featured", adminToggleFeatured);
Menurouter.patch("/menu/:slug/toggle-bestseller", adminToggleBestseller);

export default Menurouter;