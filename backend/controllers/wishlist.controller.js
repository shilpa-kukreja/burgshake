import Wishlist from "../models/Wishlist.js";
import MenuItem from "../models/MenuItem.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/* Helper — get or create user's wishlist */
async function getUserWishlist(userId) {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }
  return wishlist;
}

/* ═══════════════════════════════════════════════════
   GET /api/wishlist
   ═══════════════════════════════════════════════════ */
export async function getMyWishlist(req, res, next) {
  try {
    const wishlist = await getUserWishlist(req.user._id);

    res.json(
      new ApiResponse(
        200,
        { items: wishlist.items, count: wishlist.items.length },
        `${wishlist.items.length} saved items`
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/wishlist/toggle
   Toggle an item in/out of wishlist
   Body: { itemId }
   ═══════════════════════════════════════════════════ */
export async function toggleWishlistItem(req, res, next) {
  try {
    const { itemId } = req.body;
    if (!itemId) throw new ApiError(400, "Item ID is required.");

    /* Verify the item exists and is available */
    const menuItem = await MenuItem.findOne({ id: itemId });
    if (!menuItem) throw new ApiError(404, "Menu item not found.");

    const wishlist = await getUserWishlist(req.user._id);

    const existingIndex = wishlist.items.findIndex(
      (i) => i.itemId === itemId
    );

    if (existingIndex >= 0) {
      /* Remove */
      wishlist.items.splice(existingIndex, 1);
      await wishlist.save();
      return res.json(
        new ApiResponse(
          200,
          { added: false, count: wishlist.items.length },
          "Removed from wishlist"
        )
      );
    }

    /* Add */
    wishlist.items.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      img: menuItem.img,
      desc: menuItem.desc,
      rating: menuItem.rating,
      mrp: menuItem.mrp,
    });
    await wishlist.save();

    res.json(
      new ApiResponse(
        200,
        { added: true, count: wishlist.items.length },
        "Added to wishlist"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/wishlist/add
   Explicit add (no toggle)
   ═══════════════════════════════════════════════════ */
export async function addToWishlist(req, res, next) {
  try {
    const { itemId } = req.body;
    if (!itemId) throw new ApiError(400, "Item ID is required.");

    const menuItem = await MenuItem.findOne({ id: itemId });
    if (!menuItem) throw new ApiError(404, "Menu item not found.");

    const wishlist = await getUserWishlist(req.user._id);

    const exists = wishlist.items.find((i) => i.itemId === itemId);
    if (exists) {
      return res.json(
        new ApiResponse(
          200,
          { count: wishlist.items.length },
          "Already in wishlist"
        )
      );
    }

    wishlist.items.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      img: menuItem.img,
      desc: menuItem.desc,
      rating: menuItem.rating,
      mrp: menuItem.mrp,
    });
    await wishlist.save();

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { count: wishlist.items.length },
          "Added to wishlist"
        )
      );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/wishlist/:itemId
   ═══════════════════════════════════════════════════ */
export async function removeFromWishlist(req, res, next) {
  try {
    const { itemId } = req.params;

    const wishlist = await getUserWishlist(req.user._id);
    const before = wishlist.items.length;

    wishlist.items = wishlist.items.filter((i) => i.itemId !== itemId);

    if (wishlist.items.length === before) {
      throw new ApiError(404, "Item not in wishlist.");
    }

    await wishlist.save();

    res.json(
      new ApiResponse(
        200,
        { count: wishlist.items.length },
        "Removed from wishlist"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   DELETE /api/wishlist
   Clear entire wishlist
   ═══════════════════════════════════════════════════ */
export async function clearWishlist(req, res, next) {
  try {
    const wishlist = await getUserWishlist(req.user._id);
    wishlist.items = [];
    await wishlist.save();

    res.json(new ApiResponse(200, { count: 0 }, "Wishlist cleared"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/wishlist/move-to-cart
   Optional: return items + suggested payload for cart
   (actual cart is client-side, so we just confirm)
   ═══════════════════════════════════════════════════ */
export async function moveWishlistToCart(req, res, next) {
  try {
    const { itemIds } = req.body;
    const wishlist = await getUserWishlist(req.user._id);

    const itemsToMove = itemIds?.length
      ? wishlist.items.filter((i) => itemIds.includes(i.itemId))
      : wishlist.items;

    if (itemsToMove.length === 0) {
      throw new ApiError(400, "No items to move.");
    }

    /* Remove moved items from wishlist */
    if (itemIds?.length) {
      wishlist.items = wishlist.items.filter(
        (i) => !itemIds.includes(i.itemId)
      );
    } else {
      wishlist.items = [];
    }
    await wishlist.save();

    res.json(
      new ApiResponse(
        200,
        {
          moved: itemsToMove.map((i) => ({ ...i, qty: 1 })),
          remainingCount: wishlist.items.length,
        },
        `${itemsToMove.length} items moved to cart`
      )
    );
  } catch (err) {
    next(err);
  }
}