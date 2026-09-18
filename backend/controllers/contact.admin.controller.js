import Contact from "../models/Contact.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/contacts
   List with filters
   ═══════════════════════════════════════════════════ */
export async function adminListContacts(req, res, next) {
  try {
    const {
      status,
      topic,
      search,
      page = 1,
      limit = 30,
    } = req.query;

    const filter = {};

    if (status && status !== "all") filter.status = status;
    if (topic && topic !== "all") filter.topic = topic;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [contacts, total, newCount] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Contact.countDocuments(filter),
      Contact.countDocuments({ status: "new" }),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          contacts,
          newCount,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        `${total} messages`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/contacts/:id
   ═══════════════════════════════════════════════════ */
export async function adminGetContact(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new ApiError(404, "Contact not found.");

    /* Auto-mark as read if it was new */
    if (contact.status === "new") {
      contact.status = "read";
      await contact.save();
    }

    res.json(new ApiResponse(200, { contact }, "Contact found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/contacts/:id/status
   ═══════════════════════════════════════════════════ */
export async function adminUpdateContactStatus(req, res, next) {
  try {
    const { status, adminNotes } = req.body;

    const allowed = ["new", "read", "replied", "archived"];
    if (!allowed.includes(status)) {
      throw new ApiError(400, "Invalid status.");
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new ApiError(404, "Contact not found.");

    contact.status = status;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;

    if (status === "replied") {
      contact.repliedAt = new Date();
      contact.repliedBy = req.user._id;
    }

    await contact.save();

    res.json(new ApiResponse(200, { contact }, `Status: ${status}`));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/contacts/:id
   ═══════════════════════════════════════════════════ */
export async function adminDeleteContact(req, res, next) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) throw new ApiError(404, "Contact not found.");
    res.json(new ApiResponse(200, null, "Contact deleted"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/contacts/stats/summary
   ═══════════════════════════════════════════════════ */
export async function adminContactStats(req, res, next) {
  try {
    const [total, newCount, read, replied, archived, byTopic] =
      await Promise.all([
        Contact.countDocuments(),
        Contact.countDocuments({ status: "new" }),
        Contact.countDocuments({ status: "read" }),
        Contact.countDocuments({ status: "replied" }),
        Contact.countDocuments({ status: "archived" }),
        Contact.aggregate([
          { $group: { _id: "$topic", count: { $sum: 1 } } },
        ]),
      ]);

    res.json(
      new ApiResponse(
        200,
        {
          total,
          status: { new: newCount, read, replied, archived },
          byTopic,
        },
        "Contact stats"
      )
    );
  } catch (err) {
    next(err);
  }
}