"use client";

const TEAM = [
  {
    name: "Karan Bhatia",
    role: "Head Chef & Co-founder",
    bio: "Spent 8 years in restaurant kitchens before deciding burgers deserved a cleaner canvas.",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Dev Malhotra",
    role: "Co-founder & Operations",
    bio: "Keeps the counter humming, the queue moving, and the standards high — every single day.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Nisha Rao",
    role: "Pastry & Shakes Lead",
    bio: "Designs every shake recipe from scratch. Believes texture matters more than sugar.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Sara Khan",
    role: "Front of House",
    bio: "The first face you see — remembers regulars by name, order, and how they like their fries.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
  },
];

export default function AboutTeam() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-10 sm:py-12">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/4 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-neutral-300/40 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              The Team
            </div>
            <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
              The people behind{" "}
              <span className="font-serif italic font-normal text-brand-500">
                the counter.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-[14px] leading-[1.7] text-neutral-500 sm:text-right">
            A small crew. Serious about what they do. Warm about how they do
            it.
          </p>
        </div>

        {/* Team grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="group relative overflow-hidden rounded-xl bg-white  transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(249,115,22,0.4)]"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src={member.img}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
                {/* Warm tint */}
                <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/15" />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-display text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                  {member.name}
                </h3>
                <div className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-600">
                  {member.role}
                </div>
                <p className="mt-3 text-[12.5px] leading-[1.65] text-neutral-500">
                  {member.bio}
                </p>
              </div>

              {/* Bottom accent */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}