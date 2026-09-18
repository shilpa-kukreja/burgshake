"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

const WORDS = ["Burgers", "Shakes", "Good Vibes"];

const FEATURES = [
    "Handcrafted Daily",
    "Premium Ingredients",
    "Ready in 15 Min",
    "Takeaway Only",
];

export default function IntroSection() {
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(120);

    const contentRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    /* ── Typing animation ─────────────────────────────── */
    useEffect(() => {
        const currentWord = WORDS[loopNum % WORDS.length];

        const handleTyping = () => {
            if (isDeleting) {
                setDisplayText(currentWord.substring(0, displayText.length - 1));
                setTypingSpeed(60);
            } else {
                setDisplayText(currentWord.substring(0, displayText.length + 1));
                setTypingSpeed(130);
            }

            if (!isDeleting && displayText === currentWord) {
                setTimeout(() => setIsDeleting(true), 1600);
            }

            if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setLoopNum((prev) => prev + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, typingSpeed]);

    /* ── Scroll reveal ────────────────────────────────── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.15 }
        );
        if (contentRef.current) observer.observe(contentRef.current);
        return () => observer.disconnect();
    }, []);

    return (
       <section className="relative min-h-screen w-full">

    {/* ── Floating mascot straddling the boundary ───── */}
    <div className="pointer-events-none absolute left-1/2 top-[-1.5rem] z-50 -translate-x-1/2 -translate-y-1/2 sm:left-auto sm:right-8 sm:translate-x-0 lg:right-14">
      <div className="animate-float-y-slow">
        <img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80"
          alt="Burger"
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] sm:h-32 sm:w-32 lg:h-40 lg:w-40"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-brand-400/40 blur-3xl"
      />
    </div>

            {/* ── Fixed background image (Unsplash — no local file needed) ── */}
            <div className="fixed inset-0 -z-10">
                <div className="relative h-full w-full">
                    <img
                        src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=2000&q=85"
                        alt="Burgers & Shakes"
                        className="h-full w-full object-cover"
                        loading="eager"
                    />
                    {/* Warm dark → orange gradient overlay */}
                    {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/70 to-brand-600/60" /> */}
                    {/* Fine dot texture */}
                    <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                            backgroundSize: "30px 30px",
                        }}
                    />
                    {/* Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />
                </div>
            </div>

            {/* ── Centered glass card ──────────────────────── */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
                <div
                    ref={contentRef}
                    className={`
            w-full max-w-full rounded-3xl
            border border-white/40 bg-white/95 p-6 backdrop-blur-xl sm:p-8 md:max-w-[620px] md:p-10 lg:max-w-[780px] lg:p-12
            shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]
            transition-all duration-700 ease-out
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          `}
                >
                    {/* Eyebrow */}
                    {/* <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-700">
                        <Sparkles className="h-3 w-3" />
                        Introducing Burgshake
                    </div> */}

                    {/* Headline with typing animation */}
                    <h1 className="mt-5 font-display text-[1.9rem] font-bold leading-[1.12] tracking-[-0.02em] text-neutral-950 sm:text-[2.4rem] md:text-[2.8rem] lg:text-[3rem]">
                        Fresh{" "}
                        <span className="inline-flex flex-wrap items-baseline gap-1 text-brand-500">
                            <span className="inline-block min-w-[110px] sm:min-w-[140px] md:min-w-[180px]">
                                {displayText}
                            </span>
                            <span className="animate-pulse text-brand-500/80">|</span>
                        </span>
                        <br />
                        <span className="font-serif italic font-normal text-neutral-700">
                            made for the moment.
                        </span>
                    </h1>

                    {/* Paragraph */}
                    <p className="mt-5 text-[14px] leading-[1.7] text-neutral-600 sm:text-[15px]">
                        Burgshake is a{" "}
                        <span className="font-semibold text-brand-600">
                            handcrafted burger café
                        </span>{" "}
                        built on{" "}
                        <span className="font-semibold text-neutral-900">
                            freshness, flavour, and craft
                        </span>
                        . Every patty is smashed to order, every bun is baked fresh daily,
                        and every shake is blended with real ingredients — never syrups.
                        <br />
                        We believe great food shouldn&apos;t be complicated. Whether
                        you&apos;re grabbing a{" "}
                        <span className="font-semibold text-neutral-900">
                            quick takeaway lunch
                        </span>
                        , hosting friends at home, or treating yourself after a long day,
                        Burgshake delivers{" "}
                        <span className="font-bold text-brand-600">
                            consistency you can taste in every single bite.
                        </span>
                    </p>

                    {/* Feature chips */}
                    {/* <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5">
            {FEATURES.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white/70 px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/60 hover:shadow-[0_10px_24px_-12px_rgba(249,115,22,0.4)]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 text-brand-600"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[11.5px] font-semibold text-neutral-700 sm:text-[12px]">
                  {item}
                </span>
              </div>
            ))}
          </div> */}

                    {/* CTAs */}
                    <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <Link
                            href="/menu"
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_12px_32px_-10px_rgba(249,115,22,0.6)]"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            Order Now
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href="/about"
                            className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3.5 text-sm font-bold text-neutral-900 transition-all duration-300 hover:border-neutral-950 hover:bg-neutral-50"
                        >
                            Discover Burgshake
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}