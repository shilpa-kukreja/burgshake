
import { Router } from "express";
import { body } from "express-validator";

import { submitContact } from "../controllers/contact.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

/* Stricter rate limit for contact form — prevent spam */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // 5 messages per hour per IP
  message: {
    success: false,
    message: "Too many messages from this IP. Please try again later.",
  },
});

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().isLength({ min: 2, max: 60 }),
    body("email").trim().isEmail().normalizeEmail(),
    body("phone")
      .optional({ checkFalsy: true })
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("topic")
      .optional()
      .isIn([
        "General inquiry",
        "Order feedback",
        "Bulk / catering",
        "Partnership",
        "Careers",
        "Other",
      ]),
    body("message").trim().isLength({ min: 10, max: 500 }),
  ],
  validate,
  submitContact
);

export default router;