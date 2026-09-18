"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Sparkles, Clock } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* ── Full background image ────────────────────── */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/burger.gif"
          alt=""
          className="h-[500px] w-full object-cover"
          loading="lazy"
        />
        {/* Warm orange overlay (dark → orange gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 " />
        {/* Extra warm wash */}
        {/* <div className="absolute inset-0 bg-brand-600/15 mix-blend-overlay" /> */}
        {/* Dot texture */}
        {/* <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        /> */}
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-10 lg:px-10 lg:py-12">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">

          {/* ── LEFT: Copy ───────────────────────────── */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
              </span>
              Ready in 15 minutes
            </div>

            {/* Headline */}
            <h2 className="mt-6 font-display text-[2.1rem] font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-[2.6rem] lg:text-[3.2rem]">
              Hungry yet?{" "}
              <br className="hidden sm:block" />
              <span className="font-serif italic font-normal text-white/90">
                Your order&apos;s
              </span>{" "}
              waiting.
            </h2>

            {/* Subtext */}
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.7] text-white/75 lg:mx-0">
              Skip the wait — order ahead, pick a time slot, and collect your
              favourite burgers &amp; shakes fresh from the counter.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-neutral-950 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)]"
              >
                Order Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10"
              >
                <UtensilsCrossed className="h-4 w-4" />
                View Full Menu
              </Link>
            </div>

            {/* Trust micro-line */}
            {/* <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/70 lg:justify-start">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/80" />
                No delivery · Takeaway only
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/80" />
                500+ five-star reviews
              </span>
            </div> */}
          </div>

          {/* ── RIGHT: Glass info card ───────────────── */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">
              {/* Small header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Today at Burgshake
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-brand-400 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-200" />
                  Open now
                </span>
              </div>

              {/* Quick facts */}
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-white">
                      Avg 15 min pickup
                    </div>
                    <div className="mt-1 text-[11.5px] text-white/60">
                      We message when your order is ready.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-white">
                      Made fresh to order
                    </div>
                    <div className="mt-1 text-[11.5px] text-white/60">
                      Never pre-made, never reheated.
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mt-6 h-px w-full bg-white/15" />

              {/* Mini stat row */}
              <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-display text-lg font-bold text-white">
                    50+
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                    Items
                  </div>
                </div>
                <div className="border-x border-white/15">
                  <div className="font-display text-lg font-bold text-white">
                    4.9
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                    Rating
                  </div>
                </div>
                <div>
                  <div className="font-display text-lg font-bold text-white">
                    500+
                  </div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                    Reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}