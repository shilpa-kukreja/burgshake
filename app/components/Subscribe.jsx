"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 2200);
  };

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      {/* Warm glow */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.12)_0%,_transparent_65%)]" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FDFCFB] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FDFCFB] to-transparent" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative flex flex-col items-start justify-between gap-6 rounded-2xl border border-neutral-200/70 bg-white/80 p-6 shadow-[0_1px_2px_rgba(23,23,23,0.03),0_20px_50px_-30px_rgba(249,115,22,0.35)] backdrop-blur-sm sm:p-7 lg:flex-row lg:items-center lg:gap-10">

          {/* ── LEFT: Copy ─────────────────────────── */}
          <div className="flex-1">
            {/* Small eyebrow */}
            <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-6 bg-brand-500" />
              The Burgshake Letter
            </div>

            {/* Headline — small and punchy */}
            <h3 className="mt-2.5 font-display text-[19px] font-bold leading-[1.25] tracking-[-0.015em] text-neutral-950 sm:text-[21px]">
              Get new flavours first —{" "}
              <span className="font-serif italic font-normal text-brand-500">
                straight to your inbox.
              </span>
            </h3>

            <p className="mt-2 text-[13px] leading-[1.6] text-neutral-500">
              Seasonal drops, secret offers, and behind-the-grill stories.
              No spam, ever.
            </p>
          </div>

          {/* ── RIGHT: Compact form ────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="w-full shrink-0 sm:w-auto lg:w-[380px]"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Input */}
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-10 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                aria-label="Subscribe"
                className={`group inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full px-5 py-3 text-[13px] font-bold shadow-[0_10px_26px_-12px_rgba(249,115,22,0.6)] transition-all duration-300 ${
                  submitted
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-950 text-white hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_32px_-12px_rgba(249,115,22,0.75)]"
                }`}
              >
                {submitted ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    Subscribed
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>

            {/* Tiny privacy note */}
            <p className="mt-2.5 pl-1 text-[10.5px] text-neutral-400">
              By subscribing you agree to our{" "}
              <a
                href="/privacy"
                className="font-semibold text-neutral-600 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-brand-600"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}