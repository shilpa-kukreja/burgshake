"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Check,
  AlertCircle,
  Loader2,
  Bold,
  Italic,
  Heading2,
  List,
  Link2,
  Eye,
  Upload,
  Image as ImageIcon,
  Trash2,
  Calendar,
  User,
  Tag,
  Globe,
  Search,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api } from "../../lib/api";

const EMPTY = {
  blogName: "",
  blogImg: "",
  blogDetail: "",
  excerpt: "",
  blogDate: "",
  author: "Burgshake Team",
  tags: [],
  status: "published",
  metaTitle: "",
  metaDescription: "",
  metatag: "",
};

/* "YYYY-MM-DD" for <input type="date"> from an ISO or Date */
function toDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* Default: today */
function todayInput() {
  return toDateInput(new Date().toISOString());
}

export default function BlogForm({ initialData = null, mode = "new" }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => {
    if (!initialData) return { ...EMPTY, blogDate: todayInput() };
    return {
      blogName: initialData.blogName || "",
      blogImg: initialData.blogImg || "",
      blogDetail: initialData.blogDetail || "",
      excerpt: initialData.excerpt || "",
      blogDate: toDateInput(initialData.blogDate || initialData.createdAt),
      author: initialData.author || "Burgshake Team",
      tags: Array.isArray(initialData.tags) ? initialData.tags : [],
      status: initialData.status || "published",
      metaTitle: initialData.metaTitle || "",
      metaDescription: initialData.metaDescription || "",
      metatag: initialData.metatag || "",
    };
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  /* ── Slug preview ─────────────────────────────── */
  const slugPreview = useMemo(() => {
    return (form.blogName || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, [form.blogName]);

  /* ── Tag helpers ─────────────────────────────── */
  const addTag = () => {
    const v = tagInput.trim().toLowerCase();
    if (!v) return;
    if (!form.tags.includes(v)) update("tags", [...form.tags, v]);
    setTagInput("");
  };
  const removeTag = (t) => update("tags", form.tags.filter((x) => x !== t));

  /* ── Validation ──────────────────────────────── */
  const validate = () => {
    const err = {};
    if (!form.blogName.trim() || form.blogName.trim().length < 2)
      err.blogName = "Title is required (min 2 chars)";
    if (!form.blogImg?.trim()) err.blogImg = "Please upload a cover image";
    if (!form.blogDetail.trim() || form.blogDetail.trim().length < 20)
      err.blogDetail = "Content must be at least 20 characters";
    if (form.excerpt && form.excerpt.length > 300)
      err.excerpt = "Excerpt must be under 300 characters";
    if (form.metaDescription && form.metaDescription.length > 180)
      err.metaDescription = "Meta description must be under 180 characters";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ── Submit ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      blogName: form.blogName.trim(),
      blogImg: form.blogImg.trim(),
      blogDetail: form.blogDetail,
      excerpt: form.excerpt.trim(),
      blogDate: form.blogDate
        ? new Date(`${form.blogDate}T12:00:00`).toISOString()
        : new Date().toISOString(),
      author: form.author.trim() || "Burgshake Team",
      tags: form.tags,
      status: form.status,
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      metatag: form.metatag.trim(),
    };

    try {
      if (isEdit) {
        await api.adminUpdateBlog(initialData._id, payload);
      } else {
        await api.adminCreateBlog(payload);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/blogs"), 700);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-[13px] font-medium text-red-700">
            {errors.submit}
          </p>
        </div>
      )}

      {/* ═══ BASIC ═══════════════════════════════ */}
      <Section title="Basics" subtitle="Title, slug, and cover image">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Title <span className="text-brand-500">*</span>
          </label>
          <input
            type="text"
            value={form.blogName}
            onChange={(e) => update("blogName", e.target.value)}
            placeholder="The Secret Behind Our Smash Patties"
            className={`mt-2 w-full rounded-2xl border bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:ring-4 ${
              errors.blogName
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
            }`}
          />
          {errors.blogName && (
            <p className="mt-1.5 text-[11px] font-semibold text-red-600">
              {errors.blogName}
            </p>
          )}
          {form.blogName && (
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="font-semibold text-neutral-400">URL:</span>
              <code className="rounded bg-brand-50 px-2 py-0.5 font-mono text-brand-700">
                /blog/{slugPreview || "..."}
              </code>
              {isEdit && (
                <span className="text-neutral-400">(locked once created)</span>
              )}
            </div>
          )}
        </div>

        <ImageUpload
          label="Cover Image"
          value={form.blogImg}
          onChange={(url) => update("blogImg", url)}
          error={errors.blogImg}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Author
            </label>
            <div className="relative mt-2">
              <User className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                placeholder="Burgshake Team"
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Publish Date
            </label>
            <div className="relative mt-2">
              <Calendar className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                type="date"
                value={form.blogDate}
                onChange={(e) => update("blogDate", e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-[13.5px] font-medium text-neutral-900 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CONTENT ═════════════════════════════ */}
      <Section title="Content" subtitle="Markdown supported">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Excerpt{" "}
            <span className="font-medium text-neutral-400">(optional)</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value.slice(0, 300))}
            rows={2}
            placeholder="A short teaser that shows on the blog card…"
            className={`mt-2 w-full resize-none rounded-2xl border bg-white p-4 text-[13.5px] font-medium leading-relaxed text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:ring-4 ${
              errors.excerpt
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
            }`}
          />
          <div className="mt-1.5 flex items-center justify-between">
            {errors.excerpt ? (
              <p className="text-[11px] font-semibold text-red-600">
                {errors.excerpt}
              </p>
            ) : (
              <span className="text-[10.5px] text-neutral-400">
                Falls back to the first 200 chars of content if empty
              </span>
            )}
            <span className="text-[10.5px] font-semibold tabular-nums text-neutral-400">
              {form.excerpt.length}/300
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Content <span className="text-brand-500">*</span>
          </label>
          <p className="mt-1 text-[10.5px] text-neutral-400">
            Markdown supported — **bold**, _italic_, ## headings, - lists
          </p>
          <MarkdownEditor
            value={form.blogDetail}
            onChange={(v) => update("blogDetail", v)}
            error={errors.blogDetail}
          />
        </div>
      </Section>

      {/* ═══ TAGS ════════════════════════════════ */}
      <Section title="Tags" subtitle="Optional labels for filtering">
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="behind-the-scenes, recipes, …"
                className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-[13px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              className="shrink-0 rounded-2xl bg-neutral-950 px-5 text-[12.5px] font-bold text-white transition-all hover:bg-brand-500"
            >
              Add
            </button>
          </div>

          {form.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-700"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="grid h-3.5 w-3.5 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-red-100 hover:text-red-500"
                  >
                    <X className="h-2.5 w-2.5" strokeWidth={3} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* ═══ SEO ═════════════════════════════════ */}
      <Section
        title="SEO"
        subtitle="Optional — improves how this shows in search results"
      >
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Meta Title
          </label>
          <div className="relative mt-2">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => update("metaTitle", e.target.value)}
              placeholder={form.blogName || "Falls back to title"}
              className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Meta Description
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-4 top-4 h-3.5 w-3.5 text-neutral-400" />
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                update("metaDescription", e.target.value.slice(0, 180))
              }
              rows={2}
              placeholder="A short description for search engines (max 180 chars)…"
              className={`w-full resize-none rounded-2xl border bg-white py-3 pl-11 pr-4 text-[13px] font-medium leading-relaxed text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:ring-4 ${
                errors.metaDescription
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
              }`}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            {errors.metaDescription ? (
              <p className="text-[11px] font-semibold text-red-600">
                {errors.metaDescription}
              </p>
            ) : (
              <span className="text-[10.5px] text-neutral-400">
                Shown in Google results
              </span>
            )}
            <span className="text-[10.5px] font-semibold tabular-nums text-neutral-400">
              {form.metaDescription.length}/180
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Meta Keywords{" "}
            <span className="font-medium text-neutral-400">(optional)</span>
          </label>
          <input
            type="text"
            value={form.metatag}
            onChange={(e) => update("metatag", e.target.value)}
            placeholder="burgers, mumbai, smash patty"
            className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          <p className="mt-1.5 text-[10.5px] text-neutral-400">
            Comma-separated. Mostly ignored by modern search engines but harmless.
          </p>
        </div>
      </Section>

      {/* ═══ VISIBILITY ══════════════════════════ */}
      <Section title="Visibility">
        <div className="grid gap-3 sm:grid-cols-2">
          <VisibilityToggle
            label="Published"
            desc="Visible on the public blog"
            active={form.status === "published"}
            onClick={() => update("status", "published")}
            tint="emerald"
          />
          <VisibilityToggle
            label="Draft"
            desc="Hidden — only admins can see it"
            active={form.status === "draft"}
            onClick={() => update("status", "draft")}
            tint="amber"
          />
        </div>
      </Section>

      {/* ═══ ACTIONS ═════════════════════════════ */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-neutral-200/70 bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-[12.5px] font-bold text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || success}
          className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${
            success
              ? "bg-emerald-500"
              : "bg-neutral-950 hover:-translate-y-0.5 hover:bg-brand-500"
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : success ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              {isEdit ? "Updated!" : "Created!"}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Save changes" : "Create post"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ══════════════════════════════════════════════════
   MARKDOWN EDITOR
   ══════════════════════════════════════════════════ */
function MarkdownEditor({ value, onChange, error }) {
  const taRef = useRef(null);
  const [preview, setPreview] = useState(false);

  const wrap = (before, after = "") => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const newValue =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  const linePrefix = (prefix) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const beforeCursor = value.slice(0, start);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const newValue =
      value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const tools = [
    { icon: Bold, title: "Bold", action: () => wrap("**", "**") },
    { icon: Italic, title: "Italic", action: () => wrap("_", "_") },
    { icon: Heading2, title: "Heading", action: () => linePrefix("## ") },
    { icon: List, title: "List item", action: () => linePrefix("- ") },
    { icon: Link2, title: "Link", action: () => wrap("[", "](url)") },
  ];

  return (
    <div
      className={`mt-2 overflow-hidden rounded-2xl border bg-white transition-all ${
        error
          ? "border-red-300 focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-100"
          : "border-neutral-200 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.title}
                type="button"
                onClick={t.action}
                title={t.title}
                className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-white hover:text-brand-600"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 transition-colors hover:bg-white hover:text-brand-600"
        >
          <Eye className="h-3 w-3" />
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Body */}
      {preview ? (
        <div className="prose prose-sm max-w-none p-4">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-[13px] italic text-neutral-400">
              Nothing to preview yet.
            </p>
          )}
        </div>
      ) : (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, 20000))}
          rows={14}
          placeholder={"## What makes a smash burger\n\nWrite your story here. **Bold**, _italic_, lists, links — all work."}
          className="w-full resize-y border-0 bg-transparent p-4 text-[13.5px] font-medium leading-relaxed text-neutral-900 placeholder:text-neutral-400 outline-none"
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-3 py-1.5">
        {error ? (
          <p className="text-[11px] font-semibold text-red-600">{error}</p>
        ) : (
          <span className="text-[10.5px] text-neutral-400">
            Markdown supported
          </span>
        )}
        <span className="text-[10.5px] font-semibold tabular-nums text-neutral-400">
          {value.length}/20000
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   IMAGE UPLOAD (single)
   ══════════════════════════════════════════════════ */
function ImageUpload({ label, value, onChange, error, required }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.uploadSingle(fd);
      onChange(res.data.url);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      {value ? (
        <div className="group relative mt-2 aspect-[16/9] w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-950/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-700 transition-colors hover:bg-brand-500 hover:text-white"
              title="Replace"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-700 transition-colors hover:bg-red-500 hover:text-white"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`mt-2 flex aspect-[16/9] w-full max-w-md flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-neutral-50 transition-all hover:border-brand-400 hover:bg-brand-50/50 disabled:opacity-60 ${
            error ? "border-red-300" : "border-neutral-300"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-7 w-7 text-neutral-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Click to upload cover
              </span>
              <span className="text-[10px] text-neutral-400">
                JPG, PNG, WEBP · 5MB
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LAYOUT PIECES
   ══════════════════════════════════════════════════ */
function Section({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-neutral-200/70 bg-white p-5 sm:p-6">
      <div className="border-b border-neutral-200/70 pb-4">
        <h2 className="font-display text-[15px] font-bold tracking-[-0.01em] text-neutral-950">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[12px] text-neutral-500">{subtitle}</p>
        )}
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function VisibilityToggle({ label, desc, active, onClick, tint = "brand" }) {
  const activeCls = {
    emerald: "border-emerald-500 bg-emerald-50/60",
    amber: "border-amber-500 bg-amber-50/60",
    brand: "border-brand-500 bg-brand-50/60",
  }[tint];

  const dotCls = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    brand: "bg-brand-500",
  }[tint];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
        active ? activeCls : "border-neutral-200 bg-white hover:border-brand-200"
      }`}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-bold text-neutral-900">{label}</div>
        <div className="mt-0.5 text-[11px] text-neutral-500">{desc}</div>
      </div>
      <span
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          active ? dotCls : "bg-neutral-300"
        }`}
      >
        <span
          className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${
            active ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}