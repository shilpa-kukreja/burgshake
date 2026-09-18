"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Check,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

const TOPICS = [
  "General inquiry",
  "Order feedback",
  "Bulk / catering",
  "Partnership",
  "Careers",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "General inquiry",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      err.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Please enter a valid email.";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      err.phone = "Enter a valid 10-digit phone number.";
    if (!form.message.trim() || form.message.trim().length < 10)
      err.message = "Please write at least 10 characters.";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    setSending(true);

    /* Simulate send — replace with backend/email API later */
    await new Promise((r) => setTimeout(r, 1200));

    setSending(false);
    setSent(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      topic: "General inquiry",
      message: "",
    });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] py-10 sm:py-12">
      {/* Background */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 top-1/3 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ═══ LEFT: Info cards ═══════════════════════ */}
          <div className="lg:col-span-5">
            {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              <span className="h-px w-8 bg-brand-500" />
              Reach Out
            </div> */}

            <h2 className="mt-4 font-display text-[1.85rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.15rem]">
              We&apos;d love to{" "}
              <span className="font-serif italic font-normal text-brand-500">
                hear from you.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-[14px] leading-[1.75] text-neutral-500">
              Drop by the counter, give us a ring, or use the form. We usually
              reply within a few hours during business hours.
            </p>

            {/* Info tiles */}
            <div className="mt-8 space-y-3.5">
              {/* Address */}
              <div className="group flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 hover:border-brand-100 hover:shadow-[0_16px_36px_-20px_rgba(249,115,22,0.3)]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500">
                  <MapPin className="h-4.5 w-4.5 text-brand-600 transition-colors duration-300 group-hover:text-white" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Visit Us
                  </div>
                  <div className="mt-1 font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                    12 Linking Road
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.55] text-neutral-500">
                    Bandra West, Mumbai 400050
                  </div>
                </div>
              </div>

              {/* Phone */}
              <a
                href="tel:+919876543210"
                className="group flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 hover:border-brand-100 hover:shadow-[0_16px_36px_-20px_rgba(249,115,22,0.3)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500">
                  <Phone className="h-4.5 w-4.5 text-brand-600 transition-colors duration-300 group-hover:text-white" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Call Us
                  </div>
                  <div className="mt-1 font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                    +91 98765 43210
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.55] text-neutral-500">
                    Mon–Sun · 11 AM – 11 PM
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@burgshake.com"
                className="group flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 hover:border-brand-100 hover:shadow-[0_16px_36px_-20px_rgba(249,115,22,0.3)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500">
                  <Mail className="h-4.5 w-4.5 text-brand-600 transition-colors duration-300 group-hover:text-white" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Email Us
                  </div>
                  <div className="mt-1 font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                    hello@burgshake.com
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.55] text-neutral-500">
                    Replies within a few hours
                  </div>
                </div>
              </a>

              {/* Hours */}
              <div className="group flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-300 hover:border-brand-100 hover:shadow-[0_16px_36px_-20px_rgba(249,115,22,0.3)]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:ring-brand-500">
                  <Clock className="h-4.5 w-4.5 text-brand-600 transition-colors duration-300 group-hover:text-white" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Kitchen Hours
                  </div>
                  <div className="mt-1 font-display text-[15px] font-bold leading-snug tracking-[-0.01em] text-neutral-950">
                    Every day · 11 AM – 11 PM
                  </div>
                  <div className="mt-0.5 text-[12.5px] leading-[1.55] text-neutral-500">
                    Last order at 10:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT: Form ════════════════════════════ */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white ">
              {/* Form header */}
              <div className="relative border-b border-neutral-200/70  px-6 py-6 sm:px-8 sm:py-7">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgb(249 115 22 / 0.15) 1px, transparent 0)",
                    backgroundSize: "26px 26px",
                  }}
                />
                <div className="relative">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-600">
                    Send a Message
                  </div>
                  <h3 className="mt-2 font-display text-[20px] font-bold leading-tight tracking-[-0.015em] text-neutral-950 sm:text-[22px]">
                    Fill in the form — we&apos;ll take it from there.
                  </h3>
                </div>
              </div>

              {/* Form body */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-6 py-7 sm:px-8 sm:py-8"
              >
                {/* Success state */}
                {sent && (
                  <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <div className="leading-tight">
                      <div className="text-[13px] font-bold text-emerald-800">
                        Message sent!
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-emerald-700">
                        We&apos;ll get back to you within a few hours.
                      </div>
                    </div>
                  </div>
                )}

                {/* Name + Email row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    icon={User}
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    placeholder="Aarav Mehta"
                    error={errors.name}
                    required
                  />
                  <Field
                    icon={Mail}
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@email.com"
                    error={errors.email}
                    required
                  />
                </div>

                {/* Phone + Topic row */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    icon={Phone}
                    label="Phone Number"
                    type="tel"
                    value={form.phone}
                    onChange={(v) =>
                      update("phone", v.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="98765 43210"
                    error={errors.phone}
                    prefix="+91"
                  />

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Topic
                    </label>
                    <div className="relative mt-2">
                      <select
                        value={form.topic}
                        onChange={(e) => update("topic", e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white py-3.5 pl-4 pr-10 text-[13.5px] font-semibold text-neutral-900 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      >
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                    Your Message <span className="text-brand-500">*</span>
                  </label>
                  <div className="relative mt-2">
                    <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-neutral-400" />
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        update("message", e.target.value.slice(0, 500))
                      }
                      placeholder="Tell us what's on your mind…"
                      className={`w-full resize-none rounded-2xl border bg-white py-3.5 pl-11 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:ring-4 ${
                        errors.message
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
                      }`}
                    />
                    <span className="absolute bottom-3 right-4 text-[10px] font-semibold tabular-nums text-neutral-400">
                      {form.message.length}/500
                    </span>
                  </div>
                  {errors.message && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.message}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] font-medium text-neutral-400">
                    We&apos;ll never share your info. Ever.
                  </p>

                  <button
                    type="submit"
                    disabled={sending}
                    className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[13px] font-bold text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                      sent
                        ? "bg-emerald-500"
                        : "bg-neutral-950 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {sending ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending…
                      </>
                    ) : sent ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={3} />
                        Sent
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Reusable input field ────────────────────────────── */
function Field({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  prefix,
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        {label}
        {required && <span className="ml-0.5 text-brand-500">*</span>}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

        {prefix && (
          <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[13.5px] font-semibold text-neutral-500">
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-2xl border bg-white py-3.5 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:ring-4 ${
            prefix ? "pl-[68px]" : "pl-11"
          } ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
          }`}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-[11.5px] font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}