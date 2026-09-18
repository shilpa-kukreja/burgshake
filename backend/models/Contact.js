import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name must be under 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      enum: [
        "General inquiry",
        "Order feedback",
        "Bulk / catering",
        "Partnership",
        "Careers",
        "Other",
      ],
      default: "General inquiry",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [500, "Message must be under 500 characters"],
    },

    /* Admin status */
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
      index: true,
    },

    /* Internal admin notes */
    adminNotes: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    repliedAt: { type: Date, default: null },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* Meta */
    source: { type: String, default: "website" }, // "website" | "app" etc.
    userAgent: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

/* Text search index */
contactSchema.index({
  name: "text",
  email: "text",
  message: "text",
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;