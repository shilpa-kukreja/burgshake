import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import MenuItem from "../models/MenuItem.js";

/* ═══════════════════════════════════════════════════
   GET /api/menu
   Public list — only available items
   ═══════════════════════════════════════════════════ */
export async function listMenu(req, res, next) {
  try {
    const {
      category, search, dietary,
      sort = "featured", page = 1, limit = 50,
    } = req.query;

    const filter = { isAvailable: true };

    if (category && category !== "all") filter.category = category.toLowerCase();

    if (dietary) {
      const tags = String(dietary).split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length) filter.dietary = { $all: tags };
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { desc: { $regex: search.trim(), $options: "i" } },
      ];
    }

    let sortObj = { isFeatured: -1, sortOrder: 1, createdAt: -1 };
    switch (sort) {
      case "price-low":  sortObj = { price: 1 }; break;
      case "price-high": sortObj = { price: -1 }; break;
      case "rating":     sortObj = { rating: -1 }; break;
      case "name":       sortObj = { name: 1 }; break;
      case "newest":     sortObj = { createdAt: -1 }; break;
      case "featured":
      default:           sortObj = { isFeatured: -1, sortOrder: 1, createdAt: -1 };
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      MenuItem.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      MenuItem.countDocuments(filter),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          items,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        },
        `${total} items`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/menu/:slug
   Public single item + related
   ═══════════════════════════════════════════════════ */
export async function getMenuBySlug(req, res, next) {
  try {
    const item = await MenuItem.findOne({
      slug: req.params.slug,
      isAvailable: true,
    });
    if (!item) throw new ApiError(404, "Item not found.");

    /* Related — same category first */
    const related = await MenuItem.find({
      category: item.category,
      slug: { $ne: item.slug },
      isAvailable: true,
    })
      .sort({ rating: -1 })
      .limit(4);

    let relatedItems = related;

    /* Top up from other categories if fewer than 4 */
    if (related.length < 4) {
      const extras = await MenuItem.find({
        category: { $ne: item.category },
        slug: { $ne: item.slug },
        isAvailable: true,
      })
        .sort({ rating: -1 })
        .limit(4 - related.length);
      relatedItems = [...related, ...extras];
    }

    res.json(
      new ApiResponse(200, { item, related: relatedItems }, "Item found")
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/menu/categories/list
   Distinct categories that have available items, with counts
   ═══════════════════════════════════════════════════ */
export async function listMenuCategories(req, res, next) {
  try {
    const categories = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, slug: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.json(
      new ApiResponse(200, { categories }, `${categories.length} categories`)
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/menu/featured/bestsellers
   Homepage bestseller carousel
   ═══════════════════════════════════════════════════ */
export async function featuredBestsellers(req, res, next) {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 8));

    const items = await MenuItem.find({
      isAvailable: true,
      isBestseller: true,
    })
      .sort({ sortOrder: 1, rating: -1 })
      .limit(limit);

    res.json(
      new ApiResponse(200, { items }, `${items.length} bestsellers`)
    );
  } catch (err) {
    next(err);
  }
}