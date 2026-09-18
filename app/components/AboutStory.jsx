"use client";

export default function AboutStory() {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-10 sm:py-12 lg:py-12">
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: Image */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Big image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-neutral-100 shadow-[0_30px_70px_-25px_rgba(249,115,22,0.35)]">
                <img
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85"
                  alt="Smashing fresh patties"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Overlay card: year badge */}
              {/* <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white px-4 py-3 shadow-[0_20px_44px_-20px_rgba(249,115,22,0.4)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <span className="font-display text-[13px] font-extrabold">
                    22
                  </span>
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-600">
                    Since
                  </div>
                  <div className="mt-0.5 text-[12px] font-semibold text-neutral-800">
                    First smash · 2022
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right: Text */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Our Story
            </div>

            <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem] lg:text-[2.4rem]">
              It started with one{" "}
              <span className="font-serif italic font-normal text-brand-500">
                really good burger.
              </span>
            </h2>

            <div className="mt-6 space-y-4 text-[14.5px] leading-[1.8] text-neutral-600">
              <p>
                Burgshake began as a weekend passion project — two friends, a
                tiny griddle, and a stubborn belief that burgers deserved
                better. We spent months perfecting one recipe: the smash. The
                right beef, the right bun, the right sauce, in the right order.
              </p>

              <p>
                Word spread fast. Soon a handful of regulars became a queue
                down the street. We opened our first takeaway counter in Bandra
                in 2022 with a simple promise — everything made fresh, nothing
                pre-made, and every order ready in under 15 minutes.
              </p>

              <p>
                Four years later, the same promise still runs the kitchen.
                We&apos;ve grown the menu, the team, and the space — but the
                burger you get today is built exactly the way it was on day
                one.
              </p>
            </div>

            {/* Signature line */}
            <div className="mt-8 flex items-center gap-4 border-t border-neutral-200/70 pt-6">
              <div className="flex -space-x-2.5">
                {[15, 33].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/80?img=${n}`}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#FDFCFB]"
                    loading="lazy"
                  />
                ))}
              </div>
              <div className="leading-tight">
                <div className="text-[12.5px] font-bold text-neutral-900">
                  Karan &amp; Dev
                </div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Founders · Burgshake
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}