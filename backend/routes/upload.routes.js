import { Router } from "express";
import {
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from "../middlewares/upload.middleware.js";
import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(protect, adminOnly);

router.post("/single", uploadSingleMiddleware, uploadSingleFile);
router.post("/multiple", uploadMultipleMiddleware, uploadMultipleFiles);

export default router;