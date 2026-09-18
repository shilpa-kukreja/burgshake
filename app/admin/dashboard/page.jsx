"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  UtensilsCrossed,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Package,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import StatCard from "../../components/admin/StatCard";
import { api } from "../../lib/api";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.adminDashboard();
        if (active) setData(res.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Dashboard"
        subtitle={data ? `Revenue today: ₹${data.revenue.today.toLocaleString()}` : "Loading…"}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {loading && (
          <div className="grid place-items-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-500" />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 text-[13px] font-medium text-red-700">
            Failed to load dashboard: {error}
          </div>
        )}

        {data && (
          <div className="space-y-6 sm:space-y-8">
            {/* ── Top stats ─────────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={TrendingUp}
                label="Revenue Today"
                value={`₹${data.revenue.today.toLocaleString()}`}
                subLabel={`₹${data.revenue.month.toLocaleString()} this month`}
                accent="emerald"
              />
              <StatCard
                icon={ShoppingBag}
                label="Orders Today"
                value={data.orders.today}
                subLabel={`${data.orders.total} lifetime`}
                accent="brand"
                href="/admin/orders"
              />
              <StatCard
                icon={UtensilsCrossed}
                label="Menu Items"
                value={data.menu.total}
                subLabel={`${data.menu.available} available · ${data.menu.hidden} hidden`}
                accent="amber"
                href="/admin/menu"
              />
              <StatCard
                icon={Users}
                label="Total Users"
                value={data.users.total}
                subLabel={`+${data.users.newToday} today`}
                accent="blue"
                href="/admin/users"
              />
            </div>

            {/* ── Order pipeline ────────────────────── */}
            <div className="rounded-3xl border border-neutral-200/70 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                    Orders in progress
                  </h2>
                  <p className="mt-1 text-[12.5px] text-neutral-500">
                    Live view of the kitchen pipeline
                  </p>
                </div>
                <Link
                  href="/admin/orders"
                  className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-600 hover:text-brand-700"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <PipelineTile
                  icon={Clock}
                  label="Pending"
                  value={data.orders.pending}
                  color="amber"
                />
                <PipelineTile
                  icon={ChefHat}
                  label="Preparing"
                  value={data.orders.preparing}
                  color="brand"
                />
                <PipelineTile
                  icon={Package}
                  label="Ready"
                  value={data.orders.ready}
                  color="blue"
                />
                <PipelineTile
                  icon={CheckCircle2}
                  label="Completed"
                  value={data.orders.completedToday}
                  color="emerald"
                />
              </div>
            </div>

            {/* ── Recent orders + top items ────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent orders */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
                  <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
                    Recent orders
                  </h2>
                  <Link
                    href="/admin/orders"
                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600 hover:text-brand-700"
                  >
                    See all
                  </Link>
                </div>
                <ul className="divide-y divide-neutral-200/70">
                  {data.recentOrders.length === 0 && (
                    <li className="px-5 py-8 text-center text-[13px] text-neutral-400">
                      No orders yet
                    </li>
                  )}
                  {data.recentOrders.map((o) => (
                    <li key={o._id}>
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-brand-50/40"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-[13px] font-bold text-neutral-950">
                              {o.orderNumber}
                            </span>
                            <StatusChip status={o.status} />
                          </div>
                          <div className="mt-0.5 truncate text-[11.5px] text-neutral-500">
                            {o.customer?.name} · {o.paymentStatus}
                          </div>
                        </div>
                        <div className="shrink-0 font-display text-[14px] font-bold tabular-nums text-neutral-950">
                          ₹{o.total}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top items */}
              <div className="rounded-3xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-200/70 px-5 py-4">
                  <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
                    Top sellers
                  </h2>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                    All time
                  </span>
                </div>
                <ul className="divide-y divide-neutral-200/70">
                  {data.topItems.length === 0 && (
                    <li className="px-5 py-8 text-center text-[13px] text-neutral-400">
                      No data yet
                    </li>
                  )}
                  {data.topItems.map((item, i) => (
                    <li
                      key={item._id}
                      className="flex items-center gap-4 px-5 py-3.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-neutral-100 font-display text-[12px] font-bold text-neutral-500">
                        {i + 1}
                      </span>
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.img && (
                          <img
                            src={item.img}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-bold text-neutral-950">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-neutral-500">
                          {item.orderCount} sold
                        </div>
                      </div>
                      <div className="shrink-0 font-display text-[13px] font-bold tabular-nums text-brand-600">
                        ₹{item.revenue.toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Quick links ───────────────────────── */}
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickLink
                href="/admin/menu/new"
                icon={UtensilsCrossed}
                title="Add menu item"
                desc="Create a new dish"
              />
              <QuickLink
                href="/admin/orders"
                icon={ShoppingBag}
                title="Manage orders"
                desc="Update statuses"
              />
              <QuickLink
                href="/admin/contacts"
                icon={MessageSquare}
                title="Customer messages"
                desc={`${data.contacts.new} new`}
              />
            </div>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

/* ── Small helpers ─────────────────────────────── */

function PipelineTile({ icon: Icon, label, value, color = "brand" }) {
  const colors = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-[#FDFCFB] p-3.5">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${colors[color]}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <div className="leading-tight">
        <div className="font-display text-[18px] font-extrabold tabular-nums text-neutral-950">
          {value}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </div>
      </div>
    </div>
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

function QuickLink({ href, icon: Icon, title, desc }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_20px_44px_-24px_rgba(249,115,22,0.3)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500">
        <Icon
          className="h-4.5 w-4.5 text-brand-600 transition-colors group-hover:text-white"
          strokeWidth={2.2}
        />
      </span>
      <div className="min-w-0">
        <div className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
          {title}
        </div>
        <div className="mt-0.5 text-[11.5px] text-neutral-500">{desc}</div>
      </div>
    </Link>
  );
}