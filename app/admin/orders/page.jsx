"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  ChevronDown,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListOrders({ limit: 100 });
      setOrders(res.data.orders);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (status !== "all") list = list.filter((o) => o.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer?.name?.toLowerCase().includes(q) ||
          o.customer?.phone?.includes(q)
      );
    }
    return list;
  }, [orders, status, search]);

  const updateStatus = async (orderNumber, newStatus) => {
    setBusy(orderNumber);
    try {
      await api.adminUpdateOrderStatus(orderNumber, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Orders"
        subtitle={`${orders.length} total orders`}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
                  status === t.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order #, name, phone…"
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

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <p className="font-display text-[15px] font-bold text-neutral-800">
              No orders found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <article
                key={order._id}
                className="rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-200 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Left: order info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[15px] font-bold text-neutral-950">
                        {order.orderNumber}
                      </span>
                      <StatusChip status={order.status} />
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ring-1 ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-neutral-500">
                      <span className="font-semibold text-neutral-700">
                        {order.customer?.name}
                      </span>
                      <span>{order.customer?.phone}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {order.pickup?.outletName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {order.pickup?.timeSlotLabel}
                      </span>
                    </div>
                  </div>

                  {/* Middle: total */}
                  <div className="shrink-0 text-right sm:text-center">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Total
                    </div>
                    <div className="mt-0.5 font-display text-[18px] font-extrabold tabular-nums text-neutral-950">
                      ₹{order.total}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    {/* Status dropdown */}
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.orderNumber, e.target.value)
                        }
                        disabled={busy === order.orderNumber}
                        className="appearance-none rounded-full border border-neutral-200 bg-white py-2 pl-3.5 pr-8 text-[11.5px] font-bold uppercase tracking-[0.1em] text-neutral-700 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-400" />
                    </div>

                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-brand-500"
                    >
                      View
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

function StatusChip({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
    preparing: "bg-brand-50 text-brand-700 ring-brand-200",
    ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    completed: "bg-neutral-100 text-neutral-700 ring-neutral-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ring-1 ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}