"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Star,
  Flame,
  Leaf,
  WheatOff,
  Check,
  Heart,
  ArrowRight,
} from "lucide-react";
import { MENU_ITEMS, DIETARY_META } from "../data/menuItems";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/* ─── Take top 5 bestsellers by rating ──────────────── */
const FEATURED = [...MENU_ITEMS]
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 5);

const ICONS = {
  veg: Leaf,
  "gluten-free": WheatOff,
  spicy: Flame,
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function FeaturedMenu() {
  const [added, setAdded] = useState(null);
  const [paused, setPaused] = useState(false);

  const trackRef = useRef(null);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  /* ── Auto-slide every 3.5s ─────────────────────── */
  useEffect(() => {
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;

    const interval = setInterval(() => {
      const card = track.querySelector("[data-card]");
      if (!card) return;

      const cardWidth = card.getBoundingClientRect().width;
      const gap = 24; // gap-6 = 24px
      const step = cardWidth + gap;
      const maxScroll = track.scrollWidth - track.clientWidth;

      /* If we're at (or near) the end, loop back to start */
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [paused]);

  /* ── Add to cart ───────────────────────────────── */
  const handleAdd = (item) => {
    addItem(item);
    setAdded(item.id);
    setTimeout(() => setAdded(null), 1400);
  };

  /* ── Wishlist toggle ───────────────────────────── */
  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(item);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-8 sm:py-8 lg:py-12">
      {/* ── Background ───────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.20)_0%,_rgba(249,115,22,0.05)_40%,_transparent_70%)]" />
        <div className="absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.12)_0%,_transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(249 115 22 / 0.14) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              Our Bestsellers
            </div>

            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-4xl lg:text-[2.6rem]">
              Crafted favourites,{" "}
              <span className="font-serif italic font-normal text-brand-500">
                loved daily.
              </span>
            </h2>
          </div>

          {/* View all link */}
          <Link
            href="/menu"
            className="group inline-flex shrink-0 items-center gap-2 text-[12.5px] font-semibold text-neutral-950"
          >
            <span className="border-b border-neutral-950 pb-0.5 transition-colors group-hover:border-brand-500 group-hover:text-brand-600">
              View full menu
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        </div>

        {/* ── Auto-slide track ───────────────────────── */}
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 2500)}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FEATURED.map((item) => {
            const isAdded = added === item.id;
            const wishlisted = isWishlisted(item.id);

            return (
              <article
                key={item.id}
                data-card
                className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04),0_8px_24px_-16px_rgba(249,115,22,0.15)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(249,115,22,0.4)] sm:w-[300px] lg:w-[320px]"
              >
                {/* Image — Link to detail page */}
                <Link
                  href={`/menu/${item.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden bg-neutral-100"
                >
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

                {/* Wishlist — outside the Link */}
                <button
                  type="button"
                  onClick={(e) => handleWishlist(e, item)}
                  aria-label={
                    wishlisted
                      ? `Remove ${item.name} from wishlist`
                      : `Add ${item.name} to wishlist`
                  }
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
                  {/* Dietary tags */}
                  <div className="mb-2.5 flex flex-wrap gap-1.5">
                    {(item.dietary || []).map((d) => {
                      const meta = DIETARY_META[d];
                      const Icon = ICONS[d];
                      if (!meta) return null;
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

                  {/* Name — Link to detail page */}
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
                      onClick={() => handleAdd(item)}
                      aria-label={`Add ${item.name} to cart`}
                      className={`group/btn relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full transition-all duration-300 ${
                        isAdded
                          ? "bg-emerald-500 text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.6)]"
                          : "bg-neutral-950 text-white hover:bg-brand-500 hover:shadow-[0_10px_24px_-10px_rgba(249,115,22,0.6)]"
                      }`}
                    >
                      {isAdded ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : (
                        <Plus className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Subtle hint */}
        <p className="mt-4 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400 sm:hidden">
          Swipe to explore
        </p>
      </div>
    </section>
  );
}