import { Router } from "express";
import { body } from "express-validator";

import {
  adminListBlogs,
  adminGetBlog,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
} from "../controllers/blog.admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(protect, adminOnly);

/* ── List + create ───────────────────────────────── */
router.get("/", adminListBlogs);

router.post(
  "/",
  [
    body("blogName").trim().isLength({ min: 2, max: 140 })
      .withMessage("Title must be 2–140 characters"),
    body("blogImg").trim().notEmpty().withMessage("Cover image is required"),
    body("blogDetail").trim().isLength({ min: 20 })
      .withMessage("Content must be at least 20 characters"),
    body("excerpt").optional().isLength({ max: 300 }),
    body("blogDate").optional().isISO8601(),
    body("author").optional().isString(),
    body("tags").optional().isArray(),
    body("status").optional().isIn(["draft", "published"]),
    body("metaTitle").optional().isString(),
    body("metaDescription").optional().isLength({ max: 180 }),
    body("metatag").optional().isString(),
  ],
  validate,
  adminCreateBlog
);

/* ── Single ──────────────────────────────────────── */
router.get("/:id", adminGetBlog);
router.patch("/:id", adminUpdateBlog);
router.delete("/:id", adminDeleteBlog);

export default router;