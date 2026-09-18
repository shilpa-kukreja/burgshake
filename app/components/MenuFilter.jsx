"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Check,
  ArrowDownUp,
  Star,
  Leaf,
  Flame,
  WheatOff,
} from "lucide-react";

/* ─── Sort options ───────────────────────────────────── */
const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended", icon: Star },
  { id: "price-low",   label: "Price: Low to High", icon: ArrowDownUp },
  { id: "price-high",  label: "Price: High to Low", icon: ArrowDownUp },
  { id: "rating",      label: "Top Rated", icon: Star },
];

/* ─── Dietary filter options ─────────────────────────── */
const DIETARY_OPTIONS = [
  { id: "veg",         label: "Veg",   icon: Leaf },
  { id: "gluten-free", label: "GF",    icon: WheatOff },
  { id: "spicy",       label: "Spicy", icon: Flame },
];

/* ─── Component ──────────────────────────────────────── */
export default function MenuFilter({
  categories,
  active,
  onActiveChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  dietary,
  onDietaryToggle,
  onClearAll,
  resultCount,
  hasActiveFilters,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  /* Close sort dropdown on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentSort = SORT_OPTIONS.find((s) => s.id === sort) || SORT_OPTIONS[0];

  return (
    <div className="sticky top-16 z-30 border-y border-neutral-200/60 bg-[#FDFCFB]/90 backdrop-blur-xl sm:top-[72px]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* ═══ ROW 1: Categories + Search ═══════════════ */}
        <div className="flex flex-col items-stretch gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category pills */}
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onActiveChange(cat.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all duration-300 ${
                  active === cat.id
                    ? "border-neutral-950 bg-neutral-950 text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.4)]"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-200 hover:text-brand-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search dishes..."
              aria-label="Search dishes"
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-[13px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* ═══ ROW 2: Sort + Dietary + Clear ═══════════ */}
        <div className="flex flex-col items-stretch gap-3 border-t border-neutral-200/60 py-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Left: Sort + Dietary */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
                className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all duration-300 ${
                  sortOpen
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-brand-200 hover:text-brand-600"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{currentSort.label}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    sortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {sortOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_20px_50px_-15px_rgba(23,23,23,0.25)] backdrop-blur-xl"
                >
                  <div className="p-1.5">
                    {SORT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isActive = sort === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            onSortChange(opt.id);
                            setSortOpen(false);
                          }}
                          role="option"
                          aria-selected={isActive}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-[12.5px] font-medium transition-colors duration-200 ${
                            isActive
                              ? "bg-brand-50 text-brand-700"
                              : "text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                isActive ? "text-brand-600" : "text-neutral-400"
                              }`}
                            />
                            {opt.label}
                          </span>
                          {isActive && (
                            <Check
                              className="h-3.5 w-3.5 text-brand-600"
                              strokeWidth={2.8}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Divider (desktop) */}
            <span className="hidden h-5 w-px bg-neutral-200 sm:block" />

            {/* Dietary pills */}
            <div className="flex flex-wrap items-center gap-2">
              {DIETARY_OPTIONS.map((d) => {
                const Icon = d.icon;
                const isActive = dietary.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => onDietaryToggle(d.id)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all duration-300 ${
                      isActive
                        ? "border-brand-500 bg-brand-500 text-white shadow-[0_6px_18px_-8px_rgba(249,115,22,0.6)]"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-200 hover:text-brand-600"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Result count + Clear all */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {resultCount} {resultCount === 1 ? "item" : "items"}
            </span>

            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-600 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3 w-3 transition-transform duration-300 group-hover:rotate-90" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}