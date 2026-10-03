import { Router } from "express";
import { body } from "express-validator";
import { subscribe } from "../controllers/subscriber.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post(
  "/",
  [body("email").trim().isEmail().withMessage("Valid email required")],
  validate,
  subscribe
);

export default router;