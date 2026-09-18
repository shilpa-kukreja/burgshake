"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Star,
  Heart,
  Plus,
  Check,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

/* Chef's recommended picks — IDs match menuItems.js */
const RECOMMENDED = [
  {
    id: "bg-01",                       // ← matches menuItems.js
    no: "01",
    name: "The Classic Smash",
    tagline: "The one that started it all",
    reason:
      "Perfect balance of savoury, saucy, and soft. Two smashed patties, aged cheddar, house sauce — nothing more needed.",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    price: 249,
    mrp: 299,
    rating: 4.9,
    reviews: 218,
    category: "burgers",
  },
  {
    id: "sh-01",                       // ← matches menuItems.js
    no: "02",
    name: "Belgian Choco Shake",
    tagline: "Thick enough to hold a straw",
    reason:
      "Real Belgian chocolate, real cream, real soft-serve swirl. Rich, cold, and unapologetically indulgent.",
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80",
    price: 179,
    mrp: 219,
    rating: 4.8,
    reviews: 152,
    category: "shakes",
  },
];

export default function MenuFeatured() {
  const [added, setAdded] = useState(null);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  const handleAdd = (item) => {
    addItem(item);
    setAdded(item.id);
    setTimeout(() => setAdded(null), 1400);
  };

  const handleWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(item);
  };

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-12">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(249 115 22 / 0.14) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* ── Header ─────────────────────────────────── */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem] lg:text-[2.4rem]">
            Minimal &amp; classy —{" "}
            <span className="font-serif italic font-normal text-brand-500">
              recommended.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-[1.7] text-neutral-600">
            Two signatures our chef insists every first-timer tries. Simple,
            clean, unforgettable.
          </p>
        </div>

        {/* ── Editorial alternating picks ─────────────── */}
        <div className="mt-16 space-y-20 sm:mt-20 lg:space-y-28">
          {RECOMMENDED.map((item, index) => {
            const reverse = index % 2 === 1;
            const isAdded = added === item.id;
            const wishlisted = isWishlisted(item.id);

            return (
              <article
                key={item.id}
                className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
              >
                {/* ── Image ──────────────────────────── */}
                <div
                  className={`relative lg:col-span-7 ${
                    reverse ? "lg:order-2" : ""
                  }`}
                >
                  {/* Ghost number behind */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute -z-10 select-none font-display text-[140px] font-extrabold leading-none tracking-tighter text-brand-500/15 sm:text-[180px] lg:text-[220px] ${
                      reverse
                        ? "-right-4 top-2 sm:-right-6 sm:top-4"
                        : "-left-4 top-2 sm:-left-6 sm:top-4"
                    }`}
                  >
                    {item.no}
                  </span>

                  {/* Image card — links to detail page */}
                  <Link
                    href={`/menu/${item.slug}`}
                    className="relative block aspect-[5/4] overflow-hidden rounded-3xl bg-neutral-100"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                      loading="lazy"
                    />

                    {/* Warm tint on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />

                    {/* Rating chip */}
                    <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-neutral-900 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                      {item.rating}
                      <span className="font-medium text-neutral-400">
                        ({item.reviews})
                      </span>
                    </span>

                    {/* Chef's Pick chip */}
                    {/* <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-neutral-950/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      <Flame className="h-3 w-3 text-brand-400" />
                      Chef&apos;s Pick
                    </span> */}
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
                    className={`absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
                      wishlisted
                        ? "bg-brand-500 text-white shadow-[0_10px_26px_-10px_rgba(249,115,22,0.8)]"
                        : "bg-white/95 text-neutral-700 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] hover:bg-brand-50 hover:text-brand-600"
                    }`}
                  >
                    <Heart
                      className={`h-4.5 w-4.5 transition-transform duration-300 ${
                        wishlisted ? "fill-white scale-110" : ""
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                </div>

                {/* ── Content ────────────────────────── */}
                <div
                  className={`lg:col-span-5 ${
                    reverse ? "lg:order-1" : ""
                  }`}
                >
                  {/* Tagline */}
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-600">
                    {item.tagline}
                  </p>

                  {/* Name — links to detail */}
                  <Link href={`/menu/${item.id}`}>
                    <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 transition-colors hover:text-brand-600 sm:text-[1.85rem] lg:text-[2rem]">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Divider line */}
                  <div className="mt-5 flex items-center gap-3">
                    <span className="h-px w-10 bg-brand-500" />
                    <span className="h-1 w-1 rounded-full bg-brand-500" />
                  </div>

                  {/* Reason */}
                  <p className="mt-5 text-[14.5px] leading-[1.75] text-neutral-600">
                    {item.reason}
                  </p>

                  {/* Price */}
                  <div className="mt-7 flex items-baseline gap-3">
                    <span className="font-display text-[1.6rem] font-bold text-neutral-950 sm:text-[1.75rem]">
                      ₹{item.price}
                    </span>
                    {item.mrp && (
                      <span className="text-[14px] font-medium text-neutral-400 line-through">
                        ₹{item.mrp}
                      </span>
                    )}
                    {item.mrp && (
                      <span className="ml-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                        Save ₹{item.mrp - item.price}
                      </span>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {/* Add to order — wired to cart */}
                    <button
                      type="button"
                      onClick={() => handleAdd(item)}
                      className={`group/btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 ${
                        isAdded
                          ? "bg-emerald-500 shadow-[0_14px_32px_-10px_rgba(16,185,129,0.6)]"
                          : "bg-neutral-950 hover:bg-brand-500 hover:shadow-[0_14px_32px_-10px_rgba(249,115,22,0.6)]"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          Added to cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add to order
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                        </>
                      )}
                    </button>

                    {/* View details — links to product page */}
                    <Link
                      href={`/menu/${item.id}`}
                      className="group/link inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-700 transition-colors hover:text-brand-600"
                    >
                      <span className="border-b border-neutral-300 pb-0.5 transition-colors group-hover/link:border-brand-500">
                        View details
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}