"use client";

import { useState, useMemo } from "react";
import { resolveImageUrl} from "../lib/api"
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Package,
  Loader2,
} from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* "2026-09-23" → "Today" | "Tomorrow" | "Fri, 26 Sep" */
function formatPickupDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d)) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AccountOrders({ orders = [], loading = false }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let list = [...orders];

    /* Date filter — uses createdAt (backend) */
    const now = new Date();
    if (filter === "today") {
      list = list.filter(
        (o) => o.createdAt && isSameDay(new Date(o.createdAt), now)
      );
    } else if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(
        (o) => o.createdAt && new Date(o.createdAt) >= weekAgo
      );
    } else if (filter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter(
        (o) => o.createdAt && new Date(o.createdAt) >= monthAgo
      );
    }

    /* Search by order number or item name */
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.items?.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, filter, search]);

  /* ── Loading skeleton ────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-3.5">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5"
          >
            <div className="flex gap-0">
              <div className="h-12 w-12 rounded-xl bg-neutral-200" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-neutral-200" />
              <div className="h-3 w-48 rounded bg-neutral-100" />
            </div>
            <div className="h-5 w-16 rounded bg-neutral-200" />
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────── */
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 ring-1 ring-brand-100">
          <ShoppingBag className="h-7 w-7 text-brand-500" strokeWidth={1.8} />
        </div>
        <h3 className="mt-5 font-display text-[17px] font-bold tracking-[-0.01em] text-neutral-950">
          No orders yet
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-[1.65] text-neutral-500">
          Once you place your first Burgshake order, it&apos;ll show up here
          with full details.
        </p>
        <Link
          href="/menu"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[13px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_12px_28px_-10px_rgba(249,115,22,0.6)]"
        >
          Browse the menu
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                filter === f.id
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # or item…"
            className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-[12.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Order count */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {filtered.length} {filtered.length === 1 ? "order" : "orders"}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-12 text-center">
          <p className="font-display text-[15px] font-bold text-neutral-800">
            No orders match your filter
          </p>
          <p className="mt-1.5 text-[12.5px] text-neutral-500">
            Try a different time range or clear the search.
          </p>
        </div>
      ) : (
        <ul className="space-y-3.5">
          {filtered.map((order) => {
            const isOpen = expanded === order.orderNumber;
            const placedDate = order.createdAt
              ? new Date(order.createdAt)
              : null;

            return (
              <li
                key={order.orderNumber}
                className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white transition-all duration-300 hover:border-brand-200 hover:shadow-[0_20px_44px_-24px_rgba(249,115,22,0.28)]"
              >
                {/* ── Summary row ─────────────────── */}
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : order.orderNumber)
                  }
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  {/* Thumbnail stack */}
                  <div className="relative flex shrink-0 items-center">
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <div
                        key={`${item.slug}-${i}`}
                        className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-neutral-100 ring-1 ring-neutral-200/70"
                        style={{
                          marginLeft: i === 0 ? 0 : -12,
                          zIndex: 10 - i,
                        }}
                      >
                        <img
                          src={resolveImageUrl(item.img)}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div
                        className="relative grid h-12 w-12 place-items-center rounded-xl border-2 border-white bg-neutral-950 text-[11px] font-bold text-white ring-1 ring-neutral-200/70"
                        style={{ marginLeft: -12, zIndex: 0 }}
                      >
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
                        {order.orderNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-emerald-700 ring-1 ring-emerald-200">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        {order.paymentLabel || "Confirmed"}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-medium text-neutral-500">
                      {placedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {placedDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                      {order.pickup?.timeSlotLabel && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {order.pickup.timeSlotLabel}
                        </span>
                      )}
                      {order.pickup?.outletName && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.pickup.outletName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Total
                      </div>
                      <div className="mt-0.5 font-display text-[15px] font-extrabold tabular-nums text-neutral-950">
                        ₹{order.total}
                      </div>
                    </div>

                    <span className="grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-all duration-300">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>

                {/* ── Expanded details ─────────────── */}
                {isOpen && (
                  <div className="border-t border-neutral-200/70 bg-neutral-50/40 px-5 py-5">
                    {/* Items */}
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                      Items
                    </div>
                    <ul className="mt-3 space-y-2.5">
                      {(order.items || []).map((item, idx) => {
                        const c = item.customizations;
                        const customParts = c
                          ? [c.bun, c.patty, ...(c.extras || [])].filter(
                              Boolean
                            )
                          : [];

                        return (
                          <li
                            key={`${item.slug}-${idx}`}
                            className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-white p-2.5"
                          >
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                              <img
                                src={resolveImageUrl(item.img)}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[12.5px] font-bold text-neutral-900">
                                {item.name}
                              </div>
                              {customParts.length > 0 && (
                                <div className="mt-0.5 truncate text-[10.5px] font-medium text-neutral-500">
                                  {customParts.join(" · ")}
                                </div>
                              )}
                              <div className="mt-0.5 text-[10.5px] font-medium text-neutral-400">
                                ₹{item.price} × {item.qty}
                              </div>
                            </div>
                            <div className="shrink-0 font-display text-[13px] font-bold tabular-nums text-neutral-950">
                              ₹{item.price * item.qty}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Totals */}
                    <div className="mt-4 space-y-2 border-t border-neutral-200/70 pt-4">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-neutral-500">Subtotal</span>
                        <span className="font-semibold tabular-nums text-neutral-900">
                          ₹{order.subtotal}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-neutral-500">
                          Taxes (5% GST)
                        </span>
                        <span className="font-semibold tabular-nums text-neutral-900">
                          ₹{order.tax}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex items-center justify-between text-[12px] text-emerald-700">
                          <span>
                            Discount
                            {order.couponCode
                              ? ` (${order.couponCode})`
                              : ""}
                          </span>
                          <span className="font-semibold tabular-nums">
                            −₹{order.discount}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline justify-between border-t border-neutral-200/70 pt-2.5">
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                          Total · {order.paymentLabel}
                        </span>
                        <span className="font-display text-[16px] font-extrabold tabular-nums text-neutral-950">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Pickup note */}
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-3">
                      <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                      <p className="text-[11.5px] leading-[1.55] text-amber-800">
                        Takeaway only — pick up at{" "}
                        <strong>
                          {order.pickup?.outletName || "your selected outlet"}
                        </strong>{" "}
                        on <strong>{formatPickupDate(order.pickup?.date)}</strong>
                        {order.pickup?.timeSlotLabel && (
                          <>
                            {" "}
                            by <strong>{order.pickup.timeSlotLabel}</strong>
                          </>
                        )}
                        .
                      </p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}