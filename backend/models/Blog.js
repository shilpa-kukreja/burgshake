import mongoose from "mongoose";

export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const blogSchema = new mongoose.Schema(
  {
    blogName: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [140, "Title must be under 140 characters"],
    },

    /* Auto-generated from title, never changes after create */
    blogSlug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    blogImg: {
      type: String,
      required: [true, "Cover image is required"],
      trim: true,
    },

    /* Rich content — markdown supported */
    blogDetail: {
      type: String,
      required: [true, "Content is required"],
    },

    /* Short teaser for cards / meta description fallback */
    excerpt: {
      type: String,
      default: "",
      maxlength: [300, "Excerpt must be under 300 characters"],
    },

    blogDate: {
      type: Date,
      default: Date.now,
    },

    author: {
      type: String,
      default: "Burgshake Team",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    /* SEO */
    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", maxlength: 180 },
    metatag: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

/* ── Auto-generate unique slug from title on create ── */
blogSchema.pre("save", async function () {
  if (!this.isNew) return;
  if (this.blogSlug) return;

  const base = slugify(this.blogName) || "post";
  let slug = base;
  let counter = 1;

  while (
    await mongoose.model("Blog").exists({ blogSlug: slug })
  ) {
    slug = `${base}-${counter++}`;
  }

  this.blogSlug = slug;
});

/* ── Text search index ───────────────────────────── */
blogSchema.index({ blogName: "text", excerpt: "text", blogDetail: "text" });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export default Blog;