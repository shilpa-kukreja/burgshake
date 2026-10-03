import Blog from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   GET /api/blogs
   Public list — published only
   ═══════════════════════════════════════════════════ */
export async function listBlogs(req, res, next) {
  try {
    const { search, tag, page = 1, limit = 12 } = req.query;

    const filter = { status: "published" };
    if (tag) filter.tags = tag;
    if (search?.trim()) {
      filter.$or = [
        { blogName: { $regex: search.trim(), $options: "i" } },
        { excerpt: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-blogDetail") // exclude the heavy content from the list
        .sort({ blogDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(filter),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          blogs,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        `${total} blogs`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/blogs/slug/:slug
   Public single — published only
   ═══════════════════════════════════════════════════ */
export async function getBlogBySlug(req, res, next) {
  try {
    const blog = await Blog.findOne({
      blogSlug: req.params.slug,
      status: "published",
    });
    if (!blog) throw new ApiError(404, "Blog not found.");

    /* Related — same tag, published, excluding current */
    const related = await Blog.find({
      status: "published",
      blogSlug: { $ne: blog.blogSlug },
      tags: { $in: blog.tags.length ? blog.tags : ["__none__"] },
    })
      .select("blogName blogSlug blogImg blogDate excerpt tags")
      .sort({ blogDate: -1 })
      .limit(3)
      .lean();

    res.json(
      new ApiResponse(200, { blog, related }, "Blog found")
    );
  } catch (err) {
    next(err);
  }
}