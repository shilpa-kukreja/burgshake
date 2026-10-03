"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Check,
  AlertCircle,
  Loader2,
  Percent,
  IndianRupee,
  Calendar,
  Tag,
  Infinity as InfinityIcon,
} from "lucide-react";
import { api } from "../../lib/api";

const EMPTY = {
  couponCode: "",
  discount: "",
  discounttype: "flat",
  expiryDate: "",
  minPurchaseAmount: "",
  maxDiscountAmount: "",
  maxUses: "",
  isActive: true,
};

/* Convert ISO → "YYYY-MM-DD" for the date input */
function toDateInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* Convert "YYYY-MM-DD" → end-of-day ISO (local time).
   A coupon expiring "31 Dec" should be valid all of 31 Dec. */
function fromDateInputValue(dateStr) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T23:59:59.999`).toISOString();
}

/* Default expiry for new coupons — 30 days from now */
function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return toDateInputValue(d);
}

export default function CouponForm({ initialData = null, mode = "new" }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => {
    if (!initialData) {
      return { ...EMPTY, expiryDate: defaultExpiry() };
    }
    return {
      couponCode: initialData.couponCode || "",
      discount: initialData.discount ?? "",
      discounttype: initialData.discounttype || "flat",
      expiryDate: toDateInputValue(initialData.expiryDate),
      minPurchaseAmount: initialData.minPurchaseAmount ?? "",
      maxDiscountAmount: initialData.maxDiscountAmount ?? "",
      maxUses: initialData.maxUses ?? "",
      isActive: initialData.isActive ?? true,
    };
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  /* ── Live preview of the discount description ── */
  const preview = (() => {
    const val = Number(form.discount) || 0;
    if (!val) return "";
    if (form.discounttype === "flat") {
      return `₹${val} off${
        form.minPurchaseAmount ? ` on orders above ₹${form.minPurchaseAmount}` : ""
      }`;
    }
    return `${val}% off${
      form.maxDiscountAmount ? ` up to ₹${form.maxDiscountAmount}` : ""
    }${
      form.minPurchaseAmount ? ` on orders above ₹${form.minPurchaseAmount}` : ""
    }`;
  })();

  /* ── Validation ──────────────────────────────── */
  const validate = () => {
    const err = {};

    if (!form.couponCode.trim()) {
      err.couponCode = "Coupon code is required";
    } else if (!/^[A-Z0-9_-]{3,20}$/.test(form.couponCode.trim().toUpperCase())) {
      err.couponCode = "3–20 characters, A–Z, 0–9, - or _";
    }

    const d = Number(form.discount);
    if (!form.discount || isNaN(d) || d <= 0) {
      err.discount = "Discount must be greater than 0";
    } else if (form.discounttype === "percent" && d > 100) {
      err.discount = "Percent discount cannot exceed 100";
    }

    if (!form.expiryDate) {
      err.expiryDate = "Expiry date is required";
    } else if (
      new Date(`${form.expiryDate}T23:59:59.999`) < new Date()
    ) {
      err.expiryDate = "Expiry date must be in the future";
    }

    if (
      form.maxDiscountAmount !== "" &&
      Number(form.maxDiscountAmount) <= 0
    ) {
      err.maxDiscountAmount = "Must be greater than 0";
    }

    if (form.maxUses !== "" && Number(form.maxUses) <= 0) {
      err.maxUses = "Must be greater than 0";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ── Submit ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      couponCode: form.couponCode.trim().toUpperCase(),
      discount: Number(form.discount),
      discounttype: form.discounttype,
      expiryDate: fromDateInputValue(form.expiryDate),
      minPurchaseAmount: Number(form.minPurchaseAmount) || 0,
      maxDiscountAmount:
        form.discounttype === "percent" && form.maxDiscountAmount !== ""
          ? Number(form.maxDiscountAmount)
          : null,
      maxUses: form.maxUses !== "" ? Number(form.maxUses) : null,
      isActive: form.isActive,
    };

    try {
      if (isEdit) {
        await api.adminUpdateCoupon(initialData._id, payload);
      } else {
        await api.adminCreateCoupon(payload);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin/coupons"), 700);
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
      <Section title="Coupon Code" subtitle="Customers will type this at checkout">
        <Field
          label="Code"
          value={form.couponCode}
          onChange={(v) => update("couponCode", v.toUpperCase())}
          placeholder="WELCOME50"
          error={errors.couponCode}
          hint="Letters, numbers, dash or underscore. 3–20 chars."
          required
          mono
        />
      </Section>

      {/* ═══ DISCOUNT ════════════════════════════ */}
      <Section
        title="Discount"
        subtitle={preview || "Flat ₹ or percentage off"}
      >
        {/* Type selector — segmented */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            Discount Type <span className="text-brand-500">*</span>
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { id: "flat", label: "Flat amount", Icon: IndianRupee },
              { id: "percent", label: "Percentage", Icon: Percent },
            ].map(({ id, label, Icon }) => {
              const active = form.discounttype === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => update("discounttype", id)}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[13px] font-bold transition-all ${
                    active
                      ? "border-brand-500 bg-brand-50/60 text-brand-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-brand-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label={form.discounttype === "percent" ? "Discount (%)" : "Discount (₹)"}
            type="number"
            value={form.discount}
            onChange={(v) => update("discount", v)}
            placeholder={form.discounttype === "percent" ? "10" : "50"}
            error={errors.discount}
            required
          />

          <Field
            label="Min Order (₹)"
            type="number"
            value={form.minPurchaseAmount}
            onChange={(v) => update("minPurchaseAmount", v)}
            placeholder="0"
            hint="0 = no minimum"
          />

          {/* Max discount only shown for percent */}
          {form.discounttype === "percent" ? (
            <Field
              label="Max Discount (₹)"
              type="number"
              value={form.maxDiscountAmount}
              onChange={(v) => update("maxDiscountAmount", v)}
              placeholder="100"
              error={errors.maxDiscountAmount}
              hint="Leave blank for no cap"
            />
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </Section>

      {/* ═══ VALIDITY ════════════════════════════ */}
      <Section title="Validity" subtitle="When this coupon stops working">
        <Field
          label="Expires On"
          type="date"
          value={form.expiryDate}
          onChange={(v) => update("expiryDate", v)}
          error={errors.expiryDate}
          hint="Valid through the end of this day"
          required
        />
      </Section>

      {/* ═══ USAGE LIMIT ═════════════════════════ */}
      <Section
        title="Usage Limit"
        subtitle="Optional cap on how many times this can be used"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Max Uses"
            type="number"
            value={form.maxUses}
            onChange={(v) => update("maxUses", v)}
            placeholder="Unlimited"
            error={errors.maxUses}
            hint="Leave blank for unlimited"
          />

          {isEdit && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                Used So Far
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-[13.5px] font-bold tabular-nums text-neutral-700">
                {initialData.usedCount || 0}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* ═══ VISIBILITY ══════════════════════════ */}
      <Section title="Visibility">
        <button
          type="button"
          onClick={() => update("isActive", !form.isActive)}
          className={`flex w-full items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
            form.isActive
              ? "border-brand-500 bg-brand-50/60"
              : "border-neutral-200 bg-white hover:border-brand-200"
          }`}
        >
          <div>
            <div className="text-[13px] font-bold text-neutral-900">
              {form.isActive ? "Active" : "Inactive"}
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-500">
              {form.isActive
                ? "Customers can use this coupon"
                : "Hidden from customers — saved but disabled"}
            </div>
          </div>
          <span
            className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              form.isActive ? "bg-brand-500" : "bg-neutral-300"
            }`}
          >
            <span
              className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow transition-all ${
                form.isActive ? "left-[18px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
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
              {isEdit ? "Save changes" : "Create coupon"}
            </>
          )}
        </button>
      </div>
    </form>
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
  mono,
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
        className={`mt-2 w-full rounded-2xl border bg-white py-3 px-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:ring-4 ${
          mono ? "font-mono tracking-[0.08em] uppercase" : ""
        } ${
          error
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