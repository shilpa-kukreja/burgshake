"use client";

import { Award, Lightbulb, HandHeart } from "lucide-react";

const VALUES = [
  {
    Icon: Award,
    title: "Quality",
    desc: "We'd rather remove something from the menu than compromise on how it's made. Every ingredient earns its place.",
  },
  {
    Icon: Lightbulb,
    title: "Creativity",
    desc: "Our specials change with the seasons, our sauces are made in-house, and our shakes never came from a powder.",
  },
  {
    Icon: HandHeart,
    title: "Hospitality",
    desc: "Great food only matters if the people around it feel welcome. Warm greetings, warm food, warm goodbyes.",
  },
];

export default function AboutValues() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-10 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-6 bg-brand-500" />
            Our Values
            <span className="h-px w-6 bg-brand-500" />
          </div>
          <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
            What we stand{" "}
            <span className="font-serif italic font-normal text-brand-500">
              behind.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ Icon, title, desc }) => (
            <article
              key={title}
              className="group relative flex flex-col rounded-3xl border border-neutral-200/70 bg-white p-7 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-[0_30px_60px_-25px_rgba(249,115,22,0.35)]"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/80 ring-1 ring-brand-100 transition-all duration-500 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:ring-brand-500/40">
                <Icon
                  className="h-6 w-6 text-brand-600 transition-colors duration-500 group-hover:text-white"
                  strokeWidth={2}
                />
              </div>

              <h3 className="mt-5 font-display text-[17px] font-bold tracking-[-0.01em] text-neutral-950 transition-colors duration-500 group-hover:text-brand-600">
                {title}
              </h3>

              <p className="mt-3 text-[13.5px] leading-[1.7] text-neutral-500">
                {desc}
              </p>

              <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-all duration-500 ease-out group-hover:w-3/4" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}