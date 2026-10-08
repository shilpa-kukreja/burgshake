"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import MenuFilter from "./MenuFilter";
import MenuCard from "./MenuCard";
import { api } from "../lib/api";

/* "recommended" isn't a backend sort key — map it to the default */
const SORT_MAP = {
  recommended: "featured",
  "price-low": "price-low",
  "price-high": "price-high",
  rating: "rating",
  name: "name",
};

function normalize(item) {
  return { ...item, id: item.slug };
}

function MenuGridContent() {
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const router = useRouter();
  const pathname = usePathname();

  /* Initial state comes from the URL so footer links work on first load */
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [active, setActive] = useState(
    searchParams.get("category") || "all"
  );
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "recommended");
  const [dietary, setDietary] = useState([]);

  /* Track what we last wrote to the URL so we can distinguish
     "URL changed because we wrote it" from "URL changed externally
     (e.g. user clicked a footer link)". */
  const lastWrittenRef = useRef("");

  /* ── READ: URL → state ─────────────────────────
     Runs whenever the URL query changes. If the change didn't come
     from our own write, it means something outside updated it (a
     footer link, back button, pasted URL) — so we adopt its values. */
  useEffect(() => {
    /* Our own write — ignore, state already matches */
    if (searchParamsString === lastWrittenRef.current) return;

    const urlCategory = searchParams.get("category") || "all";
    const urlSearch = searchParams.get("search") || "";
    const urlSort = searchParams.get("sort") || "recommended";

    lastWrittenRef.current = searchParamsString;

    if (urlCategory !== active) setActive(urlCategory);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlSort !== sort) setSort(urlSort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  /* ── WRITE: state → URL ────────────────────────
     Runs when a filter changes. Uses `replace` so filter clicks don't
     pollute browser history, and `scroll: false` so the page doesn't
     jump to the top. */
  useEffect(() => {
    const params = new URLSearchParams();
    if (active !== "all") params.set("category", active);
    if (search.trim()) params.set("search", search.trim());
    if (sort !== "recommended") params.set("sort", sort);
    const qs = params.toString();

    /* Record what we're about to write so the READ effect can skip it */
    lastWrittenRef.current = qs;

    const newUrl = `${pathname}${qs ? `?${qs}` : ""}`;
    const currentUrl = `${pathname}${window.location.search}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [active, search, sort, pathname, router]);

  /* ── Fetch categories once ─────────────────────── */
  useEffect(() => {
    let mounted = true;
    api
      .getCategories()
      .then((res) => {
        if (!mounted) return;
        const raw = res.data?.categories || res.data || [];
        const list = raw
          .filter((c) => c.isActive !== false)
          .filter((c) => {
            const slug = (c.slug || "").toLowerCase();
            const name = (c.name || "").toLowerCase().trim();
            return slug !== "all" && name !== "all";
          })
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((c) => ({ id: c.slug, label: c.name, icon: c.icon || null }));
        setCategories([{ id: "all", label: "All" }, ...list]);
      })
      .catch(() => {
        if (mounted) setCategories([{ id: "all", label: "All" }]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  /* ── Guard against a category that doesn't exist ──
     e.g. someone shares /menu?category=deleted-thing. After categories
     load, if `active` isn't a real one, fall back to "all". */
  useEffect(() => {
    if (categories.length === 0) return;
    if (active === "all") return;
    if (!categories.some((c) => c.id === active)) {
      setActive("all");
    }
  }, [categories, active]);

  /* ── Fetch items on filter change (debounced) ──── */
  useEffect(() => {
    let live = true;

    const params = {};
    if (active !== "all") params.category = active;
    if (search.trim()) params.search = search.trim();
    if (dietary.length > 0) params.dietary = dietary.join(",");
    if (sort && sort !== "recommended") params.sort = SORT_MAP[sort];

    const delay = search ? 300 : 0;

    const t = setTimeout(() => {
      setLoading(true);
      api
        .getMenu(params)
        .then((res) => {
          if (!live) return;
          const raw = res.data?.items || [];
          setItems(raw.map(normalize));
          setError("");
        })
        .catch((err) => {
          if (!live) return;
          setError(err.message || "Couldn't load the menu.");
          setItems([]);
        })
        .finally(() => {
          if (live) setLoading(false);
        });
    }, delay);

    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [active, search, sort, dietary]);

  /* ── Handlers ─────────────────────────────────── */
  const handleDietaryToggle = (id) => {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setActive("all");
    setSearch("");
    setSort("recommended");
    setDietary([]);
  };

  const hasActiveFilters =
    active !== "all" ||
    search.trim() !== "" ||
    sort !== "recommended" ||
    dietary.length > 0;

  const displayItems = useMemo(() => items, [items]);

  return (
    <>
      <MenuFilter
        categories={categories}
        active={active}
        onActiveChange={setActive}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        dietary={dietary}
        onDietaryToggle={handleDietaryToggle}
        onClearAll={handleClearAll}
        resultCount={displayItems.length}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="relative bg-[#FDFCFB] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <div className="grid place-items-center rounded-3xl border border-red-200 bg-red-50/50 py-16 text-center">
              <p className="font-display text-[15px] font-bold text-red-800">
                Couldn&apos;t load the menu
              </p>
              <p className="mt-1.5 text-[12.5px] text-red-600">{error}</p>
              <button
                onClick={() => setActive(active)}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-[12px] font-bold text-red-700 transition-all hover:border-red-400"
              >
                Try again
              </button>
            </div>
          ) : displayItems.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayItems.map((item) => (
                <MenuCard key={item.slug} item={item} />
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

export default function MenuGrid() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <MenuGridContent />
    </Suspense>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200/70 bg-white"
        >
          <div className="aspect-[4/3] bg-neutral-200/70" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-full rounded bg-neutral-100" />
            <div className="mt-2 flex items-center justify-between">
              <div className="h-4 w-16 rounded bg-neutral-200" />
              <div className="h-8 w-8 rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}