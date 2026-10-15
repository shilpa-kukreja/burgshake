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
              it&apos;s a feeling worth coming back for.
            </span>
          </h2>
        </div>

        {/* Three squares row */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {/* ── Square 1 — The Space ───────────────── */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src="/aboutpage/experience1.jpeg"
              alt="Warm café interior"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-300">
                The Space
              </div>
              <h3 className="mt-2 font-display text-[17px] font-bold leading-tight tracking-[-0.01em] sm:text-[19px]">
                A place for every craving
              </h3>
              <p className="mt-2 max-w-md text-[12.5px] leading-[1.6] text-white/75">
                A welcoming spot to enjoy your favourite burgers, creamy shakes,
                and crispy fries, whether you're grabbing a quick bite or
                catching up with friends.
              </p>
            </div>
          </div>

          {/* ── Square 2 — The Craft ───────────────── */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src="/aboutpage/experience2.jpeg"
              alt="Chef hands at work"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-300">
                The Craft
              </div>
              <h3 className="mt-2 font-display text-[17px] font-bold leading-tight tracking-[-0.01em] sm:text-[19px]">
                Flavour in every detail
              </h3>
              <p className="mt-2 max-w-md text-[12.5px] leading-[1.6] text-white/75">
                From juicy, flavour-packed burgers to indulgent shakes, every
                menu favourite is all about great taste and a satisfying
                experience.
              </p>
            </div>
          </div>

          {/* ── Square 3 — The People ──────────────── */}
          <div className="group relative aspect-square overflow-hidden rounded-3xl bg-neutral-100 sm:col-span-2 lg:col-span-1">
            <img
              src="/aboutpage/experience3.jpeg"
              alt="Happy customers"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-300">
                The People
              </div>
              <h3 className="mt-2 font-display text-[17px] font-bold leading-tight tracking-[-0.01em] sm:text-[19px]">
                Good food brings us together
              </h3>
              <p className="mt-2 max-w-md text-[12.5px] leading-[1.6] text-white/75">
                From first-time visitors to familiar faces, BurgShake is about
                sharing delicious moments and making every visit feel special.
              </p>
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
              We believe great food does more than satisfy a craving — it brings
              people together, one delicious bite at a time.
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
