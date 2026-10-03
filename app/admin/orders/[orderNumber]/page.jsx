"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Banknote,
  Check,
  Copy,
  ChefHat,
  Package,
  CheckCircle2,
  XCircle,
  PlayCircle,
  RotateCw,
  Download,
} from "lucide-react";
import AdminGuard from "../../../components/admin/AdminGuard";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { api } from "../../../lib/api";
import { generateOrderReceipt } from "../../../lib/receipt";

/* ── Status flow: what the "next" button does ────────── */
const NEXT_STATUS = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "completed",
};

const NEXT_LABEL = {
  confirmed: "Confirm order",
  preparing: "Start preparing",
  ready: "Mark ready",
  completed: "Mark completed",
};

/* ── Status timeline events ──────────────────────────── */
const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  preparing: ChefHat,
  ready: Package,
  completed: Check,
  cancelled: XCircle,
};

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

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function OrderDetailPage({ params }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.adminGetOrder(orderNumber);
      setOrder(res.data.order);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  /* ── Status / payment actions ────────────────────── */
  const updateStatus = async (newStatus, note) => {
    setBusy(`status:${newStatus}`);
    try {
      const res = await api.adminUpdateOrderStatus(
        orderNumber,
        newStatus,
        note,
      );
      setOrder(res.data.order);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const updatePayment = async (paymentStatus) => {
    setBusy(`payment:${paymentStatus}`);
    try {
      const res = await api.adminUpdatePaymentStatus(
        orderNumber,
        paymentStatus,
      );
      setOrder(res.data.order);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    try {
      generateOrderReceipt(order);
    } catch (err) {
      console.error("Receipt generation failed:", err);
      alert("Couldn't generate the receipt. Please try again.");
    }
  };

  /* ── Derived flags ───────────────────────────────── */
  const isCancelled = order?.status === "cancelled";
  const isCompleted = order?.status === "completed";
  const isTerminal = isCancelled || isCompleted;
  const nextStatus = order ? NEXT_STATUS[order.status] : null;
  const needsCounterPayment =
    order?.payment === "counter" && order.paymentStatus !== "paid";

  return (
    <AdminGuard>
      <AdminTopbar
        title={orderNumber}
        subtitle={
          order ? `${order.customer.name} · ₹${order.total}` : "Loading…"
        }
        onMenuClick={handleMenuClick}
        actions={
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={!order || loading}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_10px_26px_-10px_rgba(249,115,22,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            Download Receipt
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Link
          href="/admin/orders"
          className="group mb-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to orders
        </Link>

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        ) : !order ? null : (
          <div className="grid gap-5 lg:grid-cols-12">
            {/* ══════════ LEFT COLUMN ══════════ */}
            <div className="space-y-5 lg:col-span-8">
              {/* ── Items ─────────────────────── */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
                  <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
                    Items
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </span>
                </div>
                <ul className="divide-y divide-neutral-200/70">
                  {order.items.map((item, i) => {
                    const c = item.customizations;
                    const customParts = c
                      ? [c.bun, c.patty, ...(c.extras || [])].filter(Boolean)
                      : [];

                    return (
                      <li key={i} className="flex items-start gap-4 px-5 py-4">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {item.img && (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <div className="text-[13.5px] font-bold text-neutral-950">
                              {item.name}
                            </div>
                            <div className="shrink-0 font-display text-[14px] font-bold tabular-nums text-neutral-950">
                              ₹{item.price * item.qty}
                            </div>
                          </div>

                          {/* Customizations */}
                          {customParts.length > 0 && (
                            <div className="mt-1 text-[11.5px] font-medium text-neutral-500">
                              {customParts.join(" · ")}
                            </div>
                          )}

                          <div className="mt-1 text-[11.5px] text-neutral-400">
                            ₹{item.price} × {item.qty}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ── Totals ───────────────────── */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="space-y-2.5">
                  <Row label="Subtotal" value={`₹${order.subtotal}`} />
                  <Row label="Tax (5% GST)" value={`₹${order.tax}`} />
                  {order.discount > 0 && (
                    <Row
                      label={`Discount${
                        order.couponCode ? ` (${order.couponCode})` : ""
                      }`}
                      value={`−₹${order.discount}`}
                      accent="emerald"
                    />
                  )}
                  <div className="my-2 h-px bg-neutral-200" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Total
                    </span>
                    <span className="font-display text-[20px] font-extrabold tabular-nums text-neutral-950">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Notes ─────────────────────── */}
              {order.notes && (
                <div className="rounded-3xl border border-amber-200/70 bg-amber-50/50 p-5">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-amber-700">
                        Special instructions
                      </div>
                      <p className="mt-1.5 text-[13px] italic leading-relaxed text-amber-800">
                        &ldquo;{order.notes}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Timeline ──────────────────── */}
              {/* {order.statusHistory && order.statusHistory.length > 0 && (
                <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                  <h2 className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
                    Timeline
                  </h2>
                  <ol className="mt-4 space-y-4">
                    {[...order.statusHistory].reverse().map((entry, i) => {
                      const Icon = STATUS_ICONS[entry.status] || Clock;
                      const isLatest = i === 0;
                      return (
                        <li key={i} className="flex gap-3">
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                              isLatest
                                ? "bg-brand-500 text-white"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </span>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="text-[12.5px] font-bold capitalize text-neutral-900">
                              {entry.status}
                            </div>
                            <div className="mt-0.5 text-[11px] text-neutral-500">
                              {formatDateTime(entry.at)}
                            </div>
                            {entry.note && (
                              <div className="mt-1 text-[11.5px] italic text-neutral-500">
                                {entry.note}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                
                    <li className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500">
                        <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <div className="pt-0.5">
                        <div className="text-[12.5px] font-bold text-neutral-900">
                          Order created
                        </div>
                        <div className="mt-0.5 text-[11px] text-neutral-500">
                          {formatDateTime(order.createdAt)}
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              )} */}
            </div>

            <div className="space-y-5 lg:col-span-4">
              {/* <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Status
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusDot status={order.status} />
                      <span className="font-display text-[16px] font-bold capitalize text-neutral-950">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={copyOrderNumber}
                    title="Copy order number"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

              
                <div className="mt-4 space-y-2">
                  {!isTerminal && nextStatus && (
                    <button
                      onClick={() => updateStatus(nextStatus)}
                      disabled={busy !== null}
                      className="group flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-[12.5px] font-bold text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === `status:${nextStatus}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PlayCircle className="h-3.5 w-3.5" />
                      )}
                      {NEXT_LABEL[nextStatus]}
                    </button>
                  )}

                  {!isTerminal && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Cancel this order? This cannot be undone."
                          )
                        )
                          updateStatus("cancelled", "Cancelled by admin");
                      }}
                      disabled={busy !== null}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === "status:cancelled" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      Cancel order
                    </button>
                  )}

                  {isTerminal && (
                    <button
                      onClick={() =>
                        updateStatus("confirmed", "Reopened by admin")
                      }
                      disabled={busy !== null}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-neutral-600 transition-all hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busy === "status:confirmed" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCw className="h-3.5 w-3.5" />
                      )}
                      Reopen order
                    </button>
                  )}
                </div>
              </div> */}

              {/* ── Payment ───────────────────── */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    Payment
                  </div>
                  {order.payment === "razorpay" ? (
                    <CreditCard className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <Banknote className="h-4 w-4 text-neutral-400" />
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <PaymentDot status={order.paymentStatus} />
                  <span className="text-[14px] font-bold text-neutral-950">
                    {order.paymentLabel}
                  </span>
                </div>

                <div className="mt-1 text-[11.5px] text-neutral-500">
                  {order.payment === "razorpay"
                    ? "Paid online via Razorpay"
                    : "Collect at counter on pickup"}
                </div>

                {/* Counter payment — mark paid button */}
                {needsCounterPayment && !isCancelled && (
                  <button
                    onClick={() => updatePayment("paid")}
                    disabled={busy !== null}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy === "payment:paid" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                    Mark as paid
                  </button>
                )}

                {/* Razorpay details */}
                {order.razorpay?.paymentId && (
                  <div className="mt-4 space-y-2 border-t border-neutral-200/70 pt-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Razorpay
                    </div>
                    {order.razorpay.paymentId && (
                      <DetailLine
                        label="Payment ID"
                        value={order.razorpay.paymentId}
                        mono
                      />
                    )}
                    {order.razorpay.orderId && (
                      <DetailLine
                        label="Order ID"
                        value={order.razorpay.orderId}
                        mono
                      />
                    )}
                    {order.razorpay.paidAt && (
                      <DetailLine
                        label="Paid at"
                        value={formatDateTime(order.razorpay.paidAt)}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* ── Customer ──────────────────── */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Customer
                </div>
                <div className="mt-3 space-y-3">
                  <InfoRow icon={User} value={order.customer.name} />
                  <InfoRow
                    icon={Phone}
                    value={order.customer.phone}
                    href={`tel:+91${order.customer.phone}`}
                  />
                  <InfoRow
                    icon={Mail}
                    value={order.customer.email}
                    href={`mailto:${order.customer.email}`}
                  />
                </div>
              </div>

              {/* ── Pickup ────────────────────── */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Pickup
                </div>
                <div className="mt-3 space-y-3">
                  <InfoRow icon={MapPin} value={order.pickup.outletName} />
                  <InfoRow
                    icon={Clock}
                    value={`${formatPickupDate(order.pickup.date)}, ${
                      order.pickup.timeSlotLabel
                    }`}
                  />
                  <p className="pl-[38px] text-[11.5px] leading-relaxed text-neutral-500">
                    {order.pickup.outletAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

/* ══════════════════════════════════════════════════
   SMALL PIECES
   ══════════════════════════════════════════════════ */

function Row({ label, value, accent = "neutral" }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-neutral-500">{label}</span>
      <span
        className={`font-semibold tabular-nums ${
          accent === "emerald" ? "text-emerald-700" : "text-neutral-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({ icon: Icon, value, href }) {
  const content = (
    <>
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-50">
        <Icon className="h-3.5 w-3.5 text-brand-600" />
      </span>
      <span className="truncate text-[13px] font-semibold text-neutral-800">
        {value}
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex items-center gap-2.5 transition-colors hover:text-brand-600"
    >
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-2.5">{content}</div>
  );
}

function DetailLine({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="text-neutral-400">{label}</span>
      <span
        className={`truncate text-neutral-700 ${
          mono ? "font-mono" : "font-semibold"
        }`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function StatusDot({ status }) {
  const colors = {
    pending: "bg-amber-500",
    confirmed: "bg-blue-500",
    preparing: "bg-brand-500",
    ready: "bg-emerald-500",
    completed: "bg-neutral-400",
    cancelled: "bg-red-500",
  };
  return (
    <span
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        colors[status] || "bg-neutral-400"
      }`}
    />
  );
}

function PaymentDot({ status }) {
  const colors = {
    paid: "bg-emerald-500",
    pending: "bg-amber-500",
    failed: "bg-red-500",
    refunded: "bg-neutral-400",
  };
  return (
    <span
      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
        colors[status] || "bg-neutral-400"
      }`}
    />
  );
}
