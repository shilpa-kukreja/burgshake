"use client";

import { useState, useEffect } from "react";
import { Phone, X } from "lucide-react";

/* ─── WhatsApp inline SVG (lucide removed brand icons) ── */
function WhatsAppIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const WHATSAPP_NUMBER = "919876543210"; // country code + number, no +
const CALL_NUMBER = "+919876543210";
const WHATSAPP_MESSAGE = "Hi Burgshake! I'd like to place an order.";

export default function FloatingContact() {
  const [mounted, setMounted] = useState(false);
  const [showLabel, setShowLabel] = useState(null);

  /* Delay reveal so it slides in after page load */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, []);

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <>
      {/* ── Fixed dock (bottom-right) ─────────────────── */}
      <div
        className={`fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 transition-all duration-500 sm:bottom-6 sm:right-6 ${
          mounted
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0 pointer-events-none"
        }`}
      >
        {/* ── WhatsApp button ───────────────────────── */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowLabel("whatsapp")}
          onMouseLeave={() => setShowLabel(null)}
        >
          {/* Tooltip label */}
          <span
            className={`mr-3 hidden whitespace-nowrap rounded-full bg-neutral-950 px-3.5 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 sm:block ${
              showLabel === "whatsapp"
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0 pointer-events-none"
            }`}
          >
            Chat on WhatsApp
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-neutral-950" />
          </span>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="group relative grid h-13 w-13 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_-10px_rgba(37,211,102,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(37,211,102,0.9)] sm:h-14 sm:w-14"
            style={{ width: "52px", height: "52px" }}
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-[ping-slow_2.4s_ease-in-out_infinite]" />

            <WhatsAppIcon className="relative h-6 w-6 sm:h-7 sm:w-7" />
          </a>
        </div>

        {/* ── Call button ───────────────────────────── */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowLabel("call")}
          onMouseLeave={() => setShowLabel(null)}
        >
          {/* Tooltip label */}
          <span
            className={`mr-3 hidden whitespace-nowrap rounded-full bg-neutral-950 px-3.5 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 sm:block ${
              showLabel === "call"
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0 pointer-events-none"
            }`}
          >
            Call us now
            <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rotate-45 bg-neutral-950" />
          </span>

          <a
            href={`tel:${CALL_NUMBER}`}
            aria-label="Call Burgshake"
            className="group relative grid place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_12px_28px_-10px_rgba(249,115,22,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(249,115,22,1)]"
            style={{ width: "52px", height: "52px" }}
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </>
  );
}