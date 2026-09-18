"use client";

import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeItem,
    subtotal,
    tax,
    total,
    count,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* ── Backdrop ───────────────────────────────── */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[70] bg-neutral-950/45 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
      />

      {/* ── Drawer panel ───────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[80] flex h-full w-full flex-col bg-[#FDFCFB] shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[440px] lg:w-[480px] sm:rounded-l-3xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* ── Warm glow decoration ─────────────────── */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-l-3xl"
        >
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.16)_0%,_transparent_65%)]" />
        </div> */}

        {/* ── Header ───────────────────────────────── */}
        <header className="relative flex items-start justify-between gap-4 border-b border-neutral-200/70 px-6 py-5 sm:px-7 sm:py-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-5 bg-brand-500" />
              Your Order
            </div>
            <h2 className="mt-2 font-display text-[20px] font-bold leading-tight tracking-[-0.015em] text-neutral-950 sm:text-[22px]">
              {count > 0 ? (
                <>
                  {count} {count === 1 ? "item" : "items"} in your bag
                </>
              ) : (
                <>Your bag is empty</>
              )}
            </h2>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="group grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:rotate-90 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ── Pickup strip ─────────────────────────── */}
        {items.length > 0 && (
          <div className="relative flex items-center justify-between gap-3 border-b border-neutral-200/70 bg-gradient-to-r from-brand-50/70 to-transparent px-6 py-3 sm:px-7">
            <div className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-100">
                <Clock className="h-3 w-3 text-brand-600" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
                Ready in ~15 min
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              <MapPin className="h-3 w-3" />
              Takeaway only
            </div>
          </div>
        )}

        {/* ── Scrollable body ──────────────────────── */}
        <div className="relative flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* ── Empty state ────────────────────────── */
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-full bg-brand-400/25 blur-3xl" />
                <div className="grid h-20 w-20 place-items-center rounded-full border border-neutral-200 bg-white shadow-[0_10px_30px_-12px_rgba(249,115,22,0.4)]">
                  <ShoppingBag className="h-8 w-8 text-brand-500" strokeWidth={1.8} />
                </div>
              </div>

              <h3 className="mt-6 font-display text-[17px] font-bold tracking-[-0.01em] text-neutral-950">
                Nothing here yet.
              </h3>
              <p className="mt-2 max-w-xs text-[13px] leading-[1.65] text-neutral-500">
                Add a burger, a shake, or a side — your fresh-picked order will
                show up right here.
              </p>

              <Link
                href="/menu"
                onClick={closeCart}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_12px_28px_-10px_rgba(249,115,22,0.6)]"
              >
                Browse the menu
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            /* ── Item list ─────────────────────────── */
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
                    {/* Name */}
                    <h3 className="line-clamp-1 font-display text-[14.5px] font-bold leading-tight tracking-[-0.01em] text-neutral-950">
                      {item.name}
                    </h3>

                    {/* Unit price */}
                    <p className="mt-1 text-[11.5px] font-medium text-neutral-400">
                      ₹{item.price} each
                    </p>

                    {/* Qty controls + total row */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-full border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                        <button
                          onClick={() =>
                            updateQty(item.id, (item.qty || 1) - 1)
                          }
                          aria-label="Decrease quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-600 active:scale-90"
                        >
                          <Minus className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                        <span className="min-w-[24px] text-center text-[13px] font-bold tabular-nums text-neutral-900">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.id, (item.qty || 1) + 1)
                          }
                          aria-label="Increase quantity"
                          className="grid h-7 w-7 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-600 active:scale-90"
                        >
                          <Plus className="h-3 w-3" strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="flex items-center gap-3">
                        <span className="font-display text-[14px] font-bold tabular-nums text-neutral-950">
                          ₹{item.price * (item.qty || 1)}
                        </span>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
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

        {/* ── Footer (summary + CTA) ───────────────── */}
        {items.length > 0 && (
          <footer className="relative border-t border-neutral-200/70 bg-white/70 backdrop-blur-sm">
            <div className="px-6 py-5 sm:px-7 sm:py-6">
              {/* Summary rows */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-neutral-500">
                    Subtotal
                  </span>
                  <span className="font-semibold tabular-nums text-neutral-900">
                    ₹{subtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-neutral-500">
                    Taxes (5% GST)
                  </span>
                  <span className="font-semibold tabular-nums text-neutral-900">
                    ₹{tax}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-3 h-px w-full bg-neutral-200/80" />

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                    Total
                  </span>
                  <span className="font-display text-[20px] font-extrabold tabular-nums tracking-[-0.01em] text-neutral-950">
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  setCheckoutOpen(true);
                }}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-[13.5px] font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_16px_40px_-12px_rgba(249,115,22,0.7)]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              {/* Trust micro-line */}
              <p className="mt-3 text-center text-[10.5px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                Secure payment · Razorpay
              </p>
            </div>
          </footer>
        )}
      </aside>
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}