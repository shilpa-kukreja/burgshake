"use client";

import { Sparkles, MapPin } from "lucide-react";

export default function MenuHero() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden sm:h-[420px] lg:h-[440px]">
      {/* ── Background image ─────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2000&q=85"
          alt="Burgers & Shakes"
          className="h-full w-full object-cover"
          loading="eager"
        />

        {/* Warm dark → orange gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 to-brand-600/55" />

        {/* Extra warm wash */}
        <div className="absolute inset-0 bg-brand-600/10 mix-blend-overlay" />

        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Vignette — softens edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="relative z-10 mx-auto  flex h-full max-w-7xl items-end px-6 pb-10 lg:px-10 lg:pb-12">
        <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">

          {/* Left: Heading */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <span className="h-px w-6 bg-brand-400" />
              The Full Menu
            </div> */}

            {/* Headline */}
            <h1 className="mt-4 font-display text-[1.9rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.4rem] lg:text-[2.9rem]">
              Everything we{" "}
              <span className="font-serif italic font-normal text-brand-300">
                make fresh.
              </span>
            </h1>

            {/* Sub text */}
            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
              Burgers, shakes, sides, and cold drinks — every item built to
              order, ready for takeaway in under 15 minutes.
            </p>
          </div>

       
        </div>
      </div>
    </section>
  );
}