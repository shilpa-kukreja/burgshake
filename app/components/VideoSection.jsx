"use client";

import { useRef, useEffect, useState, useCallback } from "react";

/* Replace these with your own MP4s + poster images */
const VIDEOS = [
  {
    id: 1,
    src: "https://cdn.shopify.com/videos/c/o/v/e12dba1f5f074a3aa3eec66c1671f558.mp4",
    poster: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=70",
  },
  {
    id: 2,
    src: "https://cdn.shopify.com/videos/c/o/v/04757813c077432dbcbc0ef3c4d4039d.mp4",
    poster: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=70",
  },
  {
    id: 3,
    src: "https://cdn.shopify.com/videos/c/o/v/840c820a15984bab93db9449a36a954a.mp4",
    poster: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=70",
  },
  {
    id: 4,
    src: "https://cdn.shopify.com/videos/c/o/v/15f61533ca2c4eb9a3839544f64cd1ca.mp4",
    poster: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=500&q=70",
  },
  {
    id: 5,
    src: "https://cdn.shopify.com/videos/c/o/v/e7e2938a16524b4ebecd27564893f908.mp4",
    poster: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=70",
  },
  {
    id: 6,
    src: "https://cdn.shopify.com/videos/c/o/v/94cd49de39ae4d63a0432f8986fd7ff1.mp4",
    poster: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=70",
  },
];

/* ── Tunables ──────────────────────────────────────── */
const CARD_W = 220;          // card width  (px)
const CARD_H = 400;          // card height (px)
const GAP = 48;              // gap between cards (px)
const SPEED = 0.55;          // auto-scroll speed (px per frame)
const MAX_ROTATE = 42;       // max rotateY at the edge (deg)
const MAX_DEPTH = 240;       // max translateZ push-back at the edge (px)
const MAX_LIFT = 60;         // max translateY lift at the edge (px)
const PERSPECTIVE = 1400;    // larger = gentler curve
const DRAG_THRESHOLD = 4;    // px before a tap becomes a drag

/* Precompute once — the track is 3× the set for a seamless loop */
const LOOPED = [...VIDEOS, ...VIDEOS, ...VIDEOS];
const SET_WIDTH = VIDEOS.length * (CARD_W + GAP);

