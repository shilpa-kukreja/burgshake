"use client";

import { Clock, Coffee, UtensilsCrossed, Moon, Sparkles } from "lucide-react";

const HOURS = [
  {
    Icon: Coffee,
    label: "Breakfast",
    time: "11:00 AM – 12:30 PM",
    note: "Coffee, quick bites, early birds",
  },
  {
    Icon: UtensilsCrossed,
    label: "Lunch",
    time: "12:30 PM – 4:00 PM",
    note: "Peak hours · expect a small queue",
  },
  {
    Icon: Sparkles,
    label: "Evening",
    time: "4:00 PM – 7:00 PM",
    note: "Shakes, snacks, chill hours",
  },
  {
    Icon: Moon,
    label: "Dinner",
    time: "7:00 PM – 11:00 PM",
    note: "Last order at 10:30 PM",
  },
];

export default function ContactHours() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-10 sm:py-12">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-200/70 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Operating Hours
            </div> */}
            <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
              Open every day,{" "}
              <span className="font-serif italic font-normal text-brand-500">
                all day.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-neutral-500">
              Same hours every day of the week. Walk in, order at the counter,
              or place a takeaway order online.
            </p>
          </div>

          {/* Live status chip */}
          {/* <div className="flex items-center gap-2.5 rounded-full border border-emerald-200 bg-emerald-50/70 px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Open Now
            </span>
          </div> */}
        </div>

        {/* Hours grid */}
        <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-neutral-200/70 bg-neutral-200/70 sm:grid-cols-2 lg:grid-cols-4">
          {HOURS.map(({ Icon, label, time, note }) => (
            <article
              key={label}
              className="group relative flex flex-col bg-[#FDFCFB] p-6 transition-colors duration-500 hover:bg-white sm:p-7"
            >
              {/* Icon chip */}
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-brand-100 transition-all duration-500 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:ring-brand-500/40">
                <Icon
                  className="h-4.5 w-4.5 text-brand-600 transition-colors duration-500 group-hover:text-white"
                  strokeWidth={2.2}
                />
              </div>

              {/* Label */}
              <div className="mt-5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-600">
                {label}
              </div>

              {/* Time */}
              <div className="mt-2 font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                {time}
              </div>

              {/* Note */}
              <div className="mt-1.5 text-[12px] leading-[1.6] text-neutral-500">
                {note}
              </div>

              {/* Bottom line */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out group-hover:w-full" />
            </article>
          ))}
        </div>

        {/* Bottom note */}
        {/* <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-4">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-[12.5px] leading-[1.65] text-amber-800">
            <strong className="font-bold">Please note:</strong> We&apos;re a
            takeaway-only café. No home delivery — pick up your order at the
            counter. Last order is accepted 30 minutes before closing.
          </p>
        </div> */}
      </div>
    </section>
  );
}