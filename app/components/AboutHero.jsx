
"use client";

export default function AboutHero() {
  return (
    <section className="relative mt-0 w-full overflow-hidden sm:mt-26">
      {/* Background image determines section height */}
      <img
        src="/about/banner.jpg"
        alt="Burgshake café"
        className="block h-auto w-full"
        loading="eager"
      />

      {/* Warm dark → orange gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 to-brand-600/55" />

      <div className="absolute inset-0 bg-brand-600/10 mix-blend-overlay" /> */}

      {/* Dot texture */}
      {/* <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      /> */}

      {/* Vignette */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" /> */}

      {/* Content */}
      <div className="absolute inset-0 z-10 mx-auto flex w-full max-w-7xl items-end px-6 pb-6 sm:pb-8 lg:px-10 lg:pb-10">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
          {/* Heading */}
          <div className="max-w-xl">
            <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.5rem] lg:text-[3rem]">
              Made by hand.{" "}
              <span className="font-serif font-normal italic text-brand-300">
                Served with heart.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-[14px] leading-[1.7] text-white/75 sm:text-[15px]">
              We&apos;re a small takeaway café with one mission — to make the
              kind of burger you&apos;d drive across town for.
            </p>
          </div>

          {/* Info chip intentionally kept commented out */}
        </div>
      </div>
    </section>
  );
}
