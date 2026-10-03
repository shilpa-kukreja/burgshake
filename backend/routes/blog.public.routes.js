import { Router } from "express";
import {
  listBlogs,
  getBlogBySlug,
} from "../controllers/blog.public.controller.js";

const router = Router();

router.get("/", listBlogs);
router.get("/slug/:slug", getBlogBySlug);

export default router;