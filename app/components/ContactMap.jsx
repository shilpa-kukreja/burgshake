"use client";

import { MapPin, Navigation } from "lucide-react";

export default function ContactMap() {
  /* Google Maps embed — replace the q= param with your actual address */
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.87687409579!2d77.38179147601475!3d28.573459786760473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef66d4408353%3A0x97b724058c2d9450!2sPhase%202%2C%20Gardenia%20Gateway%2C%20Sector%2075%2C%20Noida%2C%20Uttar%20Pradesh%20201316!5e0!3m2!1sen!2sin!4v1794995050201!5m2!1sen!2sin";
  const directionsUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.87687409579!2d77.38179147601475!3d28.573459786760473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef66d4408353%3A0x97b724058c2d9450!2sPhase%202%2C%20Gardenia%20Gateway%2C%20Sector%2075%2C%20Noida%2C%20Uttar%20Pradesh%20201316!5e0!3m2!1sen!2sin!4v1794995050201!5m2!1sen!2sin";

  return (
    <section className="relative overflow-hidden bg-[#FFF6EC] py-8 sm:py-10">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-5 border-b border-neutral-300/40 pb-6 sm:flex-row sm:items-end">
          <div>
            {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Find Us
            </div> */}
            <h2 className="mt-3 font-display text-[1.6rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[1.85rem]">
              Right in the heart of{" "}
              <span className="font-serif italic font-normal text-brand-500">
                Bandra West.
              </span>
            </h2>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-[12.5px] font-bold text-white shadow-[0_10px_28px_-12px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
          >
            <Navigation className="h-3.5 w-3.5" />
            Get Directions
          </a>
        </div>

        {/* Map card */}
        <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_30px_70px_-30px_rgba(249,115,22,0.3)]">
          {/* Map header strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/70 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 ring-1 ring-brand-100">
                <MapPin className="h-4 w-4 text-brand-600" />
              </span>
              <div className="leading-tight">
                <div className="font-display text-[13.5px] font-bold tracking-[-0.01em] text-neutral-950">
                  Burgshake · Bandra West
                </div>
                <div className="mt-0.5 text-[11.5px] text-neutral-500">
                  12 Linking Road, Mumbai 400050
                </div>
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 ring-1 ring-emerald-200">
              Open · 11 AM – 11 PM
            </span>
          </div>

          {/* Map iframe */}
          <div className="relative aspect-[16/9] w-full bg-neutral-100">
            <iframe
              src={mapSrc}
              title="Burgshake location"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}