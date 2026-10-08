"use client";

import ReactMarkdown from "react-markdown";

/* ── Custom renderers for each markdown element ──────────────
   Matches the Burgshake visual language: warm neutrals, brand
   orange accents, generous line-height, and step badges for
   the "Step N: …" pattern in recipe-style posts.
   ───────────────────────────────────────────────────────── */

/* ── Headings ──────────────────────────────────────────────── */

function H1({ children }) {
  return (
    <h1 className="mt-14 mb-6 font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 sm:text-[2rem]">
      {children}
    </h1>
  );
}

function H2({ children }) {
  const text = Array.isArray(children)
    ? children.join("")
    : String(children || "");

  /* "Step N: Title" → numbered step badge + heading */
  const stepMatch = text.match(/^Step\s+(\d+)\s*[:.-]\s*(.+)$/i);
  if (stepMatch) {
    const [, num, title] = stepMatch;
    return (
      <div className="mt-14 mb-6 flex items-start gap-5 border-t border-neutral-200/70 pt-8 first:mt-10 first:border-0 first:pt-0">
        <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 font-display text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(249,115,22,0.6)]">
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-600">
            Step {num}
          </div>
          <h2 className="mt-1 font-display text-[1.4rem] font-bold leading-[1.2] tracking-[-0.015em] text-neutral-950 sm:text-[1.55rem]">
            {title}
          </h2>
        </div>
      </div>
    );
  }

  /* "The Perfect Bite" → centered pull-quote section */
  if (/^the perfect bite$/i.test(text.trim())) {
    return (
      <h2 className="mt-16 mb-6 border-t border-neutral-200/70 pt-12 text-center font-display text-[1.5rem] font-bold tracking-[-0.015em] text-neutral-950 sm:text-[1.75rem]">
        {text}
      </h2>
    );
  }

  /* "Ready for Your Next Burger?" → CTA section */
  if (/^ready for your next burger\?$/i.test(text.trim())) {
    return (
      <div className="mt-16 mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
          {text}
        </h2>
      </div>
    );
  }

  /* Default H2 — big editorial heading with a subtle accent */
  return (
    <h2 className="relative mt-14 mb-5 font-display text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-neutral-950 sm:text-[1.7rem]">
      <span
        aria-hidden="true"
        className="absolute -left-5 top-2 hidden h-3 w-3 rounded-full bg-brand-500/15 sm:block"
      />
      {children}
    </h2>
  );
}

function H3({ children }) {
  return (
    <h3 className="mt-10 mb-3 font-display text-[1.15rem] font-bold leading-[1.3] tracking-[-0.01em] text-neutral-950">
      {children}
    </h3>
  );
}

function H4({ children }) {
  return (
    <h4 className="mt-8 mb-2 font-display text-[1rem] font-bold leading-[1.35] text-neutral-900">
      {children}
    </h4>
  );
}

/* ── Body text ─────────────────────────────────────────────── */

function P({ children, node }) {
  /* Empty paragraph — markdown produces these from blank lines.
     Render as spacing instead of <p></p>. */
  const isBlank =
    !children ||
    (Array.isArray(children) && children.every((c) => c === "")) ||
    (typeof children === "string" && children.trim() === "");

  if (isBlank) return <div className="h-2" />;

  return (
    <p className="my-4 text-[16px] leading-[1.8] text-neutral-700">
      {children}
    </p>
  );
}

/* A paragraph that follows a step heading gets a slightly larger
   "lede" treatment. Detecting this via ReactMarkdown is tricky, so
   instead we style strong tags inside paragraphs to feel like
   intros, and leave body copy standard. */

function Strong({ children }) {
  return (
    <strong className="font-bold text-neutral-900">{children}</strong>
  );
}

function Em({ children }) {
  return <em className="italic text-neutral-700">{children}</em>;
}

/* ── Lists ─────────────────────────────────────────────────── */

function UL({ children }) {
  return (
    <ul className="my-5 space-y-2.5 pl-1">{children}</ul>
  );
}

function OL({ children }) {
  return (
    <ol className="my-5 list-decimal space-y-2.5 pl-6">{children}</ol>
  );
}

function LI({ children }) {
  return (
    <li className="relative pl-6 text-[15.5px] leading-[1.75] text-neutral-700">
      <span
        aria-hidden="true"
        className="absolute left-0 top-[0.7em] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand-500"
      />
      {children}
    </li>
  );
}

/* ── Blockquote — styled as a warm pull quote ────────────────── */

function Blockquote({ children }) {
  return (
    <blockquote className="my-8 rounded-2xl border-l-4 border-brand-500 bg-gradient-to-r from-brand-50/80 to-transparent px-6 py-5">
      <div className="text-[16.5px] font-medium italic leading-[1.7] text-neutral-800">
        {children}
      </div>
    </blockquote>
  );
}

/* ── Links ─────────────────────────────────────────────────── */

function A({ href, children }) {
  return (
    <a
      href={href}
      className="font-medium text-brand-600 underline decoration-brand-300 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-500"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

/* ── Code ──────────────────────────────────────────────────── */

function Code({ inline, children }) {
  if (inline) {
    return (
      <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[13.5px] font-medium text-neutral-800">
        {children}
      </code>
    );
  }
  return (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-neutral-950 p-5 text-[13.5px] leading-[1.7] text-neutral-100">
      <code>{children}</code>
    </pre>
  );
}

/* ── Images ────────────────────────────────────────────────── */

function Img({ src, alt }) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt || ""}
        className="w-full rounded-2xl shadow-[0_20px_50px_-25px_rgba(23,23,23,0.3)]"
        loading="lazy"
      />
      {alt && (
        <figcaption className="mt-3 text-center text-[12.5px] italic text-neutral-500">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Horizontal rule ───────────────────────────────────────── */

function HR() {
  return (
    <hr className="my-12 border-0 border-t border-neutral-200/70" />
  );
}

/* ── Main component ────────────────────────────────────────── */

const COMPONENTS = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  strong: Strong,
  em: Em,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  a: A,
  code: Code,
  img: Img,
  hr: HR,
};

export default function BlogContent({ content }) {
  if (!content) return null;

  return (
    <div className="blog-content">
      <ReactMarkdown components={COMPONENTS}>{content}</ReactMarkdown>

      {/* Styles for elements we can't easily render as React components
          (nested <strong> inside <li>, etc.) */}
      <style jsx global>{`
        .blog-content > *:first-child {
          margin-top: 0;
        }
        .blog-content > *:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}