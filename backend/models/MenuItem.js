import mongoose from "mongoose";

/* Optional nutrition sub-schema */
const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, default: 0 },
    protein: { type: String, default: "—" },
    carbs: { type: String, default: "—" },
    fat: { type: String, default: "—" },
    sodium: { type: String, default: "—" },
  },
  { _id: false }
);

/* Slugify helper */
export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const menuItemSchema = new mongoose.Schema(
  {
    /* Auto-generated from name. Never changes once created. */
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name must be under 80 characters"],
    },

    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [280, "Description must be under 280 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    mrp: {
      type: Number,
      min: [0, "MRP cannot be negative"],
      default: null,
    },

    img: {
      type: String,
      required: [true, "Main image is required"],
      trim: true,
    },

    gallery: {
      type: [String],
      default: [],
    },

    tag: {
      type: String,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: 4.5,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },

    reviews: {
      type: Number,
      default: 0,
      min: [0, "Review count cannot be negative"],
    },

    dietary: {
      type: [String],
      enum: ["veg", "gluten-free", "spicy"],
      default: [],
    },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      // No enum — validated against Category collection at controller level
    },

    serves: {
      type: String,
      default: "1 person",
    },

    prepTime: {
      type: String,
      default: "12–15 min",
    },

    ingredients: {
      type: [String],
      default: [],
    },

    allergens: {
      type: [String],
      default: [],
    },

    nutrition: {
      type: nutritionSchema,
      default: () => ({}),
    },

    /* Chef's pick flag — used on menu featured section */
    isFeatured: {
      type: Boolean,
      default: false,
    },

    /* Bestseller flag — used on home featured menu */
    isBestseller: {
      type: Boolean,
      default: false,
    },

    /* Visibility */
    isAvailable: {
      type: Boolean,
      default: true,
    },

    /* Display order within category */
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


/* ── Auto-generate unique slug from name on create ── */
menuItemSchema.pre("save", async function (next) {
  try {
    /* Only generate on new docs (never change after create) */
    if (!this.isNew) return next();
    if (this.slug) return next();

    const base = slugify(this.name) || "item";
    let slug = base;
    let counter = 1;

    while (
      await mongoose.model("MenuItem").exists({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${base}-${counter++}`;
    }

    this.slug = slug;
    next();
  } catch (err) {
    next(err);
  }
});


/* ── Text search index (name + desc) ───────────────── */
menuItemSchema.index({ name: "text", desc: "text" });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;