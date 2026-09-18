"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/* ─── Featured story data ────────────────────────────── */
const FEATURED = {
  category: "Behind the Grill",
  title: "How we smash the perfect patty, every single time.",
  excerpt:
    "From the cut of beef to the temperature of the griddle — a look inside the small rituals that make every Burgshake burger taste exactly the same.",
  date: "12 Mar 2026",
  readTime: "6 min read",
  author: {
    name: "Karan Bhatia",
    role: "Head Chef",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80",
};

/* ─── Post list data ─────────────────────────────────── */
const POSTS = [
  {
    no: "01",
    category: "Shakes",
    title: "Why Belgian chocolate makes a better shake.",
    date: "08 Mar 2026",
    readTime: "4 min",
    author: {
      name: "Nisha Rao",
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
  },
  {
    no: "02",
    category: "Ingredients",
    title: "The five local farms behind our daily produce.",
    date: "02 Mar 2026",
    readTime: "5 min",
    author: {
      name: "Dev Malhotra",
      avatar: "https://i.pravatar.cc/80?img=59",
    },
    img: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80",
  },
  {
    no: "03",
    category: "Café Life",
    title: "Designing a takeaway café that still feels warm.",
    date: "24 Feb 2026",
    readTime: "3 min",
    author: {
      name: "Sara Khan",
      avatar: "https://i.pravatar.cc/80?img=25",
    },
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
  },
];

/* ─── Component ──────────────────────────────────────── */
export default function Blogs() {
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
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Featured story ────────────────────────── */}
          <article className="group lg:col-span-6">
            <Link href="/blog" className="block">
              {/* Image — compact 16:10 */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                <img
                  src={FEATURED.img}
                  alt={FEATURED.title}
                  className="h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />

                {/* Featured chip */}
                {/* <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-neutral-900 shadow-sm backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  Featured
                </span> */}

                {/* Read time chip */}
                <span className="absolute right-4 top-4 rounded-full bg-neutral-950/70 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  {FEATURED.readTime}
                </span>

                {/* Warm tint on hover */}
                <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />
              </div>

              {/* Content */}
              <div className="mt-5">
                {/* Meta */}
                <div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.16em]">
                  <span className="text-brand-600">{FEATURED.category}</span>
                  <span className="h-3 w-px bg-neutral-300" />
                  <span className="text-neutral-400">{FEATURED.date}</span>
                </div>

                {/* Title */}
                <h3 className="mt-3 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.015em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600 sm:text-[21px]">
                  {FEATURED.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-3 line-clamp-2 text-[13.5px] leading-[1.6] text-neutral-500">
                  {FEATURED.excerpt}
                </p>

                {/* Author + Read link */}
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-200/70 pt-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={FEATURED.author.avatar}
                      alt={FEATURED.author.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-neutral-200"
                      loading="lazy"
                    />
                    <div className="leading-tight">
                      <div className="text-[12px] font-bold text-neutral-900">
                        {FEATURED.author.name}
                      </div>
                      <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                        {FEATURED.author.role}
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

          {/* ── Post list ─────────────────────────────── */}
          <div className="lg:col-span-6">
            {/* List header */}
            <div className="flex items-center justify-between pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              <span>More Stories</span>
              <span>03 posts</span>
            </div>

            <ul className="divide-y divide-neutral-200/70 border-t border-neutral-200/70">
              {POSTS.map((post) => (
                <li key={post.title}>
                  <Link
                    href="/blog"
                    className="group flex items-center gap-4 py-4 sm:gap-5 sm:py-5"
                  >
                    {/* Editorial number */}
                    {/* <span className="hidden font-display text-[10.5px] font-bold tracking-[0.18em] text-neutral-300 transition-colors duration-300 group-hover:text-brand-500 sm:block">
                      / {post.no}
                    </span> */}

                    {/* Thumbnail — smaller square */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/70 sm:h-20 sm:w-20">
                      <img
                        src={post.img}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {/* Meta */}
                      <div className="flex items-center gap-2 text-[9.5px] font-bold uppercase tracking-[0.16em]">
                        <span className="text-brand-600">{post.category}</span>
                        <span className="h-2.5 w-px bg-neutral-300" />
                        <span className="text-neutral-400">
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-1.5 line-clamp-2 font-display text-[14px] font-bold leading-snug tracking-[-0.01em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600 sm:text-[15px]">
                        {post.title}
                      </h3>

                      {/* Author byline */}
                      <div className="mt-2 flex items-center gap-1.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-4 w-4 rounded-full object-cover ring-1 ring-neutral-200"
                          loading="lazy"
                        />
                        <span className="text-[10.5px] font-medium text-neutral-600">
                          {post.author.name}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-[10.5px] font-medium text-neutral-400">
                          {post.date}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 text-neutral-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-brand-500 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}