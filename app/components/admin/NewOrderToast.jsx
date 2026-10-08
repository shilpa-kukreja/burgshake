"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowUpRight } from "lucide-react";

export default function NewOrderToast({ order, onDismiss }) {
  if (!order) return null;

  const { orderNumber, customer, total, items } = order;
  const itemCount = items?.length || 0;

  return (
    <div className="pointer-events-auto fixed right-4 top-20 z-[200] w-[340px] max-w-[calc(100vw-2rem)]">
      <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-[0_20px_50px_-15px_rgba(249,115,22,0.4)] ring-1 ring-brand-100">
        {/* Accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-400 to-brand-600" />

        <div className="flex items-start gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <ShoppingBag className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-600">
                  New order received
                </div>
                <div className="mt-0.5 truncate font-display text-[14px] font-bold text-neutral-950">
                  {orderNumber}
                </div>
              </div>

              <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className="-mr-1 -mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-neutral-500">
              <span className="font-semibold text-neutral-800">
                {customer?.name || "Guest"}
              </span>
              <span className="text-neutral-300">·</span>
              <span>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="text-neutral-300">·</span>
              <span className="font-bold text-neutral-900">₹{total}</span>
            </div>

            <Link
              href={`/admin/orders/${orderNumber}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand-600 transition-colors hover:text-brand-700"
            >
              View order
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}