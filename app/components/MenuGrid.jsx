"use client";

import { useMemo, useState } from "react";
import MenuFilter from "./MenuFilter";
import MenuCard from "./MenuCard";
import { CATEGORIES, MENU_ITEMS } from "../data/menuItems";

export default function MenuGrid() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recommended");
  const [dietary, setDietary] = useState([]); // array of ids: ["veg", "spicy"]

  /* Toggle a dietary filter */
  const handleDietaryToggle = (id) => {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  /* Clear all filters */
  const handleClearAll = () => {
    setActive("all");
    setSearch("");
    setSort("recommended");
    setDietary([]);
  };

  /* Any filter active? */
  const hasActiveFilters =
    active !== "all" ||
    search.trim() !== "" ||
    sort !== "recommended" ||
    dietary.length > 0;

  /* Compute filtered + sorted list */
  const filtered = useMemo(() => {
    let list = [...MENU_ITEMS];

    /* Category */
    if (active !== "all") {
      list = list.filter((i) => i.category === active);
    }

    /* Search */
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.desc.toLowerCase().includes(q)
      );
    }

    /* Dietary (item must have ALL selected tags) */
    if (dietary.length > 0) {
      list = list.filter((i) =>
        dietary.every((d) => i.dietary.includes(d))
      );
    }

    /* Sort */
    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        /* Keep original order (or sort by "tag" priority if needed) */
        break;
    }

    return list;
  }, [active, search, sort, dietary]);

  return (
    <>
      <MenuFilter
        categories={CATEGORIES}
        active={active}
        onActiveChange={setActive}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        dietary={dietary}
        onDietaryToggle={handleDietaryToggle}
        onClearAll={handleClearAll}
        resultCount={filtered.length}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="relative bg-[#FDFCFB] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-3xl border border-dashed border-neutral-300 bg-white/60 py-20 text-center">
              <p className="font-display text-[16px] font-bold text-neutral-800">
                No items found
              </p>
              <p className="mt-1.5 text-[13px] text-neutral-500">
                Try a different category or clear your filters.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-700 transition-all hover:border-brand-300 hover:text-brand-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}