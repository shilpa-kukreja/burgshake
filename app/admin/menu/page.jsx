"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  Eye,
  EyeOff,
  Flame,
  Star,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "burgers", label: "Burgers" },
  { id: "shakes", label: "Shakes" },
  { id: "sides", label: "Sides" },
  { id: "beverages", label: "Beverages" },
];

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListMenu({ limit: 200 });
      setItems(res.data.items);
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
    let list = items;
    if (tab !== "all") list = list.filter((i) => i.category === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, tab, search]);

const handleToggle = async (fn, slug, key) => {
  setBusyId(slug);
  try {
    const res = await fn(slug);
    const newVal = res.data[key === "isAvailable" ? "isAvailable" : key];
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, [key]: newVal } : i))
    );
  } catch (err) {
    alert(err.message);
  } finally {
    setBusyId(null);
  }
};

const handleDelete = async (item) => {
  if (!confirm(`Delete "${item.name}"?`)) return;
  setBusyId(item.slug);
  try {
    await api.adminDeleteMenu(item.slug);
    setItems((prev) => prev.filter((i) => i.slug !== item.slug));
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
        title="Menu"
        subtitle={`${items.length} total items`}
        onMenuClick={handleMenuClick}
        actions={
          <Link
            href="/admin/menu/new"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_10px_26px_-10px_rgba(249,115,22,0.6)]"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add item
          </Link>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_TABS.map((c) => (
              <button
                key={c.id}
                onClick={() => setTab(c.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
                  tab === c.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ID…"
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
              No items found
            </p>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">
              {search || tab !== "all"
                ? "Try clearing filters."
                : "Add your first item to get started."}
            </p>
            {!search && tab === "all" && (
              <Link
                href="/admin/menu/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-[12.5px] font-bold text-white hover:bg-brand-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Add first item
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white">
            {/* Table header (desktop) */}
            <div className="hidden grid-cols-12 gap-3 border-b border-neutral-200/70 bg-neutral-50/60 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 lg:grid">
              <div className="col-span-5">Item</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Rating</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            <ul className="divide-y divide-neutral-200/70">
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30 lg:grid-cols-12 lg:items-center"
                >
                  {/* Item */}
                  <div className="flex items-center gap-3 lg:col-span-5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-display text-[14px] font-bold text-neutral-950">
                          {item.name}
                        </span>
                        {!item.isAvailable && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase text-red-600 ring-1 ring-red-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                          {item.slug}
                        </code>
                        {item.isBestseller && (
                          <span className="flex items-center gap-0.5 text-brand-600">
                            <Star className="h-2.5 w-2.5 fill-brand-500" />
                            Bestseller
                          </span>
                        )}
                        {item.isFeatured && (
                          <span className="flex items-center gap-0.5 text-brand-600">
                            <Flame className="h-2.5 w-2.5" />
                            Chef&apos;s pick
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="lg:col-span-2">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-neutral-600">
                      {item.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="lg:col-span-1">
                    <div className="font-display text-[14px] font-bold tabular-nums text-neutral-950">
                      ₹{item.price}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-1 text-[12.5px] font-bold text-neutral-900">
                      <Star className="h-3 w-3 fill-brand-500 text-brand-500" />
                      {item.rating}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 lg:col-span-3 lg:justify-end">
                    <ActionBtn
                      title={item.isAvailable ? "Hide" : "Show"}
                      onClick={() =>
                        handleToggle(
                          api.adminToggleAvailability,
                          item.id,
                          "isAvailable"
                        )
                      }
                      busy={busyId === item.id}
                      variant={item.isAvailable ? "neutral" : "emerald"}
                    >
                      {item.isAvailable ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </ActionBtn>

                    <ActionBtn
                      title="Toggle bestseller"
                      onClick={() =>
                        handleToggle(
                          api.adminToggleBestseller,
                          item.id,
                          "isBestseller"
                        )
                      }
                      busy={busyId === item.id}
                      variant={item.isBestseller ? "brand" : "neutral"}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          item.isBestseller ? "fill-current" : ""
                        }`}
                      />
                    </ActionBtn>

                    <ActionBtn
                      title="Toggle chef's pick"
                      onClick={() =>
                        handleToggle(
                          api.adminToggleFeatured,
                          item.id,
                          "isFeatured"
                        )
                      }
                      busy={busyId === item.id}
                      variant={item.isFeatured ? "brand" : "neutral"}
                    >
                      <Flame className="h-3.5 w-3.5" />
                    </ActionBtn>

                    <Link
                      href={`/admin/menu/${item.slug}/edit`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDelete(item)}
                      disabled={busyId === item.id}
                      title="Delete"
                      className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

function ActionBtn({ children, onClick, title, busy, variant = "neutral" }) {
  const variants = {
    neutral: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700",
    brand: "bg-brand-50 text-brand-600 hover:bg-brand-100",
    emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-lg transition-all disabled:opacity-40 ${variants[variant]}`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}