"use client";

import { Sparkles, MapPin } from "lucide-react";

export default function MenuHero() {
  return (
    <section className="relative w-full overflow-hidden mt-0 sm:mt-26">
      {/* ── Background image (defines section height) ── */}
      <img
        src="/menu/banner.jpeg"
        alt="Burgers & Shakes"
        className="block h-auto w-full object-cover"
        loading="eager"
      />

      {/* ── Overlays (absolute, don't affect height) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm dark → orange gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 to-brand-600/55" /> */}

        {/* Extra warm wash */}
        {/* <div className="absolute inset-0 bg-brand-600/10 mix-blend-overlay" /> */}

        {/* Dot texture */}
        {/* <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        /> */}

        {/* Vignette — softens edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* ── Content (overlaid on top of image) ────────── */}
      <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl items-end px-6 pb-10 lg:px-10 lg:pb-12">
        <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          {/* Left: Heading */}
          <div className="max-w-xl">
            <h1 className="mt-4 font-display text-[1.9rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.4rem] lg:text-[2.9rem]">
              Everything we{" "}
              <span className="font-serif italic font-normal text-brand-300">
                make fresh.
              </span>
            </h1>

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