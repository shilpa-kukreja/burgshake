"use client";

import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  subLabel,
  icon: Icon,
  accent = "brand",
  href,
}) {
  const accents = {
    brand: {
      chipBg: "from-brand-50 to-brand-100/80 ring-brand-100 text-brand-600",
      value: "text-brand-600",
    },
    emerald: {
      chipBg: "from-emerald-50 to-emerald-100/80 ring-emerald-100 text-emerald-600",
      value: "text-emerald-600",
    },
    amber: {
      chipBg: "from-amber-50 to-amber-100/80 ring-amber-100 text-amber-600",
      value: "text-amber-600",
    },
    blue: {
      chipBg: "from-blue-50 to-blue-100/80 ring-blue-100 text-blue-600",
      value: "text-blue-600",
    },
  };
  const a = accents[accent] || accents.brand;

  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={`group relative flex flex-col rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 ${
        href ? "hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_16px_36px_-20px_rgba(249,115,22,0.3)]" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        {Icon && (
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ring-1 ${a.chipBg}`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </span>
        )}
        {href && (
          <ArrowUpRight className="h-4 w-4 text-neutral-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500" />
        )}
      </div>

      <div className="mt-5">
        <div className="font-display text-[24px] font-extrabold leading-none tabular-nums tracking-[-0.02em] text-neutral-950 sm:text-[26px]">
          {value}
        </div>
        <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </div>
        {subLabel && (
          <div className={`mt-1 text-[11.5px] font-semibold ${a.value}`}>
            {subLabel}
          </div>
        )}
      </div>
    </Wrapper>
  );
}