// "use client";

// import { Star, Quote } from "lucide-react";

// const REVIEWS = [
//   {
//     name: "Aarav Mehta",
//     role: "Regular since 2022",
//     avatar: "https://i.pravatar.cc/120?img=12",
//     quote:
//       "Hands-down the best burger in the city. Juicy patty, soft bun, and the house sauce ties it all together.",
//     item: "The Classic Smash",
//   },
//   {
//     name: "Priya Sharma",
//     role: "Food Blogger",
//     avatar: "https://i.pravatar.cc/120?img=45",
//     quote:
//       "Every shake is thick and rich — actually tastes like the real thing, never overly sweet.",
//     item: "Belgian Choco Shake",
//   },
//   {
//     name: "Rohan Kapoor",
//     role: "Verified Customer",
//     avatar: "https://i.pravatar.cc/120?img=33",
//     quote:
//       "Built my own with extra jalapeños and smoked cheddar. Ready in twelve minutes, perfectly fresh.",
//     item: "Build Your Own",
//   },
// ];

// function Stars() {
//   return (
//     <div className="flex items-center gap-0.5">
//       {[...Array(5)].map((_, i) => (
//         <Star key={i} className="h-3 w-3 fill-brand-500 text-brand-500" />
//       ))}
//     </div>
//   );
// }

// export default function Testimonials() {
//   return (
//     <section className="relative overflow-hidden bg-[#FFF6EC] py-16 sm:py-20">
//       {/* Background */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
//       >
//         <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_70%)]" />
//         <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
//         <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
//       </div>

//       <div className="mx-auto max-w-7xl px-6 lg:px-10">
//         {/* ── Header (single line, split) ────────────── */}
//         <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
//           <div>
//             <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
//               <span className="h-px w-8 bg-brand-500" />
//               Kind Words
//             </div>
//             <h2 className="mt-3 font-display text-[1.7rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
//               Loved on every{" "}
//               <span className="font-serif italic font-normal text-brand-500">
//                 visit.
//               </span>
//             </h2>
//           </div>

//           {/* Aggregate rating */}
//           <div className="flex items-center gap-3">
//             <div className="flex -space-x-2">
//               {[12, 33, 45, 68].map((n) => (
//                 <img
//                   key={n}
//                   src={`https://i.pravatar.cc/80?img=${n}`}
//                   alt=""
//                   className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FFF6EC]"
//                   loading="lazy"
//                 />
//               ))}
//               <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-[9.5px] font-bold text-white ring-2 ring-[#FFF6EC]">
//                 500+
//               </span>
//             </div>
//             <div className="leading-tight">
//               <Stars />
//               <span className="mt-0.5 block text-[10.5px] font-medium text-neutral-500">
//                 <span className="font-bold text-neutral-900">4.9</span> · 500+ reviews
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── Three compact testimonials ─────────────── */}
//         <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-neutral-200/70 bg-neutral-200/70 sm:grid-cols-3">
//           {REVIEWS.map((r) => (
//             <figure
//               key={r.name}
//               className="group relative flex flex-col bg-[#FFF6EC] p-6 transition-colors duration-500 hover:bg-white sm:p-7"
//             >
//               {/* Quote icon + stars row */}
//               <div className="flex items-center justify-between">
//                 <Quote className="h-4 w-4 rotate-180 fill-brand-500/15 text-brand-500/60" />
//                 <Stars />
//               </div>

//               {/* Quote */}
//               <blockquote className="mt-5 flex-1">
//                 <p className="font-serif text-[14.5px] italic leading-[1.6] text-neutral-800">
//                   &ldquo;{r.quote}&rdquo;
//                 </p>
//               </blockquote>

//               {/* Divider */}
//               <div className="mt-5 h-px w-full bg-neutral-200/80" />

//               {/* Attribution */}
//               <figcaption className="mt-4 flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-2.5">
//                   <img
//                     src={r.avatar}
//                     alt={r.name}
//                     className="h-8 w-8 rounded-full object-cover ring-1 ring-neutral-200"
//                     loading="lazy"
//                   />
//                   <div className="leading-tight">
//                     <div className="text-[12.5px] font-bold text-neutral-950">
//                       {r.name}
//                     </div>
//                     <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
//                       {r.role}
//                     </div>
//                   </div>
//                 </div>
//               </figcaption>

