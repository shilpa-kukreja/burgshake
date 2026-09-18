"use client";

import Link from "next/link";
import {
  ChefHat,
  SlidersHorizontal,
  Wheat,
  Flame,
  ArrowUpRight,
  Sparkles,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    no: "01",
    icon: ChefHat,
    title: "Smashed to Order",
    desc: "Every patty hits the griddle only after you order — never pre-cooked.",
  },
  {
    no: "02",
    icon: SlidersHorizontal,
    title: "Build It Your Way",
    desc: "Choose bun, patty, cheese, sauces, and heat. Your burger, your rules.",
  },
  {
    no: "03",
    icon: Wheat,
    title: "Buns Baked Daily",
    desc: "Brioche baked fresh every morning. Real cheese that melts just right.",
  },
  {
    no: "04",
    icon: Flame,
    title: "Flame-Kissed Flavor",
    desc: "A signature char from our open flame — the difference you can taste.",
  },
];

const STATS = [
  { value: "50+", label: "Menu Items" },
  { value: "15m", label: "Avg Pickup" },
  { value: "4.9", label: "Rating" },
  { value: "500+", label: "Happy Regulars" },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-8 sm:py-12">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/3 h-[460px] w-[460px] -translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        <div className="absolute -right-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.06)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ═══ Header ═══════════════════════════════════ */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-200/70 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Why Burgshake
            </div>

            <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem] lg:text-[2.4rem]">
              More than a burger —{" "}
              <span className="font-serif italic font-normal text-brand-500">
                it&apos;s a ritual.
              </span>
            </h2>

            {/* <p className="mt-4 max-w-md text-[14.5px] leading-[1.7] text-neutral-500">
              Four things we refuse to compromise on. No shortcuts, no
              gimmicks — just the small details that make every bite worth it.
            </p> */}
          </div>

          <Link
            href="/menu"
            className="group inline-flex shrink-0 items-center gap-2 text-[12.5px] font-semibold text-neutral-950"
          >
            <span className="border-b border-neutral-950 pb-0.5 transition-colors group-hover:border-brand-500 group-hover:text-brand-600">
              Explore the menu
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        </div>

        {/* ═══ Bento grid ═══════════════════════════════ */}
        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-6">

          {/* ── LEFT: Visual anchor ───────────────────── */}
          <div className="lg:col-span-5">
            <div className="group relative h-full min-h-[420px] overflow-hidden rounded-3xl bg-neutral-900 ">
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=85"
                alt="Handcrafted burger"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                loading="lazy"
              />

              {/* Warm dark gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent" />
              <div className="absolute inset-0 bg-brand-600/15 mix-blend-overlay" />

              {/* Dot texture */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                  backgroundSize: "26px 26px",
                }}
              />

              {/* Top badge */}
              {/* <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-brand-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  Handcrafted
                </span>
              </div> */}

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-300">
                  Since 2022
                </div>
                <h3 className="mt-2 font-display text-[22px] font-bold leading-[1.15] tracking-[-0.015em] text-white sm:text-[24px]">
                  Built fresh,
                  <br />
                  <span className="font-serif italic font-normal text-brand-200">
                    every single time.
                  </span>
                </h3>

                {/* Mini inline trust */}
                <div className="mt-5 flex items-center gap-4 border-t border-white/15 pt-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-brand-300 text-brand-300"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-white/70">
                    Rated 4.9 by 500+ regulars
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: 2×2 feature grid ───────────────── */}
          <div className="grid gap-px overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-200/70 sm:grid-cols-2 lg:col-span-7">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.no}
                  className="group relative flex flex-col bg-[#FDFCFB] p-6 transition-colors duration-500 hover:bg-white sm:p-7"
                >
                  {/* Icon chip + number */}
                  <div className="flex items-start justify-between">
                    <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(249,115,22,0.06)] ring-1 ring-brand-100 transition-all duration-500 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:ring-brand-500/40">
                      <Icon
                        className="h-4.5 w-4.5 text-brand-600 transition-colors duration-500 group-hover:text-white"
                        strokeWidth={2.2}
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-2xl bg-brand-400/0 blur-md transition-colors duration-500 group-hover:bg-brand-400/40"
                      />
                    </div>

                    {/* <span className="font-display text-[10.5px] font-bold tracking-[0.18em] text-neutral-300 transition-colors duration-500 group-hover:text-brand-500">
                      / {f.no}
                    </span> */}
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-display text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-neutral-950 transition-colors duration-500 group-hover:text-brand-600">
                    {f.title}
                  </h3>

                  {/* Desc */}
                  <p className="mt-2 text-[13px] leading-[1.65] text-neutral-500">
                    {f.desc}
                  </p>

                  {/* Bottom accent */}
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out group-hover:w-full" />
                </article>
              );
            })}
          </div>
        </div>

        {/* ═══ Stats strip ══════════════════════════════ */}
        {/* <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-200/70 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group relative flex flex-col items-center justify-center bg-[#FDFCFB] px-4 py-5 text-center transition-colors duration-500 hover:bg-white"
            >
              <div className="font-display text-[20px] font-extrabold tabular-nums tracking-[-0.01em] text-neutral-950 sm:text-[22px]">
                {s.value}
                {s.label === "Rating" && (
                  <Star className="ml-1 inline h-3.5 w-3.5 -translate-y-0.5 fill-brand-500 text-brand-500" />
                )}
              </div>
              <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400 transition-colors duration-500 group-hover:text-brand-600">
                {s.label}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}