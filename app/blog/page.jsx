"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Search,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api, resolveImageUrl } from "../lib/api";

const PER_PAGE = 9;

/* ── Helpers ─────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function initials(name) {
  if (!name) return "B";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

function normalize(blog) {
  return {
    slug: blog.blogSlug,
    category: blog.tags?.[0] || "Journal",
    tags: blog.tags || [],
    title: blog.blogName,
    excerpt: blog.excerpt || "",
    date: formatDate(blog.blogDate || blog.createdAt),
    author: {
      name: blog.author || "Burgshake Team",
      initials: initials(blog.author || "Burgshake Team"),
    },
    img: blog.blogImg,
  };
}

/* ── Page ────────────────────────────────────────── */
function BlogPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTag = searchParams.get("tag") || "";
  const initialSearch = searchParams.get("q") || "";
  const initialPage = Math.max(1, parseInt(searchParams.get("page")) || 1);

  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);
  const [page, setPage] = useState(initialPage);
  const [allTags, setAllTags] = useState([]);

  /* Sync filters → URL */
  useEffect(() => {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    if (search) params.set("q", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(`/blog${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [tag, search, page, router]);

  /* Debounce search input */
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* Fetch */
  useEffect(() => {
    let live = true;
    setLoading(true);

    const params = { page, limit: PER_PAGE };
    if (tag) params.tag = tag;
    if (search) params.search = search;

    api
      .getBlogs(params)
      .then((res) => {
        if (!live) return;
        const list = (res.data?.blogs || []).map(normalize);
        setBlogs(list);
        setPagination(res.data?.pagination || null);
        setAllTags((prev) => {
          const set = new Set(prev);
          list.forEach((b) => b.tags.forEach((t) => set.add(t)));
          return [...set].sort();
        });
        setError("");
      })
      .catch((err) => {
        if (!live) return;
        setError(err.message || "Couldn't load posts.");
        setBlogs([]);
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [page, tag, search]);

  const handleClearAll = () => {
    setSearchInput("");
    setSearch("");
    setTag("");
    setPage(1);
  };

  const hasFilters = !!search || !!tag;
  const totalPages = pagination?.pages || 1;

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-18 sm:pt-24 lg:pt-28">
      {/* Hero header */}
      <section className="relative overflow-hidden border-b border-neutral-200/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-40 -top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        </div>

        <div className="mx-auto max-w-[1400px] px-6 pb-10 pt-4 lg:px-10 lg:pb-12 lg:pt-6">
          {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-8 bg-brand-500" />
            The Journal
          </div> */}

          <h1 className="mt-3 max-w-2xl font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.4rem] lg:text-[2.7rem]">
            Notes, recipes &{" "}
            <span className="font-serif italic font-normal text-brand-500">
              kitchen stories.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-[14.5px] leading-[1.7] text-neutral-600">
            Behind-the-scenes looks at how we make every patty, shake, and
            sauce — plus the people and farms behind them.
          </p>
        </div>
      </section>

      {/* Filters */}
      {/* <section className="border-b border-neutral-200/70 bg-white/50">
        <div className="mx-auto max-w-[1400px] px-6 py-4 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="-mx-6 flex gap-1.5 overflow-x-auto px-6 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => {
                  setTag("");
                  setPage(1);
                }}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.12em] transition-all ${
                  tag === ""
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                All
              </button>
             
            </div>

            
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search posts…"
                className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-[12.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section> */}

      {/* Posts */}
      <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
        {error && (
          <div className="mb-8 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <BlogGridSkeleton />
        ) : blogs.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-neutral-300 bg-white/60 py-20 text-center">
            <BookOpen className="h-9 w-9 text-neutral-300" />
            <p className="mt-4 font-display text-[16px] font-bold text-neutral-800">
              {hasFilters ? "No posts match your filters" : "No posts yet"}
            </p>
            <p className="mt-1.5 max-w-sm text-[13px] text-neutral-500">
              {hasFilters
                ? "Try a different tag or clear your search."
                : "Check back soon — the kitchen is cooking up stories."}
            </p>
            {hasFilters && (
              <button
                onClick={handleClearAll}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-700 transition-all hover:border-brand-300 hover:text-brand-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                {pagination?.total ?? blogs.length}{" "}
                {(pagination?.total ?? blogs.length) === 1
                  ? "story"
                  : "stories"}
              </p>
              {hasFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-[11.5px] font-semibold text-neutral-500 transition-colors hover:text-brand-600"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {blogs.map((blog) => (
                <article key={blog.slug} className="group">
                  <Link href={`/blog/${blog.slug}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                      <img
                        src={resolveImageUrl(blog.img)}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />
                    </div>

                    {/* Content */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.16em]">
                        <span className="text-brand-600">
                          {blog.category}
                        </span>
                        <span className="h-2.5 w-px bg-neutral-300" />
                        <span className="text-neutral-400">{blog.date}</span>
                      </div>

                      <h2 className="mt-2.5 line-clamp-2 font-display text-[17px] font-bold leading-[1.28] tracking-[-0.015em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600">
                        {blog.title}
                      </h2>

                      {blog.excerpt && (
                        <p className="mt-2.5 line-clamp-2 text-[13px] leading-[1.6] text-neutral-500">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2.5 border-t border-neutral-200/70 pt-3.5">
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                          {blog.author.initials}
                        </div>
                        <span className="text-[11.5px] font-semibold text-neutral-700">
                          {blog.author.name}
                        </span>
                        <ArrowUpRight className="ml-auto h-3.5 w-3.5 -translate-x-1 text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand-500 group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/70 pt-6">
                <span className="text-[11.5px] font-medium text-neutral-500">
                  Page <strong className="text-neutral-800">{page}</strong> of{" "}
                  <strong className="text-neutral-800">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider text-neutral-600 transition-all hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider text-neutral-600 transition-all hover:border-brand-300 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

/* ── Skeleton ────────────────────────────────────── */
function BlogGridSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[16/11] rounded-2xl bg-neutral-200/70" />
          <div className="mt-4 space-y-3">
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className="h-5 w-full rounded bg-neutral-200" />
            <div className="h-5 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-2/3 rounded bg-neutral-100" />
            <div className="h-3 w-1/3 rounded bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] pt-24">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      }
    >
      <BlogPageContent />
    </Suspense>
  );
}