//               {/* Bottom accent line */}
//               <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out group-hover:w-full" />
//             </figure>
//           ))}
//         </div>

//         {/* ── Ordered-item chips strip ───────────────── */}
//         <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
//           {REVIEWS.map((r) => (
//             <span key={r.item} className="flex items-center gap-2">
//               <span className="h-1 w-1 rounded-full bg-brand-500" />
//               {r.item}
//             </span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Priya Sharma",
    role: "Food Blogger",
    avatar: "https://i.pravatar.cc/120?img=45",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    quote:
      "Every shake is thick and rich — actually tastes like the real thing, never overly sweet.",
    item: "Belgian Choco Shake",
  },
  {
    name: "Aarav Mehta",
    role: "Regular since 2022",
    avatar: "https://i.pravatar.cc/120?img=12",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    quote:
      "Best burger in the city. Juicy patty, soft bun, and the house sauce ties it all together.",
    item: "The Classic Smash",
  },
  {
    name: "Ananya Iyer",
    role: "Local Guide",
    avatar: "https://i.pravatar.cc/120?img=68",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    quote:
      "The ambience feels like a boutique café in Europe. Warm light, great music, food matches the vibe.",
    item: "Peri Peri Chicken",
  },
];

/* ─── Stars ──────────────────────────────────────────── */
function Stars({ light = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            light ? "fill-white text-white" : "fill-brand-500 text-brand-500"
          }`}
        />
      ))}
    </div>
  );
}

/* ─── Component ──────────────────────────────────────── */
export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-8 sm:py-10">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Kind Words
            </div>
            <h2 className="mt-3 font-display text-[1.7rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
              Loved on every{" "}
              <span className="font-serif italic font-normal text-brand-500">
                visit.
              </span>
            </h2>
          </div>

          {/* Aggregate rating */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[12, 33, 45, 68].map((n) => (
                <img
                  key={n}
                  src={`https://i.pravatar.cc/80?img=${n}`}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FFF6EC]"
                  loading="lazy"
                />
              ))}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-[9.5px] font-bold text-white ring-2 ring-[#FFF6EC]">
                500+
              </span>
            </div>
            <div className="leading-tight">
              <Stars />
              <span className="mt-0.5 block text-[10.5px] font-medium text-neutral-500">
                <span className="font-bold text-neutral-900">4.9</span> · 500+
                reviews
              </span>
            </div>
          </div>
        </div>

        {/* ── Photo wall (staggered) ─────────────────── */}
        <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <article
              key={r.name}
              className={`group relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 shadow-[0_20px_50px_-25px_rgba(23,23,23,0.35)] transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-[0_35px_70px_-25px_rgba(249,115,22,0.4)] ${
                i === 1 ? "md:mt-12" : ""
              }`}
            >
              {/* Photo */}
              <img
                src={r.photo}
                alt={r.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                loading="lazy"
              />

              {/* Warm orange tint on hover */}
              <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/25" />

              {/* Bottom dark gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/45 to-transparent" />

              {/* Top row: item chip + rating */}
              <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                <span className="rounded-full bg-white/95 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-900 shadow-sm backdrop-blur-sm">
                  {r.item}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-neutral-950/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                  <Star className="h-2.5 w-2.5 fill-brand-400 text-brand-400" />
                  5.0
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                {/* Quote mark */}
                <Quote className="h-5 w-5 rotate-180 fill-white/20 text-white/50" />

                {/* Quote */}
                <blockquote className="mt-4">
                  <p className="font-serif text-[15px] italic leading-[1.55] text-white/95 sm:text-[15.5px]">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Divider */}
                <div className="mt-5 h-px w-full bg-white/15" />

                {/* Attribution */}
                <figcaption className="mt-4 flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/25"
                    loading="lazy"
                  />
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-white">
                      {r.name}
                    </div>
                    <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/55">
                      {r.role}
                    </div>
                  </div>
                </figcaption>
              </div>

              {/* Thin orange frame on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 transition-colors duration-500 group-hover:ring-brand-500/40" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}