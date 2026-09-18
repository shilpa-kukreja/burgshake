"use client";

const PILLARS = [
  {
    no: "01",
    title: "Fire & Patience",
    desc: "Every patty pressed, seared, and rested to order. Never pre-cooked.",
  },
  {
    no: "02",
    title: "Fresh or Nothing",
    desc: "Buns baked daily, produce locally sourced, cheese sliced same morning.",
  },
  {
    no: "03",
    title: "Built for People",
    desc: "Designed around how you actually eat — quick, warm, and worth the walk.",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Compact header — one line */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-500" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-brand-600">
              Our Philosophy
            </span>
          </div>
          <p className="text-[13px] font-medium text-neutral-500 sm:text-right">
            Three rules we never break.
          </p>
        </div>

        {/* Type-only three-column strip */}
        <div className="mt-8 grid gap-8 border-y border-neutral-300/60 py-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-neutral-300/60 sm:py-12">
          {PILLARS.map((p, i) => (
            <article
              key={p.no}
              className={`group relative ${
                i === 0 ? "sm:pr-8 lg:pr-12" : ""
              } ${i === 1 ? "sm:px-8 lg:px-12" : ""} ${
                i === 2 ? "sm:pl-8 lg:pl-12" : ""
              }`}
            >
              {/* Number — small, editorial, top */}
              {/* <span className="font-display text-[11px] font-bold tracking-[0.18em] text-neutral-400 transition-colors duration-500 group-hover:text-brand-500">
                / {p.no}
              </span> */}

              {/* Title — the hero */}
              <h3 className="mt-4 font-display text-[19px] font-bold leading-[1.2] tracking-[-0.015em] text-neutral-950 transition-colors duration-500 group-hover:text-brand-600 sm:text-[20px] lg:text-[21px]">
                {p.title}
              </h3>

              {/* Description — muted */}
              <p className="mt-3 text-[13px] leading-[1.7] text-neutral-500">
                {p.desc}
              </p>

              {/* Small underline accent grows on hover */}
              <span className="mt-5 block h-px w-6 bg-neutral-400/60 transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-brand-500" />
            </article>
          ))}
        </div>

        {/* Signature close */}
        <div className="mt-6 flex items-center justify-between gap-4 text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-400">
          <span className="font-serif text-[12.5px] font-normal italic normal-case tracking-normal text-neutral-500">
            — The Burgshake Kitchen
          </span>
          {/* <span>Est. 2022 · Bandra West</span> */}
        </div>
      </div>
    </section>
  );
}