export default function VideoShowcase() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);
  const scrollRef = useRef(0);
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* ── Main RAF loop: auto-scroll + per-card 3D transforms ── */
  useEffect(() => {
    const track = trackRef.current;
    const wrapEl = wrapRef.current;
    if (!track || !wrapEl) return;

    const tick = () => {
      /* Only auto-advance when idle (not paused, not dragging) */
      if (!paused && !dragRef.current.active) {
        scrollRef.current += SPEED;
        if (scrollRef.current >= SET_WIDTH) scrollRef.current -= SET_WIDTH;
      }

      track.style.transform = `translate3d(${-scrollRef.current}px, 0, 0)`;

      const wrapRect = wrapEl.getBoundingClientRect();
      const centerX = wrapRect.left + wrapRect.width / 2;
      const halfW = wrapRect.width / 2;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;

        let t = (cardCenter - centerX) / halfW;
        t = Math.max(-1, Math.min(1, t));

        /* Ease so the middle stays flat longer, edges curve faster */
        const eased = Math.sign(t) * Math.pow(Math.abs(t), 1.4);

        const rotateY = -eased * MAX_ROTATE;
        const translateZ = -Math.abs(eased) * MAX_DEPTH;
        const translateY = Math.abs(eased) * MAX_LIFT;
        const scale = 1 - Math.abs(eased) * 0.08;

        card.style.transform = `
          translate3d(0, ${translateY}px, ${translateZ}px)
          rotateY(${rotateY}deg)
          scale(${scale})
        `;
        card.style.filter = `brightness(${1 - Math.abs(eased) * 0.25})`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  /* ── Pointer handlers — works for mouse and touch ── */
  const onPointerDown = useCallback((e) => {
    /* Only left mouse button — ignore right/middle */
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragRef.current.active = true;
    dragRef.current.pointerId = e.pointerId;
    dragRef.current.startX = e.clientX;
    dragRef.current.startScroll = scrollRef.current;
    dragRef.current.moved = false;
    setDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    if (e.pointerId !== dragRef.current.pointerId) return;

    const dx = e.clientX - dragRef.current.startX;
    if (!dragRef.current.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      dragRef.current.moved = true;
    }

    /* Drag right → scroll left (natural feeling) */
    let next = dragRef.current.startScroll - dx;

    /* Wrap into [0, SET_WIDTH) so the loop is infinite in both directions */
    while (next < 0) next += SET_WIDTH;
    while (next >= SET_WIDTH) next -= SET_WIDTH;

    scrollRef.current = next;
  }, []);

  const onPointerUp = useCallback((e) => {
    if (e.pointerId !== dragRef.current.pointerId) return;

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    /* On desktop, keep paused if the cursor is still over the carousel */
    if (e.pointerType === "mouse") {
      const rect = e.currentTarget.getBoundingClientRect();
      const stillInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      setPaused(stillInside);
    } else {
      setPaused(false);
    }
  }, []);

  const onPointerCancel = useCallback((e) => {
    if (e.pointerId !== dragRef.current.pointerId) return;
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setDragging(false);
    setPaused(false);
  }, []);

  /* ── Hover pause (desktop only) ── */
  const onMouseEnter = useCallback(() => setPaused(true), []);
  const onMouseLeave = useCallback(() => {
    if (!dragRef.current.active) setPaused(false);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#FDFCFB] py-16 sm:py-24">
      {/* Heading */}
      <div className="mx-auto mb-12 max-w-3xl px-6 text-center sm:mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Watch what we&apos;re cooking
        </div>
        <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.6rem]">
          Every bite has a{" "}
          <span className="font-serif italic font-normal text-brand-500">
            story.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-[1.7] text-neutral-600">
          A look inside the Burgshake kitchen — sizzle, shake, and serve.
        </p>
      </div>

      {/* 3D Carousel */}
      <div
        ref={wrapRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onDragStart={(e) => e.preventDefault()}
        className={`relative w-full select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: "50% 50%",
          height: `${CARD_H + MAX_LIFT + 40}px`,
          /* Allows vertical page scroll on touch, captures horizontal drag */
          touchAction: "pan-y",
        }}
      >
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2 flex -translate-y-1/2 will-change-transform"
          style={{
            gap: `${GAP}px`,
            transformStyle: "preserve-3d",
          }}
        >
          {LOOPED.map((video, i) => (
            <div
              key={`${video.id}-${i}`}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="relative flex-shrink-0 will-change-transform"
              style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                transformStyle: "preserve-3d",
                transition: "filter 200ms linear",
              }}
            >
              <div className="group relative h-full w-full overflow-hidden rounded-[22px] shadow-[0_30px_60px_-25px_rgba(23,23,23,0.35),0_10px_24px_-12px_rgba(249,115,22,0.25)] ring-1 ring-neutral-900/5">
                <video
                  src={video.src}
                  poster={video.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover"
                />

                {/* Warm brand tint on hover only */}
                <div className="pointer-events-none absolute inset-0 bg-brand-500/0 transition-colors duration-500 group-hover:bg-brand-500/15" />

                {/* Glossy sheen — desktop only to keep mobile edges clean */}
                <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-white/10 via-transparent to-black/20 sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edge fades — desktop only. Hidden on mobile so no white texture
          sits on top of the videos when the viewport is narrow. */}
      <div className="pointer-events-none absolute inset-y-16 left-0 z-10 hidden w-24 bg-gradient-to-r from-[#FDFCFB] via-[#FDFCFB]/80 to-transparent sm:block sm:w-40" />
      <div className="pointer-events-none absolute inset-y-16 right-0 z-10 hidden w-24 bg-gradient-to-l from-[#FDFCFB] via-[#FDFCFB]/80 to-transparent sm:block sm:w-40" />
    </section>
  );
}