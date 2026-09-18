import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   PUBLIC — list active categories with menu item counts
   GET /api/categories
   ═══════════════════════════════════════════════════ */
export async function listPublicCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    /* Count items per category */
    const counts = await MenuItem.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [c._id, c.count])
    );

    const total = await MenuItem.countDocuments({ isAvailable: true });

    const enriched = categories.map((c) => ({
      ...c,
      count: countMap[c.slug] || 0,
    }));

    res.json(
      new ApiResponse(
        200,
        {
          categories: [
            { slug: "all", name: "All", count: total },
            ...enriched,
          ],
        },
        "Categories"
      )
    );
  } catch (err) {
    next(err);
  }
}