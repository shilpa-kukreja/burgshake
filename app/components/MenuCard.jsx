"use client";

import { useState } from "react";
import Link from "next/link";   // ← ADD THIS
import {
  Plus,
  Star,
  Flame,
  Leaf,
  WheatOff,
  Check,
  Heart,
} from "lucide-react";
import { DIETARY_META } from "../data/menuItems";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ICONS = {
  veg: Leaf,
  "gluten-free": WheatOff,
  spicy: Flame,
};

export default function MenuCard({ item }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(item.id);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(item);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04),0_8px_24px_-16px_rgba(249,115,22,0.15)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(249,115,22,0.4)]">

      {/* Image — now a Link */}
      <Link href={`/menu/${item.slug}`} className="relative aspect-[4/3] overflow-hidden bg-neutral-100 block">
        <img
          src={item.img}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />

        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-950/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            {item.tag}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10.5px] font-bold text-neutral-900 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
          {item.rating}
        </span>
      </Link>

      {/* Wishlist — outside the Link so it doesn't navigate */}
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
        className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
          wishlisted
            ? "bg-brand-500 text-white shadow-[0_8px_20px_-8px_rgba(249,115,22,0.7)]"
            : "bg-white/95 text-neutral-700 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.25)] hover:bg-brand-50 hover:text-brand-600"
        }`}
      >
        <Heart
          className={`h-4 w-4 transition-transform duration-300 ${
            wishlisted ? "fill-white scale-110" : ""
          }`}
          strokeWidth={2.2}
        />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        {/* Dietary */}
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {item.dietary.map((d) => {
            const meta = DIETARY_META[d];
            const Icon = ICONS[d];
            return (
              <span
                key={d}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px] font-bold uppercase tracking-wider ${meta.color}`}
              >
                <Icon className="h-2.5 w-2.5" />
                {meta.label}
              </span>
            );
          })}
        </div>

        {/* Name — Link */}
        <Link href={`/menu/${item.id}`}>
          <h3 className="font-display text-[16px] font-bold leading-snug tracking-[-0.01em] text-neutral-950 transition-colors hover:text-brand-600">
            {item.name}
          </h3>
        </Link>

        {/* Desc */}
        <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-neutral-500">
          {item.desc}
        </p>

        {/* Price + Add */}
        <div className="mt-5 flex items-end justify-between gap-3 pt-1">
          <div className="leading-none">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-bold text-neutral-950">
                ₹{item.price}
              </span>
              {item.mrp && (
                <span className="text-[11.5px] font-medium text-neutral-400 line-through">
                  ₹{item.mrp}
                </span>
              )}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
              {item.reviews} reviews
            </div>
          </div>

          <button
            onClick={handleAdd}
            aria-label={`Add ${item.name} to cart`}
            className={`group/btn relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full transition-all duration-300 ${
              added
                ? "bg-emerald-500 text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.6)]"
                : "bg-neutral-950 text-white hover:bg-brand-500 hover:shadow-[0_10px_24px_-10px_rgba(249,115,22,0.6)]"
            }`}
          >
            {added ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}