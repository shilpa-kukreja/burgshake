"use client";

import { Star, Quote } from "lucide-react";

const SAMPLE_REVIEWS = [
  {
    name: "Priya S.",
    role: "Verified Order",
    avatar: "https://i.pravatar.cc/120?img=45",
    rating: 5,
    date: "3 days ago",
    text: "Absolutely delicious. Cooked perfectly, warm when I picked it up. The brioche bun makes a big difference.",
  },
  {
    name: "Rohan K.",
    role: "Verified Order",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    date: "1 week ago",
    text: "Customised my own with extra jalapeños and bacon — unbelievable. Ready in 12 minutes exactly as promised.",
  },
  {
    name: "Ananya I.",
    role: "Local Guide",
    avatar: "https://i.pravatar.cc/120?img=68",
    rating: 4,
    date: "2 weeks ago",
    text: "Great taste, generous portions. Would love a spicier option on the menu but otherwise perfect.",
  },
];

export default function ProductReviews({ item }) {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-8 sm:py-12">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-300/40 pb-6 sm:flex-row sm:items-end">
          <div>
            {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Reviews
            </div> */}
            <h2 className="mt-3 font-display text-[1.5rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[1.75rem]">
              What people say{" "}
              <span className="font-serif italic font-normal text-brand-500">
                about this dish.
              </span>
            </h2>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-brand-500 text-brand-500"
                />
              ))}
            </div>
            <span className="font-display text-[15px] font-bold text-neutral-900">
              {item.rating}
            </span>
            <span className="h-3 w-px bg-neutral-300" />
            <span className="text-[12px] font-medium text-neutral-500">
              {item.reviews} reviews
            </span>
          </div>
        </div>

        {/* Review cards */}
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SAMPLE_REVIEWS.map((r) => (
            <article
              key={r.name}
              className="group relative flex flex-col rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(23,23,23,0.03)] transition-all duration-500 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-[0_20px_44px_-24px_rgba(249,115,22,0.28)]"
            >
              <Quote className="h-4 w-4 rotate-180 fill-brand-500/15 text-brand-500/60" />

              {/* Stars */}
              <div className="mt-4 flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < r.rating
                        ? "fill-brand-500 text-brand-500"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="mt-4 flex-1 font-serif text-[14px] italic leading-[1.65] text-neutral-700">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="mt-5 h-px w-full bg-neutral-200/80" />

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-neutral-200"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <div className="text-[12.5px] font-bold text-neutral-950">
                    {r.name}
                  </div>
                  <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    {r.role} · {r.date}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}