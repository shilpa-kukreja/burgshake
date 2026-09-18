"use client";

import { useState, useEffect, useMemo } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  CreditCard,
  Wallet,
  Tag,
  ShoppingBag,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/* ─── Static data (will move to backend later) ───────── */
const OUTLETS = [
  {
    id: "bandra",
    name: "Bandra West",
    address: "12 Linking Road, Bandra West, Mumbai",
  },
  {
    id: "andheri",
    name: "Andheri East",
    address: "45 MIDC Road, Andheri East, Mumbai",
  },
];

const PAYMENT_METHODS = [
  {
    id: "razorpay",
    label: "Pay Online",
    desc: "UPI · Card · Netbanking · Wallet",
    Icon: CreditCard,
  },
  {
    id: "counter",
    label: "Pay at Counter",
    desc: "Cash or card when you pick up",
    Icon: Wallet,
  },
];

/* Generate time slots 11:00 AM → 10:30 PM in 30-min steps */
function generateTimeSlots() {
  const slots = [];
  for (let h = 11; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h < 12 ? "AM" : "PM";
      const mm = m.toString().padStart(2, "0");
      slots.push({
        value: `${h.toString().padStart(2, "0")}:${mm}`,
        label: `${hour12}:${mm} ${ampm}`,
        hour: h,
        minute: m,
      });
    }
  }
  return slots;
}

const STEPS = [
  { id: 1, label: "Pickup Details" },
  { id: 2, label: "Your Info" },
  { id: 3, label: "Payment" },
];

/* Fake coupon codes for demo */
const DEMO_COUPONS = {
  WELCOME50: { type: "flat", value: 50, min: 200, label: "₹50 off on ₹200+" },
  TAKE10: { type: "percent", value: 10, min: 300, max: 100, label: "10% off up to ₹100" },
  FRESH20: { type: "flat", value: 20, min: 150, label: "₹20 off on ₹150+" },
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CheckoutModal({ open, onClose }) {
  const { items, subtotal, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [outlet, setOutlet] = useState("bandra");
  const [date, setDate] = useState("today");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showSlots, setShowSlots] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const { user, addOrder, updateProfile } = useAuth();

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  /* Reset when modal opens */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ── Auto-fill from logged-in user when modal opens ── */
useEffect(() => {
  if (!open) return;

  /* Logged-in user → prefill from profile */
  if (user) {
    setName((prev) => prev || user.name || "");
    setPhone((prev) => prev || user.phone || "");
    setEmail((prev) => prev || user.email || "");
    return;
  }

  /* Guest → prefill from their last order */
  try {
    const raw = localStorage.getItem("burgshake_last_order");
    if (!raw) return;
    const last = JSON.parse(raw);
    if (!last?.customer) return;

    setName((prev) => prev || last.customer.name || "");
    setPhone((prev) => prev || last.customer.phone || "");
    setEmail((prev) => prev || last.customer.email || "");
  } catch {}
}, [open, user]);

  /* ESC closes (unless placing order) */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !placing && !orderNumber) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [placing, orderNumber]);

  /* ── Computed ─────────────────────────────────────── */
  const tax = Math.round(subtotal * 0.05);
  const gross = subtotal + tax;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const c = DEMO_COUPONS[appliedCoupon];
    if (!c) return 0;
    if (subtotal < c.min) return 0;
    if (c.type === "flat") return c.value;
    if (c.type === "percent") {
      const amt = Math.round((subtotal * c.value) / 100);
      return c.max ? Math.min(amt, c.max) : amt;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, gross - discount);

  /* ── Handlers ─────────────────────────────────────── */
  const handleClose = () => {
    if (placing) return;
    if (orderNumber) {
      /* After success, closing also resets */
      resetAll();
    }
    onClose();
  };

  const resetAll = () => {
    setStep(1);
    setOutlet("bandra");
    setDate("today");
    setTimeSlot("");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setPayment("razorpay");
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponError("");
    setOrderNumber(null);
  };

  const canGoNext = () => {
    if (step === 1) return outlet && date && timeSlot;
    if (step === 2)
      return (
        name.trim().length >= 2 &&
        /^\d{10}$/.test(phone) &&
        /^\S+@\S+\.\S+$/.test(email)
      );
    return true;
  };

  const nextStep = () => {
    if (!canGoNext()) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a code to continue");
      return;
    }
    const c = DEMO_COUPONS[code];
    if (!c) {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    if (subtotal < c.min) {
      setCouponError(`Minimum order ₹${c.min} required`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(code);
    setCouponError("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

const placeOrder = async () => {
  setPlacing(true);

  /* Simulate network delay — replace with backend call later */
  await new Promise((r) => setTimeout(r, 1400));

  const num = `BS-${new Date().getFullYear()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  /* ═══ BUILD ORDER SNAPSHOT ═══════════════════════ */
  const orderSnapshot = {
    orderNumber: num,
    placedAt: new Date().toISOString(),
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty || 1,
      img: i.img,
    })),
    subtotal,
    tax,
    discount,
    couponCode: appliedCoupon,
    total,
    outlet: selectedOutlet,
    date,
    timeSlot,
    timeSlotLabel: timeSlots.find((s) => s.value === timeSlot)?.label,
    customer: { name, phone, email },
    notes,
    payment,
    paymentLabel: payment === "razorpay" ? "Paid Online" : "Pay at Counter",
  };

  /* ═══ SAVE FOR /order-success PAGE (optional) ════ */
  try {
    localStorage.setItem(
      "burgshake_last_order",
      JSON.stringify(orderSnapshot)
    );
  } catch (e) {
    console.error("Save order snapshot error:", e);
  }

  /* ═══ SAVE TO ORDER HISTORY → shows in /account ══ */
  addOrder({
    ...orderSnapshot,
    id: orderSnapshot.orderNumber,
    customer: {
      name,
      phone,
      email: email || user?.email || "guest@burgshake.com",
    },
  });

  /* ═══ SAVE DETAILS BACK TO USER PROFILE ══════════ */
  if (user && updateProfile) {
    const patch = {};
    if (name.trim().length >= 2 && name.trim() !== user.name)
      patch.name = name.trim();
    if (/^\d{10}$/.test(phone) && phone !== user.phone)
      patch.phone = phone;
    if (/^\S+@\S+\.\S+$/.test(email) && email !== user.email)
      patch.email = email.toLowerCase();

    if (Object.keys(patch).length > 0) {
      updateProfile(patch);
    }
  }

  /* ═══ UPDATE UI ══════════════════════════════════ */
  setOrderNumber(num);
  setPlacing(false);

  /* In production: only clear cart on successful Razorpay verify */
  clearCart();
};

  if (!open) return null;

  const selectedOutlet = OUTLETS.find((o) => o.id === outlet);

  /* ═══════════════════════════════════════════════
     SUCCESS SCREEN
     ═══════════════════════════════════════════════ */
  if (orderNumber) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
          {/* Success header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-10 text-center text-white">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/20 ring-4 ring-white/30 backdrop-blur-sm">
                <Check className="h-8 w-8" strokeWidth={3} />
              </div>
              <h2 className="mt-5 font-display text-[22px] font-bold tracking-[-0.01em]">
                Order Confirmed!
              </h2>
              <p className="mt-2 text-[13px] text-white/85">
                We&apos;ll message you when it&apos;s ready for pickup.
              </p>
            </div>
          </div>

          {/* Order number */}
          <div className="px-6 py-5 text-center">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              Order Number
            </div>
            <div className="mt-1.5 font-display text-[20px] font-extrabold tracking-tight text-neutral-950">
              {orderNumber}
            </div>
          </div>

          {/* Pickup info */}
          <div className="mx-6 mb-5 space-y-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
              <div className="leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                  Pickup at
                </div>
                <div className="mt-1 text-[13px] font-bold text-neutral-900">
                  {selectedOutlet?.name}
                </div>
                <div className="mt-0.5 text-[11.5px] text-neutral-500">
                  {selectedOutlet?.address}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-brand-100" />

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-brand-600" />
              <div className="leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">
                  Ready by
                </div>
                <div className="mt-1 text-[13px] font-bold text-neutral-900">
                  {date === "today" ? "Today" : "Tomorrow"},{" "}
                  {timeSlots.find((s) => s.value === timeSlot)?.label}
                </div>
              </div>
            </div>
          </div>

          {/* Total paid */}
          <div className="mx-6 mb-6 flex items-baseline justify-between border-t border-neutral-200/70 pt-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              {payment === "razorpay" ? "Paid" : "Pay at counter"}
            </span>
            <span className="font-display text-[20px] font-extrabold text-neutral-950">
              ₹{total}
            </span>
          </div>

          {/* Show at counter note */}
          <div className="mx-6 mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[12px] leading-[1.55] text-amber-800">
              <strong className="font-bold">Important:</strong> Show this order
              number at the counter. No home delivery — please collect at the
              scheduled time.
            </p>
          </div>

          {/* Done button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleClose}
              className="w-full rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     MAIN CHECKOUT MODAL
     ═══════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-[#FDFCFB] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] lg:h-auto"
      >
        {/* Warm glow */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        >
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.14)_0%,_transparent_65%)]" />
        </div> */}

        {/* ═══ HEADER ═══════════════════════════════ */}
        <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200/70 px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-600">
              <span className="h-px w-5 bg-brand-500" />
              Checkout · Takeaway
            </div>
            <h2 className="mt-1.5 font-display text-[17px] font-bold tracking-[-0.01em] text-neutral-950 sm:text-[19px]">
              {STEPS[step - 1].label}
            </h2>
          </div>

          <button
            onClick={handleClose}
            disabled={placing}
            aria-label="Close checkout"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:rotate-90 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* ═══ STEP INDICATOR ══════════════════════ */}
        <div className="relative shrink-0 border-b border-neutral-200/70 bg-white/50 px-5 py-3.5 sm:px-7">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                          ? "bg-neutral-950 text-white ring-4 ring-neutral-950/10"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      {done ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : (
                        s.id
                      )}
                    </span>
                    <span
                      className={`hidden text-[11.5px] font-bold uppercase tracking-[0.12em] transition-colors sm:block ${
                        active
                          ? "text-neutral-900"
                          : done
                          ? "text-emerald-600"
                          : "text-neutral-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {i < STEPS.length - 1 && (
                    <span
                      className={`h-px flex-1 transition-colors duration-500 ${
                        step > s.id ? "bg-emerald-500" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ BODY ════════════════════════════════ */}
        <div className="relative flex-1 overflow-y-auto">
          <div className="grid lg:grid-cols-12">

            {/* ── LEFT: Step content ────────────── */}
            <div className="p-5 sm:p-7 lg:col-span-7">
              {/* ═══ STEP 1: Pickup ═══════════ */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Outlet */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <MapPin className="h-3 w-3" />
                      Pickup Outlet
                    </label>
                    <div className="mt-3 space-y-2.5">
                      {OUTLETS.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => setOutlet(o.id)}
                          className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
                            outlet === o.id
                              ? "border-brand-500 bg-brand-50/60 shadow-[0_10px_26px_-14px_rgba(249,115,22,0.5)]"
                              : "border-neutral-200 bg-white hover:border-brand-200"
                          }`}
                        >
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                              outlet === o.id
                                ? "bg-brand-500 text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            <MapPin className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-display text-[14.5px] font-bold tracking-[-0.01em] text-neutral-950">
                              {o.name}
                            </div>
                            <div className="mt-1 text-[12px] leading-[1.55] text-neutral-500">
                              {o.address}
                            </div>
                          </div>
                          {outlet === o.id && (
                            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-white">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      Pickup Date
                    </label>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { id: "today", label: "Today", sub: "Fastest option" },
                        { id: "tomorrow", label: "Tomorrow", sub: "Pre-order" },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => {
                            setDate(d.id);
                            setTimeSlot("");
                          }}
                          className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                            date === d.id
                              ? "border-brand-500 bg-brand-50/60"
                              : "border-neutral-200 bg-white hover:border-brand-200"
                          }`}
                        >
                          <span
                            className={`text-[13px] font-bold ${
                              date === d.id
                                ? "text-brand-700"
                                : "text-neutral-800"
                            }`}
                          >
                            {d.label}
                          </span>
                          <span className="mt-0.5 text-[10.5px] font-medium text-neutral-500">
                            {d.sub}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <button
                      onClick={() => setShowSlots((v) => !v)}
                      className="flex w-full items-center justify-between"
                    >
                      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                        <Clock className="h-3 w-3" />
                        Pickup Time
                      </span>
                      {showSlots ? (
                        <ChevronUp className="h-3.5 w-3.5 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                      )}
                    </button>

                    {showSlots && (
                      <>
                        <div className="mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-neutral-200/70 bg-white p-3 sm:grid-cols-4">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => setTimeSlot(slot.value)}
                              className={`rounded-xl border px-2 py-2 text-[12px] font-bold tabular-nums transition-all duration-200 ${
                                timeSlot === slot.value
                                  ? "border-brand-500 bg-brand-500 text-white shadow-[0_8px_20px_-10px_rgba(249,115,22,0.6)]"
                                  : "border-neutral-200 bg-white text-neutral-700 hover:border-brand-300 hover:text-brand-600"
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                        <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                          Kitchen closes at 10:30 PM
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ STEP 2: Your Info ═══════ */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Full Name
                    </label>
                    <div className="relative mt-2.5">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Mehta"
                        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-4 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Phone Number
                    </label>
                    <div className="relative mt-2.5">
                      <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <span className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-neutral-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="98765 43210"
                        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-[88px] pr-4 text-[14px] font-medium tabular-nums text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      />
                      {phone.length === 10 && (
                        <Check className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" strokeWidth={3} />
                      )}
                    </div>
                    <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                      We&apos;ll send your order updates via SMS.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Email Address
                    </label>
                    <div className="relative mt-2.5">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-4 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                    <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                      Your order confirmation will be sent here.
                    </p>
                  </div>

                  {/* Special instructions */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Special Instructions{" "}
                      <span className="font-medium text-neutral-400">(optional)</span>
                    </label>
                    <div className="relative mt-2.5">
                      <MessageSquare className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-neutral-400" />
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                        placeholder="No onions, extra spicy, allergy notes…"
                        rows={3}
                        className="w-full resize-none rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-4 text-[13.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      />
                      <span className="absolute bottom-2.5 right-4 text-[10px] font-semibold tabular-nums text-neutral-400">
                        {notes.length}/200
                      </span>
                    </div>
                  </div>

                  {/* Info note */}
                  <div className="flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <p className="text-[11.5px] leading-[1.6] text-brand-800">
                      This is a <strong>takeaway-only</strong> order. No home
                      delivery — please collect at your selected time.
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3: Payment ═════════ */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Payment methods */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <CreditCard className="h-3 w-3" />
                      Payment Method
                    </label>
                    <div className="mt-3 space-y-2.5">
                      {PAYMENT_METHODS.map(({ id, label, desc, Icon }) => (
                        <button
                          key={id}
                          onClick={() => setPayment(id)}
                          className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-300 ${
                            payment === id
                              ? "border-brand-500 bg-brand-50/60 shadow-[0_10px_26px_-14px_rgba(249,115,22,0.5)]"
                              : "border-neutral-200 bg-white hover:border-brand-200"
                          }`}
                        >
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                              payment === id
                                ? "bg-brand-500 text-white"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-display text-[14px] font-bold text-neutral-950">
                              {label}
                            </div>
                            <div className="mt-0.5 text-[11.5px] text-neutral-500">
                              {desc}
                            </div>
                          </div>
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-all ${
                              payment === id
                                ? "border-brand-500 bg-brand-500"
                                : "border-neutral-300 bg-white"
                            }`}
                          >
                            {payment === id && (
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Coupon */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <Tag className="h-3 w-3" />
                      Coupon Code
                    </label>

                    {appliedCoupon ? (
                      /* Applied state */
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
                            <Check className="h-4 w-4" strokeWidth={3} />
                          </span>
                          <div className="leading-tight">
                            <div className="text-[13px] font-bold text-emerald-800">
                              {appliedCoupon}
                            </div>
                            <div className="mt-0.5 text-[11px] font-medium text-emerald-600">
                              You saved ₹{discount}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-emerald-700 underline-offset-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      /* Input state */
                      <>
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            placeholder="WELCOME50"
                            className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.1em] text-neutral-900 placeholder:text-neutral-300 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                          />
                          <button
                            onClick={applyCoupon}
                            className="shrink-0 rounded-2xl bg-neutral-950 px-5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500"
                          >
                            Apply
                          </button>
                        </div>

                        {couponError && (
                          <div className="mt-2.5 flex items-center gap-2 text-[11.5px] font-semibold text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {couponError}
                          </div>
                        )}

                        {/* Available demo coupons */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {Object.entries(DEMO_COUPONS).map(([code, c]) => (
                            <button
                              key={code}
                              onClick={() => {
                                setCouponCode(code);
                                setCouponError("");
                              }}
                              className="rounded-full border border-dashed border-neutral-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500 transition-all hover:border-brand-400 hover:text-brand-600"
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-start gap-2.5 rounded-2xl border border-neutral-200/70 bg-white/70 p-3.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    <p className="text-[11.5px] leading-[1.6] text-neutral-600">
                      {payment === "razorpay"
                        ? "You'll be redirected to a secure Razorpay window to complete payment."
                        : "Please pay in cash or by card at the counter when you collect your order."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Order summary ──────────── */}
            <div className="border-t border-neutral-200/70 bg-[#FFF6EC] p-5 sm:p-7 lg:col-span-5 lg:border-l lg:border-t-0">
              <div className="lg:sticky lg:top-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
                    Order Summary
                  </h3>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-600">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {/* Items */}
                <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-neutral-200/70 bg-white p-2.5"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-neutral-950 px-1 text-[9.5px] font-bold text-white ring-2 ring-white">
                          {item.qty || 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-bold text-neutral-900">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[10.5px] font-medium text-neutral-400">
                          ₹{item.price} × {item.qty || 1}
                        </div>
                      </div>
                      <div className="shrink-0 font-display text-[13px] font-bold tabular-nums text-neutral-900">
                        ₹{item.price * (item.qty || 1)}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="mt-5 space-y-2.5 border-t border-neutral-300/50 pt-5">
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-semibold tabular-nums text-neutral-900">
                      ₹{subtotal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <span className="text-neutral-500">Taxes (5% GST)</span>
                    <span className="font-semibold tabular-nums text-neutral-900">
                      ₹{tax}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-[12.5px] text-emerald-700">
                      <span>Discount ({appliedCoupon})</span>
                      <span className="font-semibold tabular-nums">
                        −₹{discount}
                      </span>
                    </div>
                  )}
                  <div className="my-2 h-px w-full bg-neutral-300/50" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Total
                    </span>
                    <span className="font-display text-[22px] font-extrabold tabular-nums tracking-[-0.01em] text-neutral-950">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Trust note */}
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-white/60 px-3 py-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                    Secure · Razorpay · SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ══════════════════════════════ */}
        <footer className="relative flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200/70 bg-white px-5 py-4 sm:px-7 sm:py-5">
          {step > 1 ? (
            <button
              onClick={prevStep}
              disabled={placing}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-[12.5px] font-bold text-neutral-700 transition-all duration-300 hover:border-neutral-950 hover:bg-neutral-50 disabled:opacity-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[12.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none disabled:hover:bg-neutral-300"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              onClick={placeOrder}
              disabled={placing}
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3 text-[12.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {placing ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing…
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {payment === "razorpay"
                    ? `Pay ₹${total}`
                    : `Place Order · ₹${total}`}
                </>
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}