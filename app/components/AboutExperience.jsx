"use client";

import { Quote } from "lucide-react";

export default function AboutExperience() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-10 sm:py-12 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Centered header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-6 bg-brand-500" />
            The Experience
            <span className="h-px w-6 bg-brand-500" />
          </div>
          <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
            More than food —{" "}
            <span className="font-serif italic font-normal text-brand-500">
              it&apos;s an experience.
            </span>
          </h2>
        </div>

        {/* Photo grid — bento style */}
        <div className="mt-14 grid gap-4 sm:grid-cols-6 lg:grid-cols-12 lg:gap-5">
          {/* Big image left */}
          <div className="sm:col-span-6 lg:col-span-7">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
                alt="Warm café interior"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

              {/* Text overlay */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-300">
                  The Space
                </div>
                <h3 className="mt-2 font-display text-[18px] font-bold leading-tight tracking-[-0.01em] sm:text-[20px]">
                  A café built for slow bites
                </h3>
                <p className="mt-2 max-w-md text-[12.5px] leading-[1.6] text-white/75">
                  Warm lights, curated music, and a counter you&apos;ll want to
                  linger at.
                </p>
              </div>
            </div>
          </div>

          {/* Right column — 2 stacked images */}
          <div className="grid gap-4 sm:col-span-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {/* Small image top */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=800&q=85"
                alt="Chef hands at work"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">
                  The Craft
                </div>
                <div className="mt-1 text-[13px] font-bold">
                  Built to order, every time
                </div>
              </div>
            </div>

            {/* Small image bottom */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=85"
                alt="Happy customers"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-300">
                  The People
                </div>
                <div className="mt-1 text-[13px] font-bold">
                  Regulars who became friends
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big pull quote */}
        <figure className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
          <Quote
            className="mx-auto h-6 w-6 rotate-180 fill-brand-500/15 text-brand-500/70"
            strokeWidth={1.5}
          />
          <blockquote className="mt-6">
            <p className="font-serif text-[1.25rem] italic leading-[1.5] tracking-[-0.005em] text-neutral-900 sm:text-[1.5rem] sm:leading-[1.45]">
              &ldquo;We don&apos;t think of ourselves as a burger shop. We
              think of ourselves as a daily ritual for the neighbourhood.&rdquo;
            </p>
          </blockquote>
          <figcaption className="mt-6 text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            — Karan Bhatia, Head Chef
          </figcaption>
        </figure>
      </div>
    </section>
  );
}