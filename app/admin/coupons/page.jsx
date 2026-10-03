"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  Tag,
  Percent,
  IndianRupee,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  AlertCircle,
  Loader2,
  Calendar,
  Check,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expired", label: "Expired" },
  { id: "inactive", label: "Inactive" },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.adminListCoupons(params);
      setCoupons(res.data.coupons || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Refetch on status change */
  useEffect(() => {
    load({
      status: status === "all" ? undefined : status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /* Client-side search — coupon lists are small */
  const filtered = useMemo(() => {
    if (!search.trim()) return coupons;
    const q = search.toLowerCase();
    return coupons.filter((c) => c.couponCode.toLowerCase().includes(q));
  }, [coupons, search]);

  const handleToggle = async (coupon) => {
    setBusyId(coupon._id);
    try {
      const res = await api.adminToggleCoupon(coupon._id);
      setCoupons((prev) =>
        prev.map((c) =>
          c._id === coupon._id
            ? { ...c, isActive: res.data.isActive }
            : c
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (coupon) => {
    if (!confirm(`Delete coupon "${coupon.couponCode}"?`)) return;
    setBusyId(coupon._id);
    try {
      await api.adminDeleteCoupon(coupon._id);
      setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
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
        title="Coupons"
        subtitle={`${coupons.length} total`}
        onMenuClick={handleMenuClick}
        actions={
          <Link
            href="/admin/coupons/new"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_10px_26px_-10px_rgba(249,115,22,0.6)]"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add coupon
          </Link>
        }
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
              placeholder="Search code…"
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
            <Tag className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 font-display text-[15px] font-bold text-neutral-800">
              No coupons found
            </p>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">
              {search || status !== "all"
                ? "Try clearing filters."
                : "Create your first coupon to get started."}
            </p>
            {!search && status === "all" && (
              <Link
                href="/admin/coupons/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-[12.5px] font-bold text-white hover:bg-brand-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add first coupon
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white">
            {/* Header (desktop) */}
            <div className="hidden grid-cols-12 gap-3 border-b border-neutral-200/70 bg-neutral-50/60 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 lg:grid">
              <div className="col-span-3">Code</div>
              <div className="col-span-2">Discount</div>
              <div className="col-span-2">Min order</div>
              <div className="col-span-2">Expires</div>
              <div className="col-span-1">Used</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <ul className="divide-y divide-neutral-200/70">
              {filtered.map((coupon) => {
                const expired = new Date(coupon.expiryDate) < new Date();
                const isPercent = coupon.discounttype === "percent";
                return (
                  <li
                    key={coupon._id}
                    className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30 lg:grid-cols-12 lg:items-center"
                  >
                    {/* Code + status */}
                    <div className="flex items-center gap-3 lg:col-span-3">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          !coupon.isActive || expired
                            ? "bg-neutral-100 text-neutral-400"
                            : "bg-brand-50 text-brand-600"
                        }`}
                      >
                        <Tag className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
                            {coupon.couponCode}
                          </span>
                          <StatusChip
                            isActive={coupon.isActive}
                            expired={expired}
                          />
                        </div>
                        {/* Mobile-only meta */}
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-neutral-500 lg:hidden">
                          <span>
                            {isPercent
                              ? `${coupon.discount}% off`
                              : `₹${coupon.discount} off`}
                          </span>
                          <span>· Min ₹{coupon.minPurchaseAmount}</span>
                          <span>
                            · Expires{" "}
                            {new Date(coupon.expiryDate).toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "short" }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Discount (desktop) */}
                    <div className="hidden lg:col-span-2 lg:block">
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-neutral-900">
                        {isPercent ? (
                          <Percent className="h-3.5 w-3.5 text-brand-500" />
                        ) : (
                          <IndianRupee className="h-3.5 w-3.5 text-white" />
                        )}
                        {isPercent
                          ? `${coupon.discount}%`
                          : `₹${coupon.discount}`}
                      </div>
                      {isPercent && coupon.maxDiscountAmount && (
                        <div className="mt-0.5 text-[10.5px] font-medium text-neutral-400">
                          Cap ₹{coupon.maxDiscountAmount}
                        </div>
                      )}
                    </div>

                    {/* Min order (desktop) */}
                    <div className="hidden text-[12.5px] font-medium tabular-nums text-neutral-600 lg:col-span-2 lg:block">
                      {coupon.minPurchaseAmount > 0
                        ? `₹${coupon.minPurchaseAmount}`
                        : "—"}
                    </div>

                    {/* Expiry (desktop) */}
                    <div className="hidden lg:col-span-2 lg:block">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600">
                        <Calendar className="h-3 w-3 text-neutral-400" />
                        {new Date(coupon.expiryDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </div>
                      {expired && (
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                          Expired
                        </div>
                      )}
                    </div>

                    {/* Usage (desktop) */}
                    <div className="hidden text-[12px] font-medium tabular-nums text-neutral-500 lg:col-span-1 lg:block">
                      {coupon.usedCount || 0}
                      {coupon.maxUses ? `/${coupon.maxUses}` : ""}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 lg:col-span-2 lg:justify-end">
                      <button
                        onClick={() => handleToggle(coupon)}
                        disabled={busyId === coupon._id}
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors disabled:opacity-40 ${
                          coupon.isActive
                            ? "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {busyId === coupon._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : coupon.isActive ? (
                          <PowerOff className="h-3.5 w-3.5" />
                        ) : (
                          <Power className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/admin/coupons/${coupon._id}/edit`}
                        title="Edit"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(coupon)}
                        disabled={busyId === coupon._id}
                        title="Delete"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

function StatusChip({ isActive, expired }) {
  if (!isActive) {
    return (
      <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-neutral-600 ring-1 ring-neutral-200">
        Inactive
      </span>
    );
  }
  if (expired) {
    return (
      <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-red-600 ring-1 ring-red-200">
        Expired
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-emerald-700 ring-1 ring-emerald-200">
      Active
    </span>
  );
}