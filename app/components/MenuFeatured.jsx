"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Star,
  Heart,
  Check,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { api } from "../lib/api";

/* Editorial overrides keyed by slug — optional.
   If an item has a matching entry here, its tagline/reason override
   the auto-generated ones. New items created by admin use the
   fallbacks (tag → "Chef's recommendation", desc → reason). */
const EDITORIAL = {
  "the-classic-smash": {
    tagline: "The one that started it all",
    reason:
      "Perfect balance of savoury, saucy, and soft. Two smashed patties, aged cheddar, house sauce — nothing more needed.",
  },
  "belgian-choco-shake": {
    tagline: "Thick enough to hold a straw",
    reason:
      "Real Belgian chocolate, real cream, real soft-serve swirl. Rich, cold, and unapologetically indulgent.",
  },
};

function normalize(item, index) {
  const editorial = EDITORIAL[item.slug] || {};
  return {
    ...item,
    id: item.slug,
    no: String(index + 1).padStart(2, "0"),
    tagline: editorial.tagline || item.tag || "Chef's recommendation",
    reason: editorial.reason || item.desc || "",
  };
}

export default function MenuFeatured() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(null);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  useEffect(() => {
    let live = true;
    api
      .getFeaturedBestsellers()
      .then((res) => {
        if (!live) return;
        const items = (res.data?.items || []).slice(0, 2);
        setFeatured(items.map(normalize));
      })
      .catch(() => {
        if (live) setFeatured([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

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

  /* If nothing featured, hide the section */
  if (!loading && featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-12">
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
        {loading ? (
          <FeaturedSkeleton />
        ) : (
          <div className="mt-16 space-y-20 sm:mt-20 lg:space-y-28">
            {featured.map((item, index) => {
              const reverse = index % 2 === 1;
              const isAdded = added === item.id;
              const wishlisted = isWishlisted(item.slug);

              return (
                <article
                  key={item.slug}
                  className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-14"
                >
                  {/* ── Image ──────────────────────────── */}
                  <div
                    className={`relative lg:col-span-7 ${
                      reverse ? "lg:order-2" : ""
                    }`}
                  >
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

                      <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />

                      <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-neutral-900 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                        {item.rating}
                        <span className="font-medium text-neutral-400">
                          ({item.reviews})
                        </span>
                      </span>
                    </Link>

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
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-600">
                      {item.tagline}
                    </p>

                    <Link href={`/menu/${item.slug}`}>
                      <h3 className="mt-4 font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 transition-colors hover:text-brand-600 sm:text-[1.85rem] lg:text-[2rem]">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="h-px w-10 bg-brand-500" />
                      <span className="h-1 w-1 rounded-full bg-brand-500" />
                    </div>

                    <p className="mt-5 text-[14.5px] leading-[1.75] text-neutral-600">
                      {item.reason}
                    </p>

                    <div className="mt-7 flex items-baseline gap-3">
                      <span className="font-display text-[1.6rem] font-bold text-neutral-950 sm:text-[1.75rem]">
                        ₹{item.price}
                      </span>
                      {item.mrp && (
                        <span className="text-[14px] font-medium text-neutral-400 line-through">
                          ₹{item.mrp}
                        </span>
                      )}
                      {item.mrp && item.mrp > item.price && (
                        <span className="ml-1 rounded-full bg-brand-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                          Save ₹{item.mrp - item.price}
                        </span>
                      )}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
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

                      <Link
                        href={`/menu/${item.slug}`}
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
        )}
      </div>
    </section>
  );
}

/* ── Loading skeleton ────────────────────────────── */
function FeaturedSkeleton() {
  return (
    <div className="mt-16 space-y-20 sm:mt-20 lg:space-y-28">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="grid animate-pulse items-center gap-10 lg:grid-cols-12 lg:gap-14"
        >
          <div
            className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
          >
            <div className="aspect-[5/4] rounded-3xl bg-neutral-200/70" />
          </div>
          <div
            className={`space-y-4 lg:col-span-5 ${
              i % 2 === 1 ? "lg:order-1" : ""
            }`}
          >
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className="h-8 w-3/4 rounded bg-neutral-200" />
            <div className="h-px w-16 bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-100" />
            <div className="h-4 w-5/6 rounded bg-neutral-100" />
            <div className="mt-6 h-8 w-24 rounded bg-neutral-200" />
            <div className="mt-6 h-12 w-48 rounded-full bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}


