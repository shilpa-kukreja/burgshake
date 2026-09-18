"use client";

import Link from "next/link";
import {
  ArrowRight,
  Star,
  Clock,
  Leaf,
  UtensilsCrossed,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const STATS = [
  { value: "50+", label: "Menu Items" },
  { value: "15m", label: "Avg Pickup" },
  { value: "4.9", label: "Rating" },
];

const AVATARS = [
  "https://i.pravatar.cc/80?img=12",
  "https://i.pravatar.cc/80?img=32",
  "https://i.pravatar.cc/80?img=45",
  "https://i.pravatar.cc/80?img=68",
];

const MARQUEE = [
  "Freshly Grilled Daily",
  "Premium Ingredients",
  "Ready in 15 Minutes",
  "Build Your Own",
  "Takeaway Only",
  "500+ Happy Customers",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] pt-24 sm:pt-24 lg:pt-28">
      {/* ── Background (soft, one strong glow) ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-48 -top-48 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.14)_0%,_rgba(249,115,22,0.04)_40%,_transparent_70%)]" />
        <div className="absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.07)_0%,_transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid items-center gap-20 lg:grid-cols-12 lg:gap-16">

          {/* ── LEFT ─────────────────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-neutral-200/80 bg-white/80 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
              </span>
              <span>Now Open</span>
              <span className="h-3 w-px bg-neutral-200" />
              <span className="text-neutral-500">Takeaway Only</span>
            </div>

            {/* Headline */}
            <h1 className="mt-7 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-neutral-950 sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.4rem]">
              Handcrafted burgers,
              <br />
              <span className="text-brand-500">shakes</span>{" "}
              <span className="font-serif italic font-normal text-neutral-700">
                &amp; good vibes.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-[26rem] text-[15px] leading-[1.65] text-neutral-500">
              Bold, juicy burgers and velvety thick shakes — crafted with
              premium ingredients and ready for pickup in under 15 minutes.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                href="/menu"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_14px_40px_-10px_rgba(249,115,22,0.5)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand-500 to-brand-600 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <ShoppingBag className="relative h-4 w-4" />
                <span className="relative">Order Now</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-50"
              >
                <UtensilsCrossed className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-brand-500" />
                View Menu
              </Link>
            </div>

            {/* Trust row (avatars + rating) */}
            <div className="mt-9 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {AVATARS.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FDFCFB]"
                    loading="lazy"
                  />
                ))}
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white ring-2 ring-[#FDFCFB]">
                  500+
                </span>
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-brand-500 text-brand-500"
                    />
                  ))}
                </div>
                <span className="mt-0.5 text-[11px] font-medium text-neutral-500">
                  Loved by 500+ customers
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Visual ────────────────────────────── */}
          <div className="relative lg:col-span-5 lg:col-start-7 xl:col-span-6">
            <div className="group relative mx-auto aspect-square w-full max-w-[560px]">

              {/* Halo glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.22)_0%,_rgba(249,115,22,0.06)_45%,_transparent_72%)] blur-2xl transition-all duration-700 ease-out group-hover:bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.32)_0%,_rgba(249,115,22,0.10)_45%,_transparent_74%)]"
              />

              {/* Base disc (soft cream + inset depth) */}
              <div
                aria-hidden="true"
                className="absolute inset-[7%] rounded-full bg-gradient-to-br from-[#fff6ec] via-brand-[#fff6ec] to-brand-[#fff6ec] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-50px_90px_-50px_rgba(249,115,22,0.22),0_1px_0_rgba(0,0,0,0.02)] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />

              {/* Ambient orbs */}
              <div
                aria-hidden="true"
                className="absolute left-[8%] top-[16%] h-20 w-20 rounded-full bg-brand-300/35 blur-2xl animate-float-slow"
              />
              <div
                aria-hidden="true"
                className="absolute right-[12%] top-[32%] h-14 w-14 rounded-full bg-brand-400/25 blur-2xl animate-float-slow"
                style={{ animationDelay: "1.2s" }}
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[16%] left-[24%] h-24 w-24 rounded-full bg-brand-200/45 blur-3xl animate-float-slow"
                style={{ animationDelay: "2.4s" }}
              />

              {/* Burger */}
              <div className="absolute inset-[14%] grid place-items-center">
                <div className="animate-float-slow transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
                    alt="Handcrafted burger"
                    className="aspect-square w-full rounded-full object-cover shadow-[0_30px_60px_-25px_rgba(249,115,22,0.55)] ring-[8px] ring-white transition-shadow duration-500 group-hover:shadow-[0_45px_80px_-25px_rgba(249,115,22,0.65)]"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Decorative "Fresh Daily" pill — always visible, top-right */}
              <div className="absolute right-[2%] top-[6%] flex items-center gap-1.5 rounded-full border border-brand-200/70 bg-white/90 px-3 py-1.5 shadow-[0_8px_24px_-8px_rgba(249,115,22,0.35)] backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-brand-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                  Fresh Daily
                </span>
              </div>

              {/* ── Reveal chips on hover ───────────────── */}

              {/* Rating — top-left */}
              <div className="pointer-events-none absolute left-0 top-[12%] -translate-x-3 scale-95 opacity-0 transition-all duration-500 ease-out delay-100 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-100 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_32px_-12px_rgba(23,23,23,0.18)] backdrop-blur-md">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50">
                    <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-neutral-900">
                      4.9 / 5.0
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                      500+ Reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Time — right-center */}
              <div className="pointer-events-none absolute right-0 top-1/2 translate-x-3 -translate-y-1/2 scale-95 opacity-0 transition-all duration-500 ease-out delay-200 group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-100 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_32px_-12px_rgba(23,23,23,0.18)] backdrop-blur-md">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50">
                    <Clock className="h-3.5 w-3.5 text-brand-600" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-neutral-900">
                      15 min
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                      Pickup Ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Fresh — bottom-center */}
              <div className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 translate-y-3 scale-95 opacity-0 transition-all duration-500 ease-out delay-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                <div className="flex items-center gap-2.5 rounded-2xl border border-neutral-100 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_32px_-12px_rgba(23,23,23,0.18)] backdrop-blur-md">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-50">
                    <Leaf className="h-3.5 w-3.5 text-brand-600" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-neutral-900">
                      100% Fresh
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                      Made to Order
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile hint */}
            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 lg:hidden">
              Tap the burger to reveal details
            </p>
          </div>
        </div>
      </div>

      {/* ── Marquee ─────────────────────────────────────── */}
      {/* <div className="relative mt-20 border-y border-neutral-100 bg-neutral-50/60 py-5 sm:mt-24">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-12 pr-12"
            >
              {MARQUEE.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-12 whitespace-nowrap"
                >
                  <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-neutral-500">
                    {item}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-brand-400" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}