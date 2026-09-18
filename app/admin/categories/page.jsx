"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  X,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListCategories();
      setCategories(res.data.categories);
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

  const resetForm = () => {
    setForm({ name: "", description: "", icon: "", order: 0, isActive: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setBusy("form");
    try {
      if (editing) {
        await api.adminUpdateCategory(editing, {
          description: form.description,
          icon: form.icon,
          order: form.order,
          isActive: form.isActive,
        });
      } else {
        await api.adminCreateCategory(form);
      }
      await load();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "",
      order: cat.order || 0,
      isActive: cat.isActive ?? true,
    });
    setEditing(cat.slug);
    setShowForm(true);
  };

  const handleToggle = async (slug) => {
    setBusy(slug);
    try {
      const res = await api.adminToggleCategoryActive(slug);
      setCategories((prev) =>
        prev.map((c) =>
          c.slug === slug ? { ...c, isActive: res.data.isActive } : c
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (cat) => {
    const hasItems = cat.itemCount > 0;
    const msg = hasItems
      ? `"${cat.name}" has ${cat.itemCount} items.\n\nDelete category AND all its items? This cannot be undone.`
      : `Delete "${cat.name}"?`;
    if (!confirm(msg)) return;

    setBusy(cat.slug);
    try {
      await api.adminDeleteCategory(cat.slug, hasItems);
      setCategories((prev) => prev.filter((c) => c.slug !== cat.slug));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleReorder = async (slug, direction) => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.slug === slug);
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sorted.length) return;

    [sorted[idx], sorted[newIdx]] = [sorted[newIdx], sorted[idx]];
    const newOrder = sorted.map((c) => c.slug);

    /* Optimistic UI update */
    setCategories(
      newOrder.map((s, i) => ({
        ...sorted.find((c) => c.slug === s),
        order: i,
      }))
    );

    try {
      await api.adminReorderCategories(newOrder);
    } catch (err) {
      alert(err.message);
      load();
    }
  };

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <AdminGuard>
      <AdminTopbar
        title="Categories"
        subtitle={`${categories.length} categories`}
        onMenuClick={handleMenuClick}
        actions={
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-[12.5px] font-bold text-white transition-all hover:bg-brand-500"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add category
          </button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center bg-neutral-950/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between border-b border-neutral-200/70 px-6 py-4">
                <h2 className="font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                  {editing ? "Edit category" : "New category"}
                </h2>
                <button
                  onClick={resetForm}
                  className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Name <span className="text-brand-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Sandwiches"
                    disabled={!!editing}
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:bg-neutral-50 disabled:text-neutral-500"
                  />
                  {editing && (
                    <p className="mt-1.5 text-[10.5px] text-neutral-400">
                      Name is locked once created (used in URLs).
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Icon (optional)
                  </label>
                  <input
                    value={form.icon}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, icon: e.target.value }))
                    }
                    placeholder="🍔 or emoji"
                    maxLength={4}
                    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                    Description (optional)
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={2}
                    maxLength={200}
                    placeholder="A short note about this category."
                    className="mt-2 w-full resize-none rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-[13px] font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                  />
                  Show to customers
                </label>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[12.5px] font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy === "form"}
                    className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:bg-brand-500 disabled:opacity-60"
                  >
                    {busy === "form" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    )}
                    {editing ? "Save changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <p className="font-display text-[15px] font-bold text-neutral-800">
              No categories yet
            </p>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">
              Create your first category to start adding menu items.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map((cat, i) => (
              <article
                key={cat.slug}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-200 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                {/* Icon */}
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-[22px]">
                  {cat.icon || "🍽"}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[15px] font-bold text-neutral-950">
                      {cat.name}
                    </span>
                    {!cat.isActive && (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-amber-700 ring-1 ring-amber-200">
                        Hidden
                      </span>
                    )}
                    <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                      /{cat.slug}
                    </code>
                  </div>
                  {cat.description && (
                    <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-500">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-1 text-[11px] text-neutral-400">
                    {cat.itemCount} item{cat.itemCount !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {/* Reorder */}
                  <div className="mr-1 flex flex-col">
                    <button
                      onClick={() => handleReorder(cat.slug, "up")}
                      disabled={i === 0}
                      className="grid h-4 w-6 place-items-center rounded text-neutral-400 transition-colors hover:text-brand-600 disabled:opacity-30"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(cat.slug, "down")}
                      disabled={i === sorted.length - 1}
                      className="grid h-4 w-6 place-items-center rounded text-neutral-400 transition-colors hover:text-brand-600 disabled:opacity-30"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggle(cat.slug)}
                    disabled={busy === cat.slug}
                    title={cat.isActive ? "Hide" : "Show"}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-all disabled:opacity-40 ${
                      cat.isActive
                        ? "text-neutral-500 hover:bg-neutral-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {cat.isActive ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleEdit(cat)}
                    disabled={busy === cat.slug}
                    title="Edit"
                    className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-all hover:bg-brand-50 hover:text-brand-600 disabled:opacity-40"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={busy === cat.slug}
                    title="Delete"
                    className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}