"use client";

import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

/* Inline brand SVGs — lucide removed these */
function InstagramIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  {
    name: "Instagram",
    handle: "@burgshake.in",
    desc: "Daily specials, behind-the-grill clips, and new menu drops.",
    href: "https://instagram.com",
    Icon: InstagramIcon,
    accent: "from-pink-500 via-rose-500 to-orange-500",
  },
  {
    name: "Facebook",
    handle: "/burgshake",
    desc: "Updates, community events, and long-form reviews.",
    href: "https://facebook.com",
    Icon: FacebookIcon,
    accent: "from-blue-500 to-blue-600",
  },
  {
    name: "Twitter / X",
    handle: "@burgshake",
    desc: "Quick updates, sold-out alerts, and the occasional joke.",
    href: "https://twitter.com",
    Icon: TwitterIcon,
    accent: "from-neutral-800 to-neutral-950",
  },
];

export default function ContactSocials() {
  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-10 sm:py-12">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.10)_0%,_transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
            <span className="h-px w-6 bg-brand-500" />
            Follow Along
            <span className="h-px w-6 bg-brand-500" />
          </div> */}
          <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
            More of us,{" "}
            <span className="font-serif italic font-normal text-brand-500">
              in your feed.
            </span>
          </h2>
          {/* <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.7] text-neutral-500">
            New drops, hidden specials, and behind-the-counter moments — all
            live on our socials.
          </p> */}
        </div>

        {/* Social cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOCIALS.map(({ name, handle, desc, href, Icon, accent }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-neutral-200/70 bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-[0_30px_60px_-25px_rgba(249,115,22,0.35)] sm:p-7"
            >
              {/* Icon chip with accent gradient */}
              <div
                className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105`}
              >
                <Icon className="h-5 w-5" />
              </div>

              {/* Name + handle */}
              <div className="mt-5 flex items-baseline gap-2">
                <h3 className="font-display text-[15.5px] font-bold tracking-[-0.01em] text-neutral-950">
                  {name}
                </h3>
                <span className="text-[11.5px] font-medium text-neutral-400">
                  {handle}
                </span>
              </div>

              {/* Desc */}
              <p className="mt-2.5 text-[12.5px] leading-[1.65] text-neutral-500">
                {desc}
              </p>

              {/* CTA row */}
              <div className="mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 transition-colors duration-300 group-hover:text-brand-600">
                Follow
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              {/* Bottom accent line */}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out group-hover:w-full" />
            </a>
          ))}
        </div>

       
      </div>
    </section>
  );
}