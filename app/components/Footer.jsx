"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { api } from "../lib/api";

/* ─── Social icons ──────────────────────────────────── */
function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

/* ─── Store hours ──────────────────────────────────── */
const OPEN_HOUR = 11; // 11:00 AM
const CLOSE_HOUR = 23; // 11:00 PM

/* Return { isOpen, label } for the current time */
function getOpenStatus() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;

  if (h >= OPEN_HOUR && h < CLOSE_HOUR) {
    const minsLeft = Math.round((CLOSE_HOUR - h) * 60);
    const label =
      minsLeft < 60
        ? `Closes in ${minsLeft} min`
        : `Closes at 11 PM`;
    return { isOpen: true, label };
  }

  /* Closed. Show when it opens next. */
  if (h < OPEN_HOUR) {
    const mins = Math.round((OPEN_HOUR - h) * 60);
    const label =
      mins <= 60 ? `Opens in ${mins} min` : "Opens at 11 AM";
    return { isOpen: false, label };
  }

  /* After midnight, opens tomorrow */
  return { isOpen: false, label: "Opens tomorrow at 11 AM" };
}

/* ─── Static groups ────────────────────────────────── */
const SOCIALS = [
  { Icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { Icon: FacebookIcon, href: "https://facebook.com", label: "Facebook" },
  { Icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
];

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "My Account", href: "/account" },
];

const SUPPORT_LINKS = [
  { label: "My Orders", href: "/account" },
  { label: "Sign In", href: "/login" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  // { label: "Admin", href: "/admin/login" },
];

/* ─── Component ────────────────────────────────────── */
export default function Footer() {
  const [status, setStatus] = useState(() => getOpenStatus());
  const [categories, setCategories] = useState([]);

  /* Refresh open/closed badge every minute */
  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  /* Fetch live menu categories once */
  useEffect(() => {
    let live = true;
    api
      .getCategories()
      .then((res) => {
        if (!live) return;
        const raw = res.data?.categories || res.data || [];
        const list = raw
          .filter((c) => c.isActive !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .slice(0, 5)
          .map((c) => ({ label: c.name, href: `/menu?category=${c.slug}` }));
        setCategories(list);
      })
      .catch(() => {
        /* Silent — the menu group just won't render if this fails */
        if (live) setCategories([]);
      });
    return () => {
      live = false;
    };
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-[#FFF6EC]">
      {/* ── Main footer ─────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 pt-10 lg:px-10 lg:pt-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Brand column ────────────────────────── */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/25">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M4 8h16" />
                  <path d="M4 12h16" />
                  <path d="M4 16h16" />
                  <path d="M8 4h8" />
                </svg>
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight">
                <span className="text-neutral-950">Burg</span>
                <span className="text-brand-500">shake</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-[14px] leading-[1.7] text-neutral-500">
              Handcrafted burgers and velvety thick shakes — made fresh to
              order, served warm in a café built for slow bites.
            </p>

            {/* Live open/closed badge */}
            <div
              className={`mt-6 inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-colors ${
                status.isOpen
                  ? "border border-emerald-300 bg-emerald-500"
                  : "border border-neutral-300 bg-neutral-500"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                {status.isOpen && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75" />
                )}
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">
                {status.isOpen ? "Open" : "Closed"} · {status.label}
              </span>
            </div>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-500 hover:text-white hover:shadow-[0_8px_20px_-8px_rgba(249,115,22,0.5)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Explore ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Explore
            </h4>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-700 transition-colors duration-300 hover:text-brand-600"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Menu (live categories) ──────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Menu
            </h4>
            <ul className="mt-5 space-y-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.href}>
                    <Link
                      href={cat.href}
                      className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium capitalize text-neutral-700 transition-colors duration-300 hover:text-brand-600"
                    >
                      {cat.label}
                      <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))
              ) : (
                /* Fallback while loading or if the fetch failed */
                <>
                  <li>
                    <Link
                      href="/menu"
                      className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-700 transition-colors duration-300 hover:text-brand-600"
                    >
                      Full Menu
                      <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* ── Support ─────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Support
            </h4>
            <ul className="mt-5 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-700 transition-colors duration-300 hover:text-brand-600"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Visit ───────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4 className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              Visit Us
            </h4>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                <span className="text-[13px] leading-[1.55] text-neutral-600">
                  12 Linking Road,
                  <br />
                  Bandra West, Mumbai
                </span>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2.5 text-[13px] font-medium text-neutral-700 transition-colors hover:text-brand-600"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@burgshake.com"
                  className="flex items-center gap-2.5 text-[13px] font-medium text-neutral-700 transition-colors hover:text-brand-600"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                  hello@burgshake.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
                <span className="text-[13px] leading-[1.55] text-neutral-600">
                  Every day
                  <br />
                  11:00 AM – 11:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────── */}
      <div className="relative mx-auto mt-8 max-w-7xl border-t border-neutral-200/70 px-6 py-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[12px] font-medium text-neutral-500">
            © {new Date().getFullYear()} Burgshake. Crafted with care in Mumbai.
          </p>

          <div className="flex items-center gap-5 text-[12px] font-medium text-neutral-500">
            <Link
              href="/terms"
              className="transition-colors hover:text-brand-600"
            >
              Terms
            </Link>
            <span className="h-3 w-px bg-neutral-300" />
            <Link
              href="/privacy"
              className="transition-colors hover:text-brand-600"
            >
              Privacy
            </Link>
            <span className="h-3 w-px bg-neutral-300" />
            <Link
              href="/contact"
              className="transition-colors hover:text-brand-600"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}