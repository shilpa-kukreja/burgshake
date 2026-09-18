"use client";

import Link from "next/link";
import { ArrowRight, UtensilsCrossed } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-8 sm:py-10">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-neutral-200/70 bg-white p-8 text-center  sm:p-12">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-6 bg-brand-500" />
            Come Hungry
            <span className="h-px w-6 bg-brand-500" />
          </div>

          <h2 className="max-w-xl font-display text-[1.75rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
            Same burgers. Same craft.{" "}
            <span className="font-serif italic font-normal text-brand-500">
              Your table or ours.
            </span>
          </h2>

          <p className="max-w-md text-[14px] leading-[1.7] text-neutral-500">
            Order online and collect fresh from our Bandra counter in about 15
            minutes.
          </p>

          <div className="mt-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link
              href="/menu"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Order Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-[13.5px] font-bold text-neutral-800 transition-all duration-300 hover:border-neutral-950 hover:bg-neutral-50"
            >
              Visit Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}