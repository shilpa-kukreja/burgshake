import { Router } from "express";

import {
  listMenu,
  getMenuBySlug,
  listMenuCategories,
  featuredBestsellers,
} from "../controllers/menu.public.controller.js";   // ← FIXED

const router = Router();

/* ⚠️ Order matters:
   /categories/list and /featured/bestsellers MUST come
   before /:slug, otherwise Express matches "categories"
   and "featured" as a slug and 404s. */

router.get("/categories/list",      listMenuCategories);
router.get("/featured/bestsellers", featuredBestsellers);

router.get("/",      listMenu);
router.get("/:slug", getMenuBySlug);

export default router;