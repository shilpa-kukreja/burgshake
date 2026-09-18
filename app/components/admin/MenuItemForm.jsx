"use client";

import { useState, useRef, useMemo , useEffect} from "react";
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
  Sparkles,
  Wand2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api } from "../../lib/api";


const DIETARY_OPTIONS = [
  { id: "veg", label: "Vegetarian" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "spicy", label: "Spicy" },
];

const EMPTY = {
  name: "",
  desc: "",
  price: "",
  mrp: "",
  img: "",
  gallery: [],
  tag: "",
  rating: 4.5,
  reviews: 0,
  dietary: [],
  category: "",
  serves: "1 person",
  prepTime: "12–15 min",
  ingredients: [],
  allergens: [],
  nutrition: {
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    sodium: "",
  },
  isFeatured: false,
  isBestseller: false,
  isAvailable: true,
  sortOrder: 0,
};

/* ═══════════════════════════════════════════════ */
export default function MenuItemForm({ initialData = null, mode = "new" }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialData || {}),
  }));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const updateNutrition = (key, value) => {
    setForm((f) => ({
      ...f,
      nutrition: { ...f.nutrition, [key]: value },
    }));
  };

  const toggleArrayItem = (key, value) => {
    setForm((f) => {
      const arr = f[key] || [];
      return {
        ...f,
        [key]: arr.includes(value)
          ? arr.filter((x) => x !== value)
          : [...arr, value],
      };
    });
  };

  /* ── Slug preview ────────────────────────────── */
  const slugPreview = useMemo(() => {
    return (form.name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, [form.name]);

  /* ── Tags (ingredients / allergens) ──────────── */
  const [ingredientInput, setIngredientInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);


  const addIngredient = () => {
    const v = ingredientInput.trim();
    if (!v) return;
    if (!form.ingredients.includes(v))
      update("ingredients", [...form.ingredients, v]);
    setIngredientInput("");
  };
  const removeIngredient = (item) =>
    update("ingredients", form.ingredients.filter((x) => x !== item));

  const addAllergen = () => {
    const v = allergenInput.trim();
    if (!v) return;
    if (!form.allergens.includes(v))
      update("allergens", [...form.allergens, v]);
    setAllergenInput("");
  };
  const removeAllergen = (item) =>
    update("allergens", form.allergens.filter((x) => x !== item));


  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.adminListCategories();
        if (active) {
          const activeCats = res.data.categories.filter((c) => c.isActive);
          setCategories(activeCats);
          /* If new item and no category selected, pick first */
          if (!isEdit && activeCats.length > 0 && !form.category) {
            update("category", activeCats[0].slug);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setCatLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);


  /* ── Validation ──────────────────────────────── */
  const validate = () => {
    const err = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      err.name = "Name is required (min 2 chars)";
    if (!form.desc.trim() || form.desc.trim().length < 10)
      err.desc = "Description must be at least 10 characters";
    if (!form.price || Number(form.price) <= 0)
      err.price = "Price must be greater than 0";
    if (!form.img?.trim())
      err.img = "Please upload a main image";
    if (!form.category) err.category = "Category is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ── Submit ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      img: form.img.trim(),
      gallery: form.gallery.filter(Boolean),
      tag: form.tag?.trim() || "",
      rating: Number(form.rating) || 4.5,
      reviews: Number(form.reviews) || 0,
      dietary: form.dietary,
      category: form.category,
      serves: form.serves || "1 person",
      prepTime: form.prepTime || "12–15 min",
      ingredients: form.ingredients,
      allergens: form.allergens,
      nutrition: {
        calories: Number(form.nutrition.calories) || 0,
        protein: form.nutrition.protein || "—",
        carbs: form.nutrition.carbs || "—",
        fat: form.nutrition.fat || "—",
        sodium: form.nutrition.sodium || "—",
      },
      isFeatured: form.isFeatured,
      isBestseller: form.isBestseller,
      isAvailable: form.isAvailable,
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (isEdit) {
        await api.adminUpdateMenu(initialData.slug, payload);
      } else {
        await api.adminCreateMenu(payload);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/menu"), 800);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSaving(false);
    }
  };

  /* ══════════════════════════════════════════ */
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

      {/* ═══ BASIC INFO ══════════════════════════ */}
      <Section title="Basic Info" subtitle="Name, category, and slug">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Truffle Mushroom Burger"
              error={errors.name}
              required
            />

            {/* Slug preview */}
            {form.name && (
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-neutral-400">
                  URL slug:
                </span>
                <code className="rounded bg-brand-50 px-2 py-0.5 font-mono text-brand-700">
                  /menu/{slugPreview || "..."}
                </code>
                {isEdit && (
                  <span className="text-neutral-400">(locked once created)</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Category <span className="text-brand-500">*</span>
            </label>
            {catLoading ? (
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[12.5px] text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading categories…
              </div>
            ) : categories.length === 0 ? (
              <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 px-4 py-3">
                <p className="text-[12.5px] text-amber-800">
                  No categories yet. Create one first.
                </p>
                <a
                  href="/admin/categories"
                  className="shrink-0 rounded-full bg-amber-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-amber-700"
                >
                  Add category
                </a>
              </div>
            ) : (
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon ? `${c.icon} ` : ""}
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Field
            label="Tag (optional)"
            value={form.tag}
            onChange={(v) => update("tag", v)}
            placeholder="Bestseller / New"
            hint="Badge on the card"
          />
        </div>

        {/* Markdown description */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Description <span className="text-brand-500">*</span>
          </label>
          <p className="mt-1 text-[10.5px] text-neutral-400">
            Supports markdown — **bold**, _italic_, ## headings, - lists
          </p>
          <MarkdownEditor
            value={form.desc}
            onChange={(v) => update("desc", v)}
            error={errors.desc}
          />
        </div>
      </Section>

      {/* ═══ PRICING ═════════════════════════════ */}
      <Section title="Pricing">
        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Price (₹)"
            type="number"
            value={form.price}
            onChange={(v) => update("price", v)}
            placeholder="249"
            error={errors.price}
            required
          />
          <Field
            label="MRP (₹) — optional"
            type="number"
            value={form.mrp}
            onChange={(v) => update("mrp", v)}
            placeholder="299"
            hint="Struck-through price"
          />
          <Field
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(v) => update("sortOrder", v)}
            placeholder="0"
            hint="Lower = first"
          />
        </div>
      </Section>

      {/* ═══ IMAGES ══════════════════════════════ */}
      <Section title="Images" subtitle="Upload main and gallery images">
        <ImageUpload
          label="Main Image"
          value={form.img}
          onChange={(url) => update("img", url)}
          error={errors.img}
          required
        />

        <GalleryUpload
          images={form.gallery}
          onChange={(urls) => update("gallery", urls)}
        />
      </Section>

      {/* ═══ DIETARY ═════════════════════════════ */}
      <Section title="Dietary" subtitle="Filters for customers">
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((d) => {
            const active = form.dietary.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleArrayItem("dietary", d.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-wider transition-all ${active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                  }`}
              >
                {active && <Check className="h-3 w-3" strokeWidth={3} />}
                {d.label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ═══ DETAILS ═════════════════════════════ */}
      <Section
        title="Details"
        subtitle="Serves, prep time, ingredients, allergens"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Serves"
            value={form.serves}
            onChange={(v) => update("serves", v)}
            placeholder="1 person"
          />
          <Field
            label="Prep Time"
            value={form.prepTime}
            onChange={(v) => update("prepTime", v)}
            placeholder="12–15 min"
          />
        </div>

        <TagList
          label="Ingredients"
          items={form.ingredients}
          input={ingredientInput}
          setInput={setIngredientInput}
          onAdd={addIngredient}
          onRemove={removeIngredient}
          placeholder="Double beef patty (140g)"
        />

        <TagList
          label="Allergens"
          items={form.allergens}
          input={allergenInput}
          setInput={setAllergenInput}
          onAdd={addAllergen}
          onRemove={removeAllergen}
          placeholder="Gluten / Dairy / Eggs"
        />
      </Section>

      {/* ═══ NUTRITION ═══════════════════════════ */}
      <Section title="Nutrition" subtitle="Per serving (optional)">
        <div className="grid gap-4 sm:grid-cols-5">
          <Field
            label="Calories"
            type="number"
            value={form.nutrition.calories}
            onChange={(v) => updateNutrition("calories", v)}
            placeholder="620"
          />
          <Field
            label="Protein"
            value={form.nutrition.protein}
            onChange={(v) => updateNutrition("protein", v)}
            placeholder="32g"
          />
          <Field
            label="Carbs"
            value={form.nutrition.carbs}
            onChange={(v) => updateNutrition("carbs", v)}
            placeholder="48g"
          />
          <Field
            label="Fat"
            value={form.nutrition.fat}
            onChange={(v) => updateNutrition("fat", v)}
            placeholder="34g"
          />
          <Field
            label="Sodium"
            value={form.nutrition.sodium}
            onChange={(v) => updateNutrition("sodium", v)}
            placeholder="820mg"
          />
        </div>
      </Section>

      {/* ═══ VISIBILITY ══════════════════════════ */}
      <Section title="Visibility" subtitle="Where this item appears">
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle
            label="Available"
            desc="Show on menu to customers"
            active={form.isAvailable}
            onChange={() => update("isAvailable", !form.isAvailable)}
          />
          <Toggle
            label="Bestseller"
            desc="Show on home page slider"
            active={form.isBestseller}
            onChange={() => update("isBestseller", !form.isBestseller)}
          />
          <Toggle
            label="Chef's Pick"
            desc="Show on menu featured section"
            active={form.isFeatured}
            onChange={() => update("isFeatured", !form.isFeatured)}
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
          className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${success
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
              {isEdit ? "Save changes" : "Create item"}
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
      className={`mt-2 overflow-hidden rounded-2xl border bg-white transition-all ${error
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
          onChange={(e) => onChange(e.target.value.slice(0, 2000))}
          rows={6}
          placeholder="**Double smashed patty** with aged cheddar, house sauce, and a soft brioche bun."
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
          {value.length}/2000
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   IMAGE UPLOAD — single
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
        <div className="group relative mt-2 h-40 w-40 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
          <img
            src={value}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-neutral-950/60 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-700 transition-colors hover:bg-brand-500 hover:text-white"
              title="Replace"
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-700 transition-colors hover:bg-red-500 hover:text-white"
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
          className={`mt-2 flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-neutral-50 transition-all hover:border-brand-400 hover:bg-brand-50/50 disabled:opacity-60 ${error ? "border-red-300" : "border-neutral-300"
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-neutral-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Click to upload
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
   GALLERY UPLOAD — multiple
   ══════════════════════════════════════════════════ */
function GalleryUpload({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await api.uploadMultiple(fd);
      onChange([...images, ...res.data.urls]);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (idx) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        Gallery <span className="text-neutral-400">(optional)</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="mt-2 flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative h-24 w-24 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
          >
            <img
              src={url}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              title="Remove"
            >
              <X className="h-3 w-3" strokeWidth={3} />
            </button>
          </div>
        ))}

        {/* Upload tile */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-all hover:border-brand-400 hover:bg-brand-50/50 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-neutral-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Add more
              </span>
            </>
          )}
        </button>
      </div>

      {images.length === 0 && (
        <p className="mt-2 text-[10.5px] text-neutral-400">
          Optional — add multiple angles for the product page.
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  type = "text",
  required,
  disabled,
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`mt-2 w-full rounded-2xl border bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:ring-4 disabled:bg-neutral-50 disabled:text-neutral-500 ${error
            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
            : "border-neutral-200 focus:border-brand-400 focus:ring-brand-100"
          }`}
      />
      {error && (
        <p className="mt-1.5 text-[11px] font-semibold text-red-600">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-[10.5px] text-neutral-400">{hint}</p>
      )}
    </div>
  );
}

function TagList({
  label,
  items,
  input,
  setInput,
  onAdd,
  onRemove,
  placeholder,
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-2xl border border-neutral-200 bg-white py-3 px-4 text-[13px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-2xl bg-neutral-950 px-4 text-[12.5px] font-bold text-white transition-all hover:bg-brand-500"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="grid h-3.5 w-3.5 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-red-100 hover:text-red-500"
              >
                <X className="h-2.5 w-2.5" strokeWidth={3} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, desc, active, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${active
          ? "border-brand-500 bg-brand-50/60"
          : "border-neutral-200 bg-white hover:border-brand-200"
        }`}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-bold text-neutral-900">{label}</div>
        <div className="mt-0.5 text-[11px] text-neutral-500">{desc}</div>
      </div>
      <span
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${active ? "bg-brand-500" : "bg-neutral-300"
          }`}
      >
        <span
          className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${active ? "left-[18px]" : "left-0.5"
            }`}
        />
      </span>
    </button>
  );
}