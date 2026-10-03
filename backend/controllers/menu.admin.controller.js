import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import MenuItem from "../models/MenuItem.js";
import { deleteUnreferencedUploads } from "../utils/fileCleanup.js";


/* ═══════════════════════════════════════════════════
   GET /api/admin/menu
   List ALL items (including unavailable)
   ═══════════════════════════════════════════════════ */
export async function adminListMenu(req, res, next) {
  try {
    const {
      category, search, available, featured, bestseller,
      sort = "newest", page = 1, limit = 50,
    } = req.query;

    const filter = {};

    if (category && category !== "all") filter.category = category.toLowerCase();
    if (available === "true") filter.isAvailable = true;
    if (available === "false") filter.isAvailable = false;
    if (featured === "true") filter.isFeatured = true;
    if (bestseller === "true") filter.isBestseller = true;

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { desc: { $regex: search.trim(), $options: "i" } },
      ];
    }

    let sortObj = { createdAt: -1 };
    switch (sort) {
      case "price-low":  sortObj = { price: 1 }; break;
      case "price-high": sortObj = { price: -1 }; break;
      case "rating":     sortObj = { rating: -1 }; break;
      case "name":       sortObj = { name: 1 }; break;
      case "oldest":     sortObj = { createdAt: 1 }; break;
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
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
   GET /api/admin/menu/:slug
   ═══════════════════════════════════════════════════ */
export async function adminGetMenuById(req, res, next) {
  try {
    const item = await MenuItem.findOne({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    res.json(new ApiResponse(200, { item }, "Item found"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/admin/menu
   ═══════════════════════════════════════════════════ */
export async function adminCreateMenu(req, res, next) {
  try {
    const {
      name, desc, price, mrp, img, gallery, tag, rating, reviews,
      dietary, category, serves, prepTime, ingredients, allergens,
      nutrition, isFeatured, isBestseller, isAvailable, sortOrder,
      longDesc, ratingBreakdown,
    } = req.body;

    const item = await MenuItem.create({
      name: name.trim(),
      desc: desc.trim(),
      longDesc: longDesc?.trim() || "",
      price,
      mrp: mrp || null,
      img: img.trim(),
      gallery: gallery || [],
      tag: tag || "",
      rating: rating ?? 4.5,
      reviews: reviews ?? 0,
       ratingBreakdown: ratingBreakdown || undefined,
      dietary: dietary || [],
      category: category.toLowerCase(),
      serves: serves || "1 person",
      prepTime: prepTime || "12–15 min",
      ingredients: ingredients || [],
      allergens: allergens || [],
      nutrition: nutrition || {},
      isFeatured: isFeatured ?? false,
      isBestseller: isBestseller ?? false,
      isAvailable: isAvailable ?? true,
      sortOrder: sortOrder ?? 0,
    });

    res.status(201).json(new ApiResponse(201, { item }, "Item created"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/menu/:slug
   ═══════════════════════════════════════════════════ */
export async function adminUpdateMenu(req, res, next) {
  try {
    const item = await MenuItem.findOne({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    /* Snapshot old images BEFORE mutation */
    const oldImages = [item.img, ...(item.gallery || [])].filter(Boolean);

    const allowed = [
      "name", "desc", "price", "mrp", "img", "gallery", "tag",
      "rating", "reviews", "dietary", "category", "serves",
      "prepTime", "ingredients", "allergens", "nutrition",
      "isFeatured", "isBestseller", "isAvailable", "sortOrder",
      "longDesc", "ratingBreakdown",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    });

    await item.save();

    /* Diff: which old images are no longer present on the doc? */
    const newImages = new Set(
      [item.img, ...(item.gallery || [])].filter(Boolean)
    );
    const removed = oldImages.filter((u) => !newImages.has(u));

    if (removed.length) {
      deleteUnreferencedUploads(removed, item.slug).catch((err) =>
        console.error("Update cleanup failed:", err)
      );
    }

    res.json(new ApiResponse(200, { item }, "Item updated"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/admin/menu/:slug
   ═══════════════════════════════════════════════════ */
export async function adminDeleteMenu(req, res, next) {
  try {
    const item = await MenuItem.findOneAndDelete({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    /* Fire-and-forget — don't make the client wait for cleanup */
    deleteUnreferencedUploads(
      [item.img, ...(item.gallery || [])],
      item.slug
    ).catch((err) => console.error("Delete cleanup failed:", err));

    res.json(new ApiResponse(200, null, "Item deleted"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/menu/:slug/toggle-availability
   ═══════════════════════════════════════════════════ */
export async function adminToggleAvailability(req, res, next) {
  try {
    const item = await MenuItem.findOne({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json(
      new ApiResponse(
        200,
        { id: item.id, isAvailable: item.isAvailable },
        item.isAvailable ? "Item is now available" : "Item is now hidden"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/menu/:slug/toggle-featured
   ═══════════════════════════════════════════════════ */
export async function adminToggleFeatured(req, res, next) {
  try {
    const item = await MenuItem.findOne({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    item.isFeatured = !item.isFeatured;
    await item.save();

    res.json(
      new ApiResponse(
        200,
        { id: item.id, isFeatured: item.isFeatured },
        item.isFeatured ? "Marked as chef's pick" : "Removed from chef's picks"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/admin/menu/:slug/toggle-bestseller
   ═══════════════════════════════════════════════════ */
export async function adminToggleBestseller(req, res, next) {
  try {
    const item = await MenuItem.findOne({ slug: req.params.slug });
    if (!item) throw new ApiError(404, "Item not found.");

    item.isBestseller = !item.isBestseller;
    await item.save();

    res.json(
      new ApiResponse(
        200,
        { id: item.id, isBestseller: item.isBestseller },
        item.isBestseller ? "Marked as bestseller" : "Removed from bestsellers"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/admin/menu/stats/summary
   ═══════════════════════════════════════════════════ */
export async function adminMenuStats(req, res, next) {
  try {
    const [total, available, hidden, featured, bestsellers, byCategory] =
      await Promise.all([
        MenuItem.countDocuments(),
        MenuItem.countDocuments({ isAvailable: true }),
        MenuItem.countDocuments({ isAvailable: false }),
        MenuItem.countDocuments({ isFeatured: true }),
        MenuItem.countDocuments({ isBestseller: true }),
        MenuItem.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $project: { _id: 0, category: "$_id", count: 1 } },
          { $sort: { count: -1 } },
        ]),
      ]);

    res.json(
      new ApiResponse(
        200,
        { total, available, hidden, featured, bestsellers, byCategory },
        "Stats"
      )
    );
  } catch (err) {
    next(err);
  }
}