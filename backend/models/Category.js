import mongoose from "mongoose";
import { slugify } from "./MenuItem.js";

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [40, "Name must be under 40 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: 200,
    },
    icon: {
      type: String,
      default: "", // optional icon name or emoji
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

/* Auto-generate unique slug from name */
categorySchema.pre("save", async function () {
  if (!this.isNew) return;
  if (this.slug) return;

  const base = slugify(this.name) || "category";
  let slug = base;
  let counter = 1;

  while (
    await mongoose.model("Category").exists({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${base}-${counter++}`;
  }

  this.slug = slug;
});

const Category = mongoose.model("Category", categorySchema);
export default Category;