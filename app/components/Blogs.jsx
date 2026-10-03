"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { api, resolveImageUrl } from "../lib/api";

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

export default function Blogs() {
  const [featured, setFeatured] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    api
      .getBlogs({ limit: 4 })
      .then((res) => {
        if (!live) return;
        const list = (res.data?.blogs || []).map(normalize);
        setFeatured(list[0] || null);
        setPosts(list.slice(1, 4));
      })
      .catch(() => {
        if (live) {
          setFeatured(null);
          setPosts([]);
        }
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  if (!loading && !featured) return null;

  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-8 sm:py-10">
      {/* Background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
        <div className="absolute -left-40 bottom-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.05)_0%,_transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ── Editorial header ───────────────────────── */}
        <div className="flex flex-col items-start justify-between gap-5 border-b border-neutral-200/70 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              The Journal · Vol. 01
            </div>

            <h2 className="mt-3 font-display text-[1.7rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
              Notes from{" "}
              <span className="font-serif italic font-normal text-brand-500">
                the kitchen.
              </span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[12.5px] font-semibold text-neutral-950"
          >
            <span className="border-b border-neutral-950 pb-0.5 transition-colors group-hover:border-brand-500 group-hover:text-brand-600">
              All stories
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        </div>

        {/* ── Body ───────────────────────────────────── */}
        {loading ? (
          <BlogsSkeleton />
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* ── Featured story ───────────────────── */}
            <article className="group lg:col-span-6">
              <Link href={`/blog/${featured.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                  <img
                    src={resolveImageUrl(featured.img)}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />
                </div>

                {/* Content */}
                <div className="mt-5">
                  <div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.16em]">
                    <span className="text-brand-600">{featured.category}</span>
                    <span className="h-3 w-px bg-neutral-300" />
                    <span className="text-neutral-400">{featured.date}</span>
                  </div>

                  <h3 className="mt-3 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.015em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600 sm:text-[21px]">
                    {featured.title}
                  </h3>

                  {featured.excerpt && (
                    <p className="mt-3 line-clamp-2 text-[13.5px] leading-[1.6] text-neutral-500">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200/70 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
                        {featured.author.initials}
                      </div>
                      <div className="leading-tight">
                        <div className="text-[12px] font-bold text-neutral-900">
                          {featured.author.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-neutral-950">
                      <span className="hidden border-b border-neutral-950 pb-0.5 transition-colors duration-300 group-hover:border-brand-500 group-hover:text-brand-600 sm:inline">
                        Read
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>

            {/* ── Post list ─────────────────────────── */}
            <div className="lg:col-span-6">
              <div className="flex items-center justify-between pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                <span>More Stories</span>
                <span>
                  {String(posts.length).padStart(2, "0")}{" "}
                  {posts.length === 1 ? "post" : "posts"}
                </span>
              </div>

              <ul className="divide-y divide-neutral-200/70 border-t border-neutral-200/70">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-center gap-4 py-4 sm:gap-5 sm:py-5"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/70 sm:h-20 sm:w-20">
                        <img
                          src={resolveImageUrl(post.img)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.16em]">
                          <span className="text-brand-600">
                            {post.category}
                          </span>
                          <span className="h-2.5 w-px bg-neutral-300" />
                          <span className="text-neutral-400">
                            {post.date}
                          </span>
                        </div>

                        <h3 className="mt-1.5 line-clamp-2 font-display text-[14px] font-bold leading-snug tracking-[-0.01em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600 sm:text-[15px]">
                          {post.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="grid h-4 w-4 place-items-center rounded-full bg-brand-100 text-[7px] font-bold text-brand-700">
                            {post.author.initials}
                          </div>
                          <span className="text-[10.5px] font-medium text-neutral-600">
                            {post.author.name}
                          </span>
                        </div>
                      </div>

                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand-500 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Loading skeleton ────────────────────────────── */
function BlogsSkeleton() {
  return (
    <div className="mt-10 grid animate-pulse gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        <div className="aspect-[16/10] rounded-2xl bg-neutral-200/70" />
        <div className="mt-5 space-y-3">
          <div className="h-3 w-24 rounded bg-neutral-200" />
          <div className="h-6 w-3/4 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-100" />
          <div className="h-4 w-5/6 rounded bg-neutral-100" />
        </div>
      </div>
      <div className="space-y-5 lg:col-span-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 rounded bg-neutral-200" />
              <div className="h-4 w-full rounded bg-neutral-100" />
              <div className="h-3 w-1/3 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}