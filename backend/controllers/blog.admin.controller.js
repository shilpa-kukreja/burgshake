import Blog from "../models/Blog.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteUnreferencedUploads } from "../utils/fileCleanup.js";

/* ═══════════════════════════════════════════════════
   GET /api/admin/blogs
   List all — drafts + published
   ═══════════════════════════════════════════════════ */
export async function adminListBlogs(req, res, next) {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status && status !== "all") filter.status = status;
    if (search?.trim()) {
      filter.$or = [
        { blogName: { $regex: search.trim(), $options: "i" } },
        { blogSlug: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-blogDetail")
        .sort({ createdAt: -1 })
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
   GET /api/admin/blogs/:id
   Full document (including content) by Mongo id
   ═══════════════════════════════════════════════════ */
export async function adminGetBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found.");

    res.json(new ApiResponse(200, { blog }, "Blog found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/admin/blogs
   ═══════════════════════════════════════════════════ */
export async function adminCreateBlog(req, res, next) {
  try {
    const {
      blogName,
      blogImg,
      blogDetail,
      excerpt,
      blogDate,
      author,
      tags,
      status,
      metaTitle,
      metaDescription,
      metatag,
    } = req.body;

    const blog = await Blog.create({
      blogName: blogName.trim(),
      blogImg: blogImg.trim(),
      blogDetail: blogDetail.trim(),
      excerpt: excerpt?.trim() || "",
      blogDate: blogDate || new Date(),
      author: author?.trim() || "Burgshake Team",
      tags: Array.isArray(tags) ? tags.map((t) => String(t).trim()).filter(Boolean) : [],
      status: status === "draft" ? "draft" : "published",
      metaTitle: metaTitle?.trim() || "",
      metaDescription: metaDescription?.trim() || "",
      metatag: metatag?.trim() || "",
    });

    res.status(201).json(new ApiResponse(201, { blog }, "Blog created"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/blogs/:id
   ═══════════════════════════════════════════════════ */
export async function adminUpdateBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found.");

    const oldImg = blog.blogImg;

    const allowed = [
      "blogName",
      "blogImg",
      "blogDetail",
      "excerpt",
      "blogDate",
      "author",
      "tags",
      "status",
      "metaTitle",
      "metaDescription",
      "metatag",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) blog[key] = req.body[key];
    });

    await blog.save();

    /* Image changed → delete the old one if unused elsewhere */
    if (oldImg && oldImg !== blog.blogImg) {
      deleteUnreferencedUploads([oldImg], blog.blogSlug).catch((err) =>
        console.error("Blog image cleanup failed:", err)
      );
    }

    res.json(new ApiResponse(200, { blog }, "Blog updated"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/blogs/:id
   ═══════════════════════════════════════════════════ */
export async function adminDeleteBlog(req, res, next) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) throw new ApiError(404, "Blog not found.");

    if (blog.blogImg) {
      deleteUnreferencedUploads([blog.blogImg], blog.blogSlug).catch((err) =>
        console.error("Blog image cleanup failed:", err)
      );
    }

    res.json(new ApiResponse(200, null, "Blog deleted"));
  } catch (err) {
    next(err);
  }
}