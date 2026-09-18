"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  Star,
  Flame,
  Leaf,
  WheatOff,
  Check,
  Heart,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Clock,
  MapPin,
  Shield,
  ArrowLeft,
  Share2,
  Link2,
  Users,
  Info,
  AlertTriangle,
} from "lucide-react";
import { DIETARY_META } from "../data/menuItems";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ICONS = {
  veg: Leaf,
  "gluten-free": WheatOff,
  spicy: Flame,
};

/* ─── Customization options ──────────────────────────── */
const BUN_OPTIONS = [
  { id: "brioche", label: "Brioche", price: 0 },
  { id: "sesame", label: "Sesame", price: 0 },
  { id: "multigrain", label: "Multigrain", price: 20 },
  { id: "lettuce-wrap", label: "Lettuce Wrap", price: 30 },
];

const PATTY_OPTIONS = [
  { id: "beef", label: "Classic Beef", price: 0 },
  { id: "double", label: "Double Patty", price: 60 },
  { id: "chicken", label: "Grilled Chicken", price: 40 },
  { id: "paneer", label: "Crispy Paneer", price: 20 },
];

const EXTRAS = [
  { id: "cheese", label: "Extra Cheese", price: 30 },
  { id: "bacon", label: "Maple Bacon", price: 60 },
  { id: "jalapeno", label: "Jalapeños", price: 20 },
  { id: "onion", label: "Onion Rings", price: 25 },
];

/* ─── Social icons (inline SVG) ──────────────────────── */
function WhatsAppIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12a10 10 0 10-11.563 9.875v-6.988H7.898V12h2.539V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.887h-2.33v6.988A10.001 10.001 0 0022 12z" />
    </svg>
  );
}

function TwitterIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ─── Default fallbacks ──────────────────────────────── */
const DEFAULT_INGREDIENTS = [
  "Fresh, locally-sourced ingredients",
  "Made to order",
  "No preservatives or artificial colours",
];

const DEFAULT_ALLERGENS = ["Gluten", "Dairy"];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function ProductDetail({ item }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [bun, setBun] = useState("brioche");
  const [patty, setPatty] = useState("beef");
  const [extras, setExtras] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const shareRef = useRef(null);
  const galleryRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const mouseDeltaX = useRef(0);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(item.slug);

  const isBurger = item.category === "burgers";

  /* ── Gallery: array or fallback ────────────────────── */
  const gallery = useMemo(() => {
    if (Array.isArray(item.gallery) && item.gallery.length > 0) {
      return item.gallery;
    }
    return [
      item.img,
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    ];
  }, [item]);

  const goToImage = useCallback(
    (i) => {
      setActiveImg(((i % gallery.length) + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  const nextImage = useCallback(() => {
    setActiveImg((prev) => (prev + 1) % gallery.length);
  }, [gallery.length]);

  const prevImage = useCallback(() => {
    setActiveImg((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  /* ── Keyboard arrows ──────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextImage, prevImage]);

  /* ── Outside-click closes share dropdown ──────────── */
  useEffect(() => {
    const onClick = (e) => {
      if (shareRef.current && !shareRef.current.contains(e.target)) {
        setShareOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* ── Touch swipe handlers ─────────────────────────── */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) nextImage();
      else prevImage();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  /* ── Mouse drag handlers ──────────────────────────── */
  const onMouseDown = (e) => {
    setIsDragging(true);
    mouseStartX.current = e.clientX;
    mouseDeltaX.current = 0;
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    mouseDeltaX.current = e.clientX - mouseStartX.current;
  };
  const onMouseUp = () => {
    if (!isDragging) return;
    if (Math.abs(mouseDeltaX.current) > 60) {
      if (mouseDeltaX.current < 0) nextImage();
      else prevImage();
    }
    setIsDragging(false);
    mouseStartX.current = 0;
    mouseDeltaX.current = 0;
  };
  const onMouseLeave = () => {
    if (isDragging) setIsDragging(false);
  };

  /* ── Price computation ────────────────────────────── */
  const bunExtra = BUN_OPTIONS.find((b) => b.id === bun)?.price || 0;
  const pattyExtra = PATTY_OPTIONS.find((p) => p.id === patty)?.price || 0;
  const extrasTotal = extras.reduce((sum, id) => {
    const e = EXTRAS.find((x) => x.id === id);
    return sum + (e?.price || 0);
  }, 0);

  const unitPrice = item.price + bunExtra + pattyExtra + extrasTotal;
  const lineTotal = unitPrice * qty;

  const toggleExtra = (id) => {
    setExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ── Add to cart ──────────────────────────────────── */
  const handleAdd = () => {
    addItem(
      {
        ...item,
        price: unitPrice,
        img: gallery[0],
        customizations: isBurger
          ? {
              bun: BUN_OPTIONS.find((b) => b.id === bun)?.label,
              patty: PATTY_OPTIONS.find((p) => p.id === patty)?.label,
              extras: extras.map(
                (id) => EXTRAS.find((x) => x.id === id)?.label
              ),
            }
          : null,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  /* ── Share: ALWAYS open dropdown (reliable) ───────── */
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out ${item.name} at Burgshake — ${item.desc}`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${shareText} — ${shareUrl}`
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Fallback */
      const el = document.createElement("textarea");
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  /* ── Data fallbacks ───────────────────────────────── */
  const ingredients = item.ingredients || DEFAULT_INGREDIENTS;
  const allergens = item.allergens || DEFAULT_ALLERGENS;
  const nutrition = item.nutrition || {
    calories: item.calories || 520,
    protein: "—",
    carbs: "—",
    fat: "—",
    sodium: "—",
  };

  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      {/* Background glows */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.14)_0%,_transparent_65%)]" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-20">
        {/* ── Breadcrumb + Share ─────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-400"
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-brand-600"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Menu
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="capitalize">{item.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-neutral-700">{item.name}</span>
          </nav>

          {/* Share dropdown */}
          <div ref={shareRef} className="relative">
            <button
              onClick={() => setShareOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={shareOpen}
              className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                shareOpen
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>

            {shareOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_20px_50px_-15px_rgba(23,23,23,0.25)]"
              >
                <div className="p-1.5">
                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => setShareOpen(false)}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                    </span>
                    WhatsApp
                  </a>

                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setShareOpen(false)}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-100 text-blue-600">
                      <FacebookIcon className="h-3.5 w-3.5" />
                    </span>
                    Facebook
                  </a>

                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                    onClick={() => setShareOpen(false)}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-neutral-900 text-white">
                      <TwitterIcon className="h-3.5 w-3.5" />
                    </span>
                    Twitter / X
                  </a>

                  <div className="my-1 h-px bg-neutral-100" />

                  <button
                    onClick={copyLink}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-medium text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-100 text-brand-600">
                      {copied ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" />
                      )}
                    </span>
                    {copied ? "Link copied!" : "Copy link"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Main content ──────────────────────────── */}
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ═══ LEFT: Swipeable Gallery ══════════════ */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-24">
              {/* Main image — swipeable */}
              <div
                ref={galleryRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                className={`group relative aspect-square select-none overflow-hidden rounded-3xl bg-neutral-100 shadow-[0_30px_70px_-25px_rgba(249,115,22,0.35)] ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {/* Stacked images with cross-fade */}
                {gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${item.name} — view ${i + 1}`}
                    draggable={false}
                    className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                      i === activeImg ? "opacity-100" : "opacity-0"
                    }`}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                ))}

                {/* Hover hint overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/0 via-transparent to-neutral-950/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/40 to-transparent" />
                </div>

                {/* Tag chip */}
                {/* {item.tag && (
                  <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-neutral-950/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                    {item.tag}
                  </span>
                )} */}

                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item);
                  }}
                  aria-label={
                    wishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  aria-pressed={wishlisted}
                  className={`absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
                    wishlisted
                      ? "bg-brand-500 text-white shadow-[0_10px_26px_-10px_rgba(249,115,22,0.8)]"
                      : "bg-white/95 text-neutral-700 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] hover:bg-brand-50 hover:text-brand-600"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 transition-transform duration-300 ${
                      wishlisted ? "fill-white scale-110" : ""
                    }`}
                    strokeWidth={2.2}
                  />
                </button>

                {/* Prev / Next arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-neutral-800 opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:bg-brand-500 hover:text-white group-hover:opacity-100"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-neutral-800 opacity-0 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:bg-brand-500 hover:text-white group-hover:opacity-100"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {gallery.length > 1 && (
                  <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-neutral-950/50 px-2.5 py-1.5 backdrop-blur-md">
                    {gallery.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeImg
                            ? "w-5 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Counter chip */}
                <span className="pointer-events-none absolute bottom-5 right-5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-800 backdrop-blur-sm">
                  {activeImg + 1} / {gallery.length}
                </span>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => goToImage(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={activeImg === i}
                      className={`group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 transition-all duration-300 ${
                        activeImg === i
                          ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-[#FDFCFB]"
                          : "ring-1 ring-neutral-200/70 hover:ring-brand-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08] ${
                          activeImg === i ? "" : "opacity-70 group-hover:opacity-100"
                        }`}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Swipe hint */}
              {/* {gallery.length > 1 && (
                <p className="mt-3 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Swipe · Drag · Arrow keys
                </p>
              )} */}

              {/* Trust row */}
              {/* <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-3 text-center">
                  <Clock className="h-4 w-4 text-brand-600" />
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {item.prepTime || "Ready in 15m"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-3 text-center">
                  <Users className="h-4 w-4 text-brand-600" />
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    {item.serves || "Serves 1"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-3 text-center">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Takeaway only
                  </span>
                </div>
              </div> */}
            </div>
          </div>

          {/* ═══ RIGHT: Details ════════════════════════ */}
          <div className="lg:col-span-6">
            {/* Dietary tags */}
            {/* <div className="flex flex-wrap gap-2">
              {item.dietary.map((d) => {
                const meta = DIETARY_META[d];
                const Icon = ICONS[d];
                return (
                  <span
                    key={d}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.color}`}
                  >
                    <Icon className="h-3 w-3" />
                    {meta.label}
                  </span>
                );
              })}
            </div> */}

            {/* Name */}
            <h1 className="mt-4 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.4rem] lg:text-[2.6rem]">
              {item.name}
            </h1>

            {/* Rating row */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(item.rating)
                        ? "fill-brand-500 text-brand-500"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[12.5px] font-bold text-neutral-800">
                {item.rating}
              </span>
              <span className="h-3 w-px bg-neutral-300" />
              <span className="text-[12px] font-medium text-neutral-500">
                {item.reviews} reviews
              </span>
              <span className="h-3 w-px bg-neutral-300" />
              {/* <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                In stock
              </span> */}
            </div>

            {/* Short desc */}
            <p className="mt-5 max-w-xl text-[14.5px] leading-[1.75] text-neutral-600">
              {item.desc}
            </p>

            {/* Divider */}
            <div className="mt-7 h-px w-full bg-neutral-200/80" />

            {/* ── Customization (only burgers) ──────── */}
            {isBurger && (
              <div className="mt-7 space-y-6">
                {/* Bun */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Choose your bun
                    </h3>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                      Required
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {BUN_OPTIONS.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setBun(b.id)}
                        className={`group relative flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                          bun === b.id
                            ? "border-brand-500 bg-brand-50/60 shadow-[0_8px_20px_-10px_rgba(249,115,22,0.5)]"
                            : "border-neutral-200 bg-white hover:border-brand-200"
                        }`}
                      >
                        <span
                          className={`text-[12.5px] font-bold ${
                            bun === b.id
                              ? "text-brand-700"
                              : "text-neutral-800"
                          }`}
                        >
                          {b.label}
                        </span>
                        <span className="text-[10.5px] font-medium text-neutral-500">
                          {b.price === 0 ? "Free" : `+₹${b.price}`}
                        </span>
                        {bun === b.id && (
                          <Check
                            className="absolute right-2 top-2 h-3 w-3 text-brand-600"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patty */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Choose your patty
                    </h3>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-600">
                      Required
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {PATTY_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPatty(p.id)}
                        className={`group relative flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                          patty === p.id
                            ? "border-brand-500 bg-brand-50/60 shadow-[0_8px_20px_-10px_rgba(249,115,22,0.5)]"
                            : "border-neutral-200 bg-white hover:border-brand-200"
                        }`}
                      >
                        <span
                          className={`text-[12.5px] font-bold ${
                            patty === p.id
                              ? "text-brand-700"
                              : "text-neutral-800"
                          }`}
                        >
                          {p.label}
                        </span>
                        <span className="text-[10.5px] font-medium text-neutral-500">
                          {p.price === 0 ? "Included" : `+₹${p.price}`}
                        </span>
                        {patty === p.id && (
                          <Check
                            className="absolute right-2 top-2 h-3 w-3 text-brand-600"
                            strokeWidth={3}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Add extras
                    </h3>
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Optional
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {EXTRAS.map((e) => {
                      const active = extras.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          onClick={() => toggleExtra(e.id)}
                          className={`group relative flex flex-col items-start gap-0.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                            active
                              ? "border-brand-500 bg-brand-50/60 shadow-[0_8px_20px_-10px_rgba(249,115,22,0.5)]"
                              : "border-neutral-200 bg-white hover:border-brand-200"
                          }`}
                        >
                          <span
                            className={`text-[12.5px] font-bold ${
                              active ? "text-brand-700" : "text-neutral-800"
                            }`}
                          >
                            {e.label}
                          </span>
                          <span className="text-[10.5px] font-medium text-neutral-500">
                            +₹{e.price}
                          </span>
                          {active && (
                            <Check
                              className="absolute right-2 top-2 h-3 w-3 text-brand-600"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Price + Qty + Add ─────────────────── */}
            <div className="mt-8 rounded-2xl border border-neutral-200/70 bg-white/70 p-5 backdrop-blur-sm sm:p-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Your Price
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-display text-[1.75rem] font-extrabold leading-none text-neutral-950">
                      ₹{lineTotal}
                    </span>
                    {item.mrp && unitPrice === item.price && (
                      <span className="text-[14px] font-medium text-neutral-400 line-through">
                        ₹{item.mrp * qty}
                      </span>
                    )}
                  </div>
                  {(bunExtra > 0 || pattyExtra > 0 || extrasTotal > 0) && (
                    <div className="mt-1 text-[11px] font-medium text-neutral-500">
                      Base ₹{item.price} + Add-ons ₹
                      {bunExtra + pattyExtra + extrasTotal}
                      {qty > 1 && ` × ${qty}`}
                    </div>
                  )}
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-neutral-600"
                  >
                    <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                  <span className="min-w-[24px] text-center font-display text-[15px] font-bold tabular-nums text-neutral-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className={`group mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[13.5px] font-bold text-white shadow-[0_14px_36px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 ${
                  added
                    ? "bg-emerald-500"
                    : "bg-neutral-950 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_18px_44px_-12px_rgba(249,115,22,0.75)]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add {qty} to cart · ₹{lineTotal}
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10.5px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                Secure checkout · Razorpay
              </p>
            </div>

            {/* Small info strip */}
            {/* <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-500" />
                Made fresh to order
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-brand-500" />
                No preservatives
              </span>
            </div> */}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            BOTTOM INFO SECTION (replaces tabs)
            ═══════════════════════════════════════════════ */}
        <div className="mt-16 sm:mt-20">
          {/* Section header */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-neutral-200/70 pb-6 sm:flex-row sm:items-end">
            <div>
              {/* <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                <span className="h-px w-8 bg-brand-500" />
                The Details
              </div> */}
              <h2 className="mt-3 font-display text-[1.6rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[1.9rem]">
                Everything about{" "}
                <span className="font-serif italic font-normal text-brand-500">
                  this dish.
                </span>
              </h2>
            </div>
          </div>

          {/* Content grid */}
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* ══ LEFT: Description + Ingredients ══ */}
            <div className="lg:col-span-7 space-y-10">
              {/* Description */}
              <div>
                <h3 className="font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                  Description
                </h3>
                <p className="mt-3 text-[14px] leading-[1.8] text-neutral-600">
                  {item.desc} Each plate is prepared fresh when you order —
                  never reheated, never pre-made. Perfect for a quick takeaway
                  lunch or a slow weekend treat.
                </p>

                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {[
                    "Handcrafted in small batches",
                    "Fresh buns baked daily",
                    "100% real cheese — no fillers",
                    "Locally sourced where possible",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[13px] text-neutral-600"
                    >
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                  Ingredients
                </h3>
                <p className="mt-2 text-[12.5px] text-neutral-500">
                  What goes into every bite.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2.5 rounded-xl border border-neutral-200/70 bg-white px-3.5 py-2.5 text-[13px] text-neutral-700 transition-colors duration-300 hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ══ RIGHT: Nutrition + Allergens ══ */}
            <div className="lg:col-span-5 space-y-6">
              {/* Nutrition */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-200/70 bg-neutral-50/60 px-5 py-4">
                  <h3 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
                    Nutrition
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Per serving
                  </span>
                </div>
                <div className="grid grid-cols-5 divide-x divide-neutral-200/70">
                  {[
                    { label: "Cal", value: nutrition.calories },
                    { label: "Protein", value: nutrition.protein },
                    { label: "Carbs", value: nutrition.carbs },
                    { label: "Fat", value: nutrition.fat },
                    { label: "Sodium", value: nutrition.sodium },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col items-center gap-1 px-2 py-4 text-center"
                    >
                      <span className="font-display text-[15px] font-bold tabular-nums text-neutral-950">
                        {row.value}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergens */}
              <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-amber-50/50">
                <div className="flex items-start gap-3 p-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[14px] font-bold tracking-[-0.01em] text-amber-900">
                      Allergen information
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-[1.6] text-amber-800/90">
                      Prepared in a kitchen that handles gluten, dairy, nuts,
                      and eggs. Cross-contamination is possible.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {allergens.map((a) => (
                        <span
                          key={a}
                          className="rounded-full border border-amber-300/70 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-800"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Small reassurance */}
              {/* <div className="flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white px-4 py-3.5">
                <Shield className="h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-[12px] leading-snug text-neutral-600">
                  <span className="font-bold text-neutral-900">
                    Freshness promise.
                  </span>{" "}
                  If it&apos;s not right, we&apos;ll remake it — just call us
                  within 10 minutes of pickup.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}