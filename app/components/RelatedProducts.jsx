"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MenuCard from "./MenuCard";

export default function RelatedProducts({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200/70 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              You might also like
            </div>
            <h2 className="mt-3 font-display text-[1.5rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[1.75rem]">
              Pairs well with{" "}
              <span className="font-serif italic font-normal text-brand-500">
                your order.
              </span>
            </h2>
          </div>

          <Link
            href="/menu"
            className="group inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-neutral-950"
          >
            <span className="border-b border-neutral-950 pb-0.5 transition-colors group-hover:border-brand-500 group-hover:text-brand-600">
              View full menu
            </span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}