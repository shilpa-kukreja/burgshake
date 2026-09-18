"use client";

import { Sparkles } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative h-[400px] w-full overflow-hidden sm:h-[420px] lg:h-[440px]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=2000&q=85"
          alt="Burgshake café"
          className="h-full w-full object-cover"
          loading="eager"
        />

        {/* Warm dark → orange gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 to-brand-600/55" />
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

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-12 lg:px-10 lg:pb-14">
        <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          {/* Heading */}
          <div className="max-w-xl">
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <span className="h-px w-6 bg-brand-400" />
              Our Story
            </div> */}

            <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.5rem] lg:text-[3rem]">
              Made by hand.{" "}
              <span className="font-serif italic font-normal text-brand-300">
                Served with heart.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
              We&apos;re a small takeaway café with one mission — to make the
              kind of burger you&apos;d drive across town for.
            </p>
          </div>

          {/* Info chip */}
          {/* <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-white">
              Since 2022 · Bandra West
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
}