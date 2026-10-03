import { Router } from "express";
import {
  adminListSubscribers,
  adminDeleteSubscriber,
} from "../controllers/subscriber.admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/", adminListSubscribers);
router.delete("/:id", adminDeleteSubscriber);

export default router;