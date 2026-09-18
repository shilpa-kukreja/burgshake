"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ShoppingBag,
  MapPin,
  Phone,
  ChevronRight,
  Sandwich,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";  // add to existing lucide import
import { useWishlist } from "../context/WishlistContext";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openWishlist, count: wishlistCount } = useWishlist();
  const { openCart, count: cartCount } = useCart();
  const { user, hydrated } = useAuth();

  /* Scroll listener → shrink header */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid
        ? "bg-white/85 shadow-[0_6px_30px_-12px_rgba(249,115,22,0.35)] backdrop-blur-xl"
        : "bg-white shadow-sm backdrop-blur-none"
        }`}
    >
      {/* ── Announcement strip ───────────────────────────── */}
      <div
        className={`overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 text-white transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-wide sm:text-xs">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>Takeaway Only · Freshly Made · Ready in 15 mins</span>
        </div>
      </div>

      {/* ── Main bar ─────────────────────────────────────── */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Sandwich className="h-5 w-5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="text-neutral-900">Burg</span>
            <span className="text-brand-500">shake</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-lg px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-600"
            >
              {link.label}
              <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-brand-500 transition-all duration-300 group-hover:w-1/2" />
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Phone (XL only) */}
          <a
            href="tel:+919876543210"
            className="hidden items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 xl:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            +91 98765 43210
          </a>

          {/* Wishlist */}
          <button
            type="button"
            onClick={openWishlist}
            aria-label="Open wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </button>

          {/* Account / Login */}
          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "My account" : "Sign in"}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            {user && hydrated ? (
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[11px] font-extrabold text-white">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* CTA */}
          <Link
            href="/menu"
            className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/40 sm:flex"
          >
            Order Now
            <ChevronRight className="h-4 w-4" />
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition hover:border-brand-300 hover:text-brand-600 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ────────────────────────────────── */}
      <div
        className={`overflow-hidden border-t border-neutral-100 bg-white transition-all duration-300 lg:hidden ${open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="space-y-1 px-4 pb-6 pt-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-neutral-800 transition hover:bg-brand-50 hover:text-brand-600"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 text-neutral-400" />
            </Link>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-4">
            <a
              href="tel:+919876543210"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:border-brand-300 hover:text-brand-600"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}