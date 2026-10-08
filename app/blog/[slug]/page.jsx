import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  User as UserIcon,
  Tag as TagIcon,
  Clock,
  Link2,
  Share2,
  BookOpen,
  FileText
} from "lucide-react";
import {resolveImageUrl} from  "../../lib/api"
import BlogContent from "../../components/BlogContent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/* ── Fetch ─────────────────────────────────────────── */
async function getBlog(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/blogs/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

/* ── Helpers ───────────────────────────────────────── */
function formatDate(iso, style = "long") {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: style === "short" ? "short" : "long",
    year: "numeric",
  });
}

function initials(name) {
  if (!name) return "B";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/* Words-per-minute estimate — computed on the fly, not stored */
function getReadTime(text) {
  const words = String(text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/* Strip markdown syntax for word counting */
function stripMd(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]*)\]\(.*?\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── SEO ───────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlog(slug);

  if (!data?.blog) return { title: "Story not found — Burgshake" };

  const b = data.blog;
  const title = b.metaTitle || `${b.blogName} — Burgshake`;
  const description =
    b.metaDescription ||
    b.excerpt ||
    stripMd(b.blogDetail).slice(0, 160);

  return {
    title,
    description,
    keywords: b.metatag || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: b.blogDate || b.createdAt,
      authors: b.author ? [b.author] : undefined,
      tags: b.tags,
      images: b.blogImg ? [{ url: b.blogImg }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: b.blogImg ? [b.blogImg] : undefined,
    },
  };
}

/* ── Page ──────────────────────────────────────────── */
export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const data = await getBlog(slug);

  if (!data?.blog) notFound();

  const blog = data.blog;
  const related = data.related || [];
  const author = blog.author || "Burgshake Team";
  const published = formatDate(blog.blogDate || blog.createdAt);
  const updated =
    blog.updatedAt && blog.updatedAt !== blog.createdAt
      ? formatDate(blog.updatedAt)
      : null;
  const readTime = getReadTime(stripMd(blog.blogDetail));
  const wordCount = stripMd(blog.blogDetail).split(/\s+/).length;

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      {/* ═══ Back + breadcrumb ═══════════════════════ */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-neutral-500 transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Journal
          </Link>
          {blog.tags?.[0] && (
            <>
              <span className="text-neutral-300">/</span>
              <span className="text-brand-600">{blog.tags[0]}</span>
            </>
          )}
          <span className="text-neutral-300">/</span>
          <span className="truncate text-neutral-700">{blog.blogName}</span>
        </nav>
      </div>

      {/* ═══ Hero header ═════════════════════════════ */}
      <header className="mx-auto mt-8 max-w-7xl px-6 lg:mt-10 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: text column */}
          <div className="lg:col-span-7">
            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {blog.tags?.slice(0, 3).map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-100"
                >
                  <TagIcon className="h-2.5 w-2.5" />
                  {t}
                </Link>
              ))}
              {blog.status === "draft" && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
                  Draft
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-5 font-display text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-neutral-950 sm:text-[2.4rem] lg:text-[2.8rem]">
              {blog.blogName}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-neutral-600">
                {blog.excerpt}
              </p>
            )}

            {/* Meta strip — author + date + read time */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-neutral-200/70 py-5">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 ring-1 ring-brand-200">
                  {initials(author)}
                </div>
                <div className="leading-tight">
                  <div className="text-[12px] font-bold text-neutral-900">
                    {author}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    Burgshake Kitchen
                  </div>
                </div>
              </div>

              <span className="hidden h-5 w-px bg-neutral-200 sm:block" />

              <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                {published}
              </div>

              <span className="hidden h-5 w-px bg-neutral-200 sm:block" />

              <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-600">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                {readTime} min read
              </div>
            </div>
          </div>

          {/* Right: cover image */}
          {blog.blogImg && (
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                <img
                  src={resolveImageUrl(blog.blogImg)}
                  alt={blog.blogName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ═══ Full-bleed cover (mobile only, replaces the small one above) ═══ */}
      {blog.blogImg && (
        <div className="mx-auto mt-8 max-w-7xl px-6 lg:hidden">
          {/* On mobile the hero cover above is hidden, show a large one here */}
        </div>
      )}

      {/* ═══ Body ════════════════════════════════════ */}
      <div className="mx-auto mt-14 max-w-7xl px-6 lg:mt-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ── Main content ───────────────────── */}
          <article className="lg:col-span-8">
            {/* <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-[-0.01em] prose-headings:text-neutral-950 prose-h1:mt-12 prose-h1:text-[1.75rem] prose-h2:mt-12 prose-h2:text-[1.5rem] prose-h3:mt-10 prose-h3:text-[1.2rem] prose-h4:mt-8 prose-h4:text-[1.05rem] prose-p:my-5 prose-p:text-[16px] prose-p:leading-[1.8] prose-p:text-neutral-700 prose-a:font-medium prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:italic prose-ul:my-5 prose-ol:my-5 prose-li:my-1.5 prose-li:text-[16px] prose-li:leading-[1.75] prose-li:text-neutral-700 prose-blockquote:my-8 prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:bg-brand-50/40 prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:not-italic prose-blockquote:text-[16px] prose-blockquote:text-neutral-700 prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[14px] prose-code:font-medium prose-code:text-neutral-800 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:my-6 prose-pre:rounded-2xl prose-pre:bg-neutral-950 prose-pre:p-5 prose-pre:text-[13.5px] prose-pre:leading-[1.7] prose-img:my-8 prose-img:rounded-2xl prose-hr:my-12 prose-hr:border-neutral-200">
              <ReactMarkdown>{blog.blogDetail}</ReactMarkdown>
            </div> */}
            <BlogContent content={blog.blogDetail} />

            {/* Tags footer */}
            {blog.tags?.length > 0 && (
              <div className="mt-14 flex flex-wrap items-center gap-2 border-t border-neutral-200/70 pt-7">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Tagged
                </span>
                {blog.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-600 transition-all hover:border-brand-300 hover:text-brand-600"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}

            {/* Author card */}
            <div className="mt-12 flex items-start gap-4 rounded-2xl border border-neutral-200/70 bg-white p-6 mb-10">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 text-[16px] font-bold text-brand-700 ring-1 ring-brand-200">
                {initials(author)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  Written by
                </div>
                <div className="mt-1 font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                  {author}
                </div>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-neutral-500">
                  Part of the Burgshake kitchen team — sharing stories from
                  behind the counter, one patty at a time.
                </p>
              </div>
            </div>
          </article>

          {/* ── Sidebar ─────────────────────────── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-5">
              {/* Article info card */}
              <div className="rounded-2xl border border-neutral-200/70 bg-white p-5">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Article Info
                </div>

                <dl className="mt-4 space-y-4">
                  <MetaRow icon={UserIcon} label="Author" value={author} />
                  <MetaRow icon={Calendar} label="Published" value={published} />
                  {updated && (
                    <MetaRow icon={Clock} label="Updated" value={updated} />
                  )}
                  <MetaRow
                    icon={BookOpen}
                    label="Reading time"
                    value={`${readTime} min`}
                  />
                  <MetaRow
                    icon={FileText}
                    label="Words"
                    value={wordCount.toLocaleString()}
                  />
                </dl>
              </div>

              {/* Tags card */}
              {blog.tags?.length > 0 && (
                <div className="rounded-2xl border border-neutral-200/70 bg-white p-5">
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                    Topics
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {blog.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/blog?tag=${encodeURIComponent(t)}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-neutral-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                      >
                        <TagIcon className="h-2.5 w-2.5" />
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share card */}
              <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 ">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                  Share
                </div>
                <div className="mt-3 space-y-2">
                  <ShareLink
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${blog.blogName} — ${API_BASE?.replace("/api", "") || ""}/blog/${blog.blogSlug}`
                    )}`}
                    label="WhatsApp"
                  />
                  <ShareLink
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      blog.blogName
                    )}`}
                    label="Twitter / X"
                  />
                  <ShareLink
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      `${API_BASE?.replace("/api", "") || ""}/blog/${blog.blogSlug}`
                    )}`}
                    label="Facebook"
                  />
                </div>
              </div>

              {/* Back to all */}
              <Link
                href="/blog"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-neutral-200/70 bg-white px-5 py-4 transition-all hover:border-brand-300 hover:bg-brand-50/50"
              >
                <span className="text-[12.5px] font-bold text-neutral-700 transition-colors group-hover:text-brand-700">
                  All stories
                </span>
                <ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ Related posts ══════════════════════════ */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-neutral-200/70 lg:mt-28">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                  <span className="h-px w-8 bg-brand-500" />
                  Keep Reading
                </div>
                <h2 className="mt-3 font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 sm:text-[1.9rem]">
                  More from{" "}
                  <span className="font-serif italic font-normal text-brand-500">
                    the journal.
                  </span>
                </h2>
              </div>

              <Link
                href="/blog"
                className="group hidden items-center gap-2 text-[12.5px] font-semibold text-neutral-950 sm:inline-flex"
              >
                <span className="border-b border-neutral-950 pb-0.5 transition-colors group-hover:border-brand-500 group-hover:text-brand-600">
                  All stories
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {related.map((r) => (
                <article key={r.blogSlug} className="group">
                  <Link href={`/blog/${r.blogSlug}`} className="block">
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/70">
                      {r.blogImg ? (
                        <img
                          src={resolveImageUrl(r.blogImg)}
                          alt={r.blogName}
                          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-neutral-100">
                          <BookOpen className="h-6 w-6 text-neutral-300" />
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-brand-500/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-brand-500/12" />
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.16em]">
                        {r.tags?.[0] && (
                          <>
                            <span className="text-brand-600">{r.tags[0]}</span>
                            <span className="h-2.5 w-px bg-neutral-300" />
                          </>
                        )}
                        <span className="text-neutral-400">
                          {formatDate(r.blogDate || r.createdAt, "short")}
                        </span>
                      </div>

                      <h3 className="mt-2.5 line-clamp-2 font-display text-[16px] font-bold leading-[1.3] tracking-[-0.015em] text-neutral-950 transition-colors duration-300 group-hover:text-brand-600">
                        {r.blogName}
                      </h3>

                      {r.excerpt && (
                        <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-neutral-500">
                          {r.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ══════════════════════════════════════════════════
   Small components
   ══════════════════════════════════════════════════ */

function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-[13px] font-semibold text-neutral-800">
          {value}
        </dd>
      </div>
    </div>
  );
}

function ShareLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 transition-all hover:border-brand-300 hover:bg-brand-50/50"
    >
      <span className="text-[12px] font-semibold text-neutral-700 transition-colors group-hover:text-brand-700">
        {label}
      </span>
      <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-500" />
    </a>
  );
}