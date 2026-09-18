"use client";

import { use, useEffect, useState } from "react";
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
  CheckCircle2,
} from "lucide-react";
import AdminGuard from "../../../components/admin/AdminGuard";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { api } from "../../../lib/api";

export default function OrderDetailPage({ params }) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.adminGetOrder(orderNumber);
        if (active) setOrder(res.data.order);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [orderNumber]);

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title={orderNumber}
        subtitle={order ? `${order.customer.name} · ₹${order.total}` : "Loading…"}
        onMenuClick={handleMenuClick}
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
        ) : order ? (
          <div className="grid gap-5 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-5 lg:col-span-8">
              {/* Items */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
                  <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
                    Items
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    {order.items.length}
                  </span>
                </div>
                <ul className="divide-y divide-neutral-200/70">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-4 px-5 py-4"
                    >
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
                        <div className="text-[13.5px] font-bold text-neutral-950">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-neutral-500">
                          ₹{item.price} × {item.qty}
                        </div>
                      </div>
                      <div className="shrink-0 font-display text-[14px] font-bold tabular-nums text-neutral-950">
                        ₹{item.price * item.qty}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Totals */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="space-y-2.5">
                  <Row label="Subtotal" value={`₹${order.subtotal}`} />
                  <Row label="Tax (5%)" value={`₹${order.tax}`} />
                  {order.discount > 0 && (
                    <Row
                      label={`Discount ${order.couponCode ? `(${order.couponCode})` : ""}`}
                      value={`−₹${order.discount}`}
                      accent="emerald"
                    />
                  )}
                  <div className="my-2 h-px bg-neutral-200" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                      Total ({order.paymentLabel})
                    </span>
                    <span className="font-display text-[20px] font-extrabold tabular-nums text-neutral-950">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
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
            </div>

            {/* Right column */}
            <div className="space-y-5 lg:col-span-4">
              {/* Status card */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Status
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" />
                  <span className="font-display text-[16px] font-bold capitalize text-neutral-950">
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Payment
                </div>
                <div className="mt-2 text-[14px] font-bold capitalize text-neutral-950">
                  {order.paymentLabel}
                </div>
                {order.razorpay?.paymentId && (
                  <div className="mt-3 rounded-lg bg-neutral-50 p-2 font-mono text-[10.5px] text-neutral-600">
                    {order.razorpay.paymentId}
                  </div>
                )}
              </div>

              {/* Customer */}
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

              {/* Pickup */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white p-5">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                  Pickup
                </div>
                <div className="mt-3 space-y-3">
                  <InfoRow icon={MapPin} value={order.pickup.outletName} />
                  <InfoRow
                    icon={Clock}
                    value={`${order.pickup.date}, ${order.pickup.timeSlotLabel}`}
                  />
                  <p className="text-[11.5px] leading-relaxed text-neutral-500">
                    {order.pickup.outletAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </AdminGuard>
  );
}

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