"use client";

import Link from "next/link";
import {
  X,
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Star,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function WishlistDrawer() {
  const {
    items,
    isOpen,
    closeWishlist,
    removeItem,
    clearWishlist,
    count,
  } = useWishlist();
  const { addItem, openCart } = useCart();

  const moveToCart = (item) => {
    addItem(item);
    removeItem(item.id);
  };

  const moveAllToCart = () => {
    items.forEach((item) => addItem(item));
    clearWishlist();
    closeWishlist();
    setTimeout(() => openCart(), 250);
  };

  return (
    <>
      {/* ── Backdrop ───────────────────────────────── */}
      <div
        onClick={closeWishlist}
        aria-hidden="true"
        className={`fixed inset-0 z-[70] bg-neutral-950/45 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* ── Drawer panel ───────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className={`fixed right-0 top-0 z-[80] flex h-full w-full flex-col bg-[#FDFCFB] shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[440px] sm:rounded-l-3xl lg:w-[480px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Warm glow */}
        

        {/* ── Header ───────────────────────────────── */}
        <header className="relative flex items-start justify-between gap-4 border-b border-neutral-200/70 px-6 py-5 sm:px-7 sm:py-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-5 bg-brand-500" />
              Saved Items
            </div>
            <h2 className="mt-2 font-display text-[20px] font-bold leading-tight tracking-[-0.015em] text-neutral-950 sm:text-[22px]">
              {count > 0 ? (
                <>
                  {count} {count === 1 ? "favourite" : "favourites"}
                </>
              ) : (
                <>Your wishlist is empty</>
              )}
            </h2>
          </div>

          <button
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="group grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:rotate-90 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ── Action strip ─────────────────────────── */}
        {items.length > 0 && (
          <div className="relative flex items-center justify-between gap-3 border-b border-neutral-200/70 bg-gradient-to-r from-brand-50/70 to-transparent px-6 py-3 sm:px-7">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
              Save · Share · Order later
            </span>

            <button
              onClick={clearWishlist}
              className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400 transition-colors hover:text-red-500"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Scrollable body ──────────────────────── */}
        <div className="relative flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-full bg-brand-400/25 blur-3xl" />
                <div className="grid h-20 w-20 place-items-center rounded-full border border-neutral-200 bg-white shadow-[0_10px_30px_-12px_rgba(249,115,22,0.4)]">
                  <Heart
                    className="h-8 w-8 text-brand-500"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <h3 className="mt-6 font-display text-[17px] font-bold tracking-[-0.01em] text-neutral-950">
                Nothing saved yet.
              </h3>
              <p className="mt-2 max-w-xs text-[13px] leading-[1.65] text-neutral-500">
                Tap the heart on any item to save it here for later.
              </p>

              <Link
                href="/menu"
                onClick={closeWishlist}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_12px_28px_-10px_rgba(249,115,22,0.6)]"
              >
                Browse the menu
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            /* Item list */
            <ul className="divide-y divide-neutral-200/70 px-6 sm:px-7">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="group/item flex items-start gap-4 py-5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/item:scale-[1.06]"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Name + rating */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 font-display text-[14.5px] font-bold leading-tight tracking-[-0.01em] text-neutral-950">
                        {item.name}
                      </h3>

                      {item.rating && (
                        <span className="flex shrink-0 items-center gap-0.5 text-[10.5px] font-bold text-neutral-700">
                          <Star className="h-2.5 w-2.5 fill-brand-500 text-brand-500" />
                          {item.rating}
                        </span>
                      )}
                    </div>

                    {/* Desc */}
                    {item.desc && (
                      <p className="mt-1 line-clamp-1 text-[11.5px] leading-relaxed text-neutral-500">
                        {item.desc}
                      </p>
                    )}

                    {/* Price + actions */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[14px] font-bold text-neutral-950">
                          ₹{item.price}
                        </span>
                        {item.mrp && (
                          <span className="text-[11px] font-medium text-neutral-400 line-through">
                            ₹{item.mrp}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Move to cart */}
                        <button
                          onClick={() => moveToCart(item)}
                          aria-label={`Move ${item.name} to cart`}
                          className="group/mc inline-flex items-center gap-1 rounded-full bg-neutral-950 px-3 py-1.5 text-[11px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_8px_20px_-8px_rgba(249,115,22,0.6)]"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          <span className="hidden sm:inline">Add to cart</span>
                          <span className="sm:hidden">Add</span>
                        </button>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="grid h-7 w-7 place-items-center rounded-full text-neutral-400 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer ───────────────────────────────── */}
        {items.length > 0 && (
          <footer className="relative border-t border-neutral-200/70 bg-white/70 backdrop-blur-sm">
            <div className="px-6 py-5 sm:px-7 sm:py-6">
              <button
                onClick={moveAllToCart}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-[13.5px] font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_16px_40px_-12px_rgba(249,115,22,0.7)]"
              >
                <ShoppingBag className="h-4 w-4" />
                Move all to cart
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              <p className="mt-3 text-center text-[10.5px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                Saved on this device
              </p>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}