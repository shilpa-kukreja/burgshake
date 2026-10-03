"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  X,
  FileText,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Calendar,
  Check,
  ArrowUpRight,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api, resolveImageUrl} from "../../lib/api";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListBlogs({ limit: 200 });
      setBlogs(res.data.blogs || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = blogs;
    if (status !== "all") list = list.filter((b) => b.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.blogName?.toLowerCase().includes(q) ||
          b.blogSlug?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [blogs, status, search]);

  const handleToggleStatus = async (blog) => {
    setBusyId(blog._id);
    try {
      const next = blog.status === "published" ? "draft" : "published";
      const res = await api.adminUpdateBlog(blog._id, { status: next });
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, status: res.data.blog.status } : b
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (blog) => {
    if (!confirm(`Delete "${blog.blogName}"? This cannot be undone.`)) return;
    setBusyId(blog._id);
    try {
      await api.adminDeleteBlog(blog._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Blog"
        subtitle={`${blogs.length} total posts`}
        onMenuClick={handleMenuClick}
        actions={
          <Link
            href="/admin/blogs/new"
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_10px_26px_-10px_rgba(249,115,22,0.6)]"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            New post
          </Link>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
                  status === t.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or slug…"
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-[12.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 font-display text-[15px] font-bold text-neutral-800">
              No posts found
            </p>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">
              {search || status !== "all"
                ? "Try clearing filters."
                : "Write your first blog post to get started."}
            </p>
            {!search && status === "all" && (
              <Link
                href="/admin/blogs/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-[12.5px] font-bold text-white hover:bg-brand-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Create first post
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white">
            {/* Header row (desktop) */}
            <div className="hidden grid-cols-12 gap-3 border-b border-neutral-200/70 bg-neutral-50/60 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 lg:grid">
              <div className="col-span-6">Post</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <ul className="divide-y divide-neutral-200/70">
              {filtered.map((blog) => {
                const isPublished = blog.status === "published";
                const dateObj = blog.blogDate || blog.createdAt;
                return (
                  <li
                    key={blog._id}
                    className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30 lg:grid-cols-12 lg:items-center"
                  >
                    {/* Post */}
                    <div className="flex items-center gap-3 lg:col-span-6">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        {blog.blogImg && (
                          <img
                            src={resolveImageUrl(blog.blogImg)}
                            alt={blog.blogName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-display text-[14px] font-bold text-neutral-950">
                            {blog.blogName}
                          </span>
                        </div>
                        <code className="mt-1 inline-block max-w-full truncate rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                          /blog/{blog.blogSlug}
                        </code>
                        {blog.tags?.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-brand-700"
                              >
                                {t}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-[9.5px] font-bold text-neutral-400">
                                +{blog.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="hidden text-[12px] font-medium text-neutral-500 lg:col-span-2 lg:block">
                      {dateObj
                        ? new Date(dateObj).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      <StatusChip status={blog.status} />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 lg:col-span-2 lg:justify-end">
                      <Link
                        href={`/blog/${blog.blogSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(blog)}
                        disabled={busyId === blog._id}
                        title={isPublished ? "Move to draft" : "Publish"}
                        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors disabled:opacity-40 ${
                          isPublished
                            ? "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {busyId === blog._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isPublished ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        title="Edit"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(blog)}
                        disabled={busyId === blog._id}
                        title="Delete"
                        className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

function StatusChip({ status }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-emerald-700 ring-1 ring-emerald-200">
        <Check className="h-2.5 w-2.5" strokeWidth={3} />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-amber-700 ring-1 ring-amber-200">
      Draft
    </span>
  );
}