import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* ═══════════════════════════════════════════════════
   ADMIN — list all (including inactive)
   GET /api/admin/categories
   ═══════════════════════════════════════════════════ */
export async function adminListCategories(req, res, next) {
  try {
    const categories = await Category.find()
      .sort({ order: 1, name: 1 })
      .lean();

    /* Attach item counts */
    const counts = await MenuItem.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [c._id, c.count])
    );

    const enriched = categories.map((c) => ({
      ...c,
      itemCount: countMap[c.slug] || 0,
    }));

    res.json(new ApiResponse(200, { categories: enriched }, "Categories"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN — create
   POST /api/admin/categories
   ═══════════════════════════════════════════════════ */
export async function adminCreateCategory(req, res, next) {
  try {
    const { name, description, icon, order, isActive } = req.body;

    const category = await Category.create({
      name: name.trim(),
      description: (description || "").trim(),
      icon: icon || "",
      order: Number(order) || 0,
      isActive: isActive ?? true,
    });

    res
      .status(201)
      .json(new ApiResponse(201, { category }, "Category created"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN — update
   PATCH /api/admin/categories/:slug
   ═══════════════════════════════════════════════════ */
export async function adminUpdateCategory(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new ApiError(404, "Category not found.");

    const { name, description, icon, order, isActive } = req.body;

    /* Name change is NOT allowed (slug would break) */
    if (name !== undefined && name.trim() !== category.name) {
      throw new ApiError(
        400,
        "Category name cannot be changed. Create a new category instead."
      );
    }

    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = Number(order) || 0;
    if (isActive !== undefined) category.isActive = !!isActive;

    await category.save();

    res.json(new ApiResponse(200, { category }, "Category updated"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN — toggle active
   PATCH /api/admin/categories/:slug/toggle-active
   ═══════════════════════════════════════════════════ */
export async function adminToggleCategoryActive(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new ApiError(404, "Category not found.");

    category.isActive = !category.isActive;
    await category.save();

    res.json(
      new ApiResponse(
        200,
        { slug: category.slug, isActive: category.isActive },
        category.isActive ? "Category activated" : "Category hidden"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN — delete
   DELETE /api/admin/categories/:slug
   Blocks deletion if items still reference it.
   Use ?force=true to also delete all items in that category.
   ═══════════════════════════════════════════════════ */
export async function adminDeleteCategory(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw new ApiError(404, "Category not found.");

    const itemCount = await MenuItem.countDocuments({
      category: category.slug,
    });

    if (itemCount > 0 && req.query.force !== "true") {
      throw new ApiError(
        400,
        `This category has ${itemCount} item${
          itemCount > 1 ? "s" : ""
        }. Move or delete them first, or use "Delete with items".`
      );
    }

    /* If forced, delete all items in this category too */
    if (req.query.force === "true") {
      await MenuItem.deleteMany({ category: category.slug });
    }

    await category.deleteOne();

    res.json(
      new ApiResponse(
        200,
        { deletedItems: itemCount },
        `Category deleted${itemCount ? ` with ${itemCount} items` : ""}`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   ADMIN — reorder (bulk)
   POST /api/admin/categories/reorder
   Body: { order: ["burgers", "shakes", "sides", "beverages"] }
   ═══════════════════════════════════════════════════ */
export async function adminReorderCategories(req, res, next) {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      throw new ApiError(400, "`order` must be an array of slugs.");
    }

    await Promise.all(
      order.map((slug, i) =>
        Category.updateOne({ slug }, { $set: { order: i } })
      )
    );

    res.json(new ApiResponse(200, null, "Reordered"));
  } catch (err) {
    next(err);
  }
}