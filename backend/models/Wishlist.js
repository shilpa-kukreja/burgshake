import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true }, // "bg-01"
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, default: "" },
    desc: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    mrp: { type: Number, default: null },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [wishlistItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;