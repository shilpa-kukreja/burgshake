import Contact from "../models/Contact.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  sendContactNotificationToAdmin,
  sendContactAutoReply,
} from "../services/email.service.js";

/* ═══════════════════════════════════════════════════
   POST /api/contact
   Public — submit contact form
   ═══════════════════════════════════════════════════ */
export async function submitContact(req, res, next) {
  try {
    const { name, email, phone, topic, message } = req.body;

    /* Basic spam check — very simple, upgrade later */
    const spamKeywords = ["viagra", "casino", "crypto giveaway", "click here"];
    const lower = message.toLowerCase();
    if (spamKeywords.some((k) => lower.includes(k))) {
      throw new ApiError(400, "Your message was flagged as spam.");
    }

    /* Create contact record */
    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: (phone || "").trim(),
      topic: topic || "General inquiry",
      message: message.trim(),
      userAgent: req.headers["user-agent"] || "",
      ipAddress: req.ip || req.connection?.remoteAddress || "",
    });

    /* Fire off emails asynchronously — don't block the response */
    Promise.all([
      sendContactNotificationToAdmin(contact),
      sendContactAutoReply(contact),
    ]).catch((err) => {
      console.error("Email send error (non-blocking):", err);
    });

    res.status(201).json(
      new ApiResponse(
        201,
        { contact: { id: contact._id, name: contact.name } },
        "Message sent! We'll get back to you soon."
      )
    );
  } catch (err) {
    next(err);
  }
}