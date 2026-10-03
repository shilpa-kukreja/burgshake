"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Router,
  Download,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { loadRazorpayScript, getRazorpayKeyId } from "../lib/razorpay";
import { generateOrderReceipt } from "../lib/userreceipt";


/* ─── Static data ───────────────────────────────────── */
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

/* Orders of ₹500 or more → must pay online
   Orders below ₹500 → pay at counter */
const ONLINE_PAYMENT_THRESHOLD = 500;

const PAYMENT_METHODS = {
  razorpay: {
    id: "razorpay",
    label: "Pay Online",
    desc: "UPI · Card · Netbanking · Wallet",
    Icon: CreditCard,
  },
  counter: {
    id: "counter",
    label: "Pay at Counter",
    desc: "Cash or card when you pick up",
    Icon: Wallet,
  },
};

const STEPS = [
  { id: 1, label: "Pickup Details" },
  { id: 2, label: "Your Info" },
  { id: 3, label: "Payment" },
];

/* ─── Time helpers ─────────────────────────────────── */
const PREP_BUFFER_MINUTES = 15;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function generateTimeSlots() {
  const slots = [];
  for (let h = 11; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 22 && m > 30) continue;
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

function buildDateOptions() {
  const today = new Date();
  const options = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = toLocalDateStr(d);

    let prefix;
    if (i === 0) prefix = "Today";
    else if (i === 1) prefix = "Tomorrow";
    else prefix = WEEKDAYS[d.getDay()];

    options.push({
      value,
      label: `${prefix}, ${d.getDate()} ${MONTHS[d.getMonth()]}`,
      isToday: i === 0,
    });
  }
  return options;
}

/* Short human label for a coupon chip, e.g. "₹50 off on ₹200+" */
function couponLabel(c) {
  if (!c) return "";
  const val = c.discount;
  if (c.discounttype === "flat") {
    return `₹${val} off${c.minPurchaseAmount ? ` on ₹${c.minPurchaseAmount}+` : ""}`;
  }
  const cap = c.maxDiscountAmount ? ` up to ₹${c.maxDiscountAmount}` : "";
  const min = c.minPurchaseAmount ? ` · ₹${c.minPurchaseAmount}+` : "";
  return `${val}% off${cap}${min}`;
}

const ALL_TIME_SLOTS = generateTimeSlots();

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CheckoutModal({ open, onClose }) {

const router = useRouter();

 const { items, subtotal, clearCart, closeCart } = useCart();
 const { closeWishlist } = useWishlist();


  const [step, setStep] = useState(1);
  const [outlet, setOutlet] = useState("bandra");
  const [date, setDate] = useState(() => toLocalDateStr(new Date()));
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("counter");

  /* Coupon state */
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // coupon code string
  const [discount, setDiscount] = useState(0); // ₹ from backend
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const [showSlots, setShowSlots] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const { user, addOrder, updateProfile } = useAuth();

  const [submitError, setSubmitError] = useState("");

  const dateOptions = useMemo(() => buildDateOptions(), [open]);

const [completedOrder, setCompletedOrder] = useState(null);
  const availableTimeSlots = useMemo(() => {
    if (!date) return [];

    const todayStr = toLocalDateStr(new Date());
    if (date !== todayStr) return ALL_TIME_SLOTS;

    const now = new Date();
    const cutoff = now.getHours() * 60 + now.getMinutes() + PREP_BUFFER_MINUTES;

    return ALL_TIME_SLOTS.filter((s) => s.hour * 60 + s.minute > cutoff);
  }, [date, open]);

  /* Lock body scroll */
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

  /* Heal stale date */
  useEffect(() => {
    if (!open) return;
    const todayStr = toLocalDateStr(new Date());
    if (!date || date < todayStr) {
      setDate(todayStr);
      setTimeSlot("");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Prefill from user / last order */
  useEffect(() => {
    if (!open) return;

    if (user) {
      setName((prev) => prev || user.name || "");
      setPhone((prev) => prev || user.phone || "");
      setEmail((prev) => prev || user.email || "");
      return;
    }

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

  /* Fetch active coupons when modal opens — for the chips */
  useEffect(() => {
    if (!open) return;
    let active = true;
    api
      .getActiveCoupons()
      .then((res) => {
        if (active) setAvailableCoupons(res.data.coupons || []);
      })
      .catch(() => {
        if (active) setAvailableCoupons([]); // non-fatal — chips just don't show
      });
    return () => {
      active = false;
    };
  }, [open]);

  /* ESC closes */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !placing && !orderNumber) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [placing, orderNumber]);


  const handleDownloadReceipt = () => {
  if (!completedOrder) return;
  try {
    generateOrderReceipt(completedOrder);
  } catch (err) {
    console.error("Receipt generation failed:", err);
    alert("Couldn't generate the receipt. Please try again.");
  }
};

  /* Auto re-validate coupon when cart subtotal changes.
     If the coupon no longer qualifies (e.g. cart dropped below min), remove it. */
  useEffect(() => {
    if (!appliedCoupon) return;
    let active = true;
    api
      .applyCoupon(appliedCoupon, subtotal)
      .then((res) => {
        if (active) {
          setDiscount(res.data.discount);
          setCouponError("");
        }
      })
      .catch((err) => {
        if (active) {
          setAppliedCoupon(null);
          setDiscount(0);
          setCouponError(
            err.message || "Coupon removed — order no longer qualifies.",
          );
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  /* ── Computed totals ──────────────────────────────── */
  const tax = Math.round(subtotal * 0.05);
  const gross = subtotal + tax;
  const total = Math.max(0, gross - discount);

  /* ── Payment method is determined by order total ── */
  const requiresOnlinePayment = total >= ONLINE_PAYMENT_THRESHOLD;
  const requiredPayment = requiresOnlinePayment ? "razorpay" : "counter";

  useEffect(() => {
    setPayment(requiredPayment);
  }, [requiredPayment]);

  /* ── Handlers ─────────────────────────────────────── */
  const handleClose = () => {
    if (placing) return;
    if (orderNumber) {
      resetAll();
    }
    closeCart();
    closeWishlist();
    onClose();
    router.push('/account');
  };

  const resetAll = () => {
    setStep(1);
    setOutlet("bandra");
    setDate(toLocalDateStr(new Date()));
    setTimeSlot("");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setPayment("counter");
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError("");
    setApplying(false);
    setOrderNumber(null);
    setSubmitError("");
setCompletedOrder(null);
  };

  const handleDateChange = (value) => {
    setDate(value);
    setTimeSlot("");
    setShowSlots(true);
  };

  const canGoNext = () => {
    if (step === 1)
      return outlet && date && timeSlot && availableTimeSlots.length > 0;
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

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  /* ── Apply coupon via backend ─────────────────────── */
  const applyCoupon = async () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a code to continue");
      return;
    }
    setApplying(true);
    try {
      const res = await api.applyCoupon(code, subtotal);
      setAppliedCoupon(res.data.coupon.code);
      setDiscount(res.data.discount);
      setCouponError("");
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setApplying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setDiscount(0);
  };

  const selectedDateLabel = useMemo(
    () => dateOptions.find((o) => o.value === date)?.label || "",
    [dateOptions, date],
  );

  const placeOrder = async () => {
    setPlacing(true);
    setSubmitError("");

    try {
      /* ── Build payload matching backend expectations ── */
      const payload = {
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          price: Number(i.price),
          qty: Number(i.qty || 1),
          img: i.img || "",
          customizations: i.customizations || undefined,
        })),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
        },
        outlet, // "bandra" — string, backend accepts
        date, // "2026-09-23" ISO — backend accepts
        timeSlot,
        timeSlotLabel:
          ALL_TIME_SLOTS.find((s) => s.value === timeSlot)?.label || "",
        payment,
        notes: notes.slice(0, 500),
        couponCode: appliedCoupon || undefined,
      };

      /* ── Create order on the backend ── */
      const res = await api.createOrder(payload);
      const createdOrder = res.data.order;

      /* ═══ COUNTER PAYMENT — done ═══════════════════ */
      if (payment === "counter") {
        finalizeOrder(createdOrder);
        return;
      }

      /* ═══ RAZORPAY — open checkout ════════════════ */
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) {
        setSubmitError(
          "Couldn't load payment gateway. Please check your connection and try again.",
        );
        setPlacing(false);
        return;
      }

      const razorpayOrder = res.data.razorpay;
      const key = getRazorpayKeyId();
      if (!key) {
        setSubmitError(
          "Payment gateway is not configured. Please contact support.",
        );
        setPlacing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount, // in paise, from backend
        currency: razorpayOrder.currency, // "INR"
        name: "Burgshake",
        description: `Order ${createdOrder.orderNumber}`,
        order_id: razorpayOrder.orderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        notes: { orderNumber: createdOrder.orderNumber },
        theme: { color: "#F97316" },

        /* Success — verify on the server */
        handler: async (response) => {
          try {
            await api.verifyOrderPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finalizeOrder(createdOrder);
          } catch (err) {
            setSubmitError(
              err.message ||
                "Payment verification failed. Your money is safe — please contact support with your order number.",
            );
            setPlacing(false);
          }
        },

        /* User closed the modal without paying */
        modal: {
          ondismiss: () => {
            setSubmitError(
              "Payment cancelled. Your order is saved as pending — retry anytime.",
            );
            setPlacing(false);
          },
        },
      });

      /* If the SDK itself throws (bad config, network) */
      rzp.on?.("payment.failed", (resp) => {
        setSubmitError(
          resp?.error?.description ||
            "Payment failed. Please try a different method.",
        );
        setPlacing(false);
      });

      rzp.open();
      /* Don't setPlacing(false) here — the handler/ondismiss callbacks do that */
    } catch (err) {
      setSubmitError(
        err.message || "Couldn't place your order. Please try again.",
      );
      setPlacing(false);
    }
  };

  const finalizeOrder = (order) => {
    /* Update local history — user sees it in /account immediately */
    addOrder({
      ...order,
      id: order.orderNumber,
    });

    /* If logged in, best-effort profile sync (fire and forget) */
    if (user && updateProfile) {
      const patch = {};
      if (name.trim().length >= 2 && name.trim() !== user.name)
        patch.name = name.trim();
      if (/^\d{10}$/.test(phone) && phone !== user.phone) patch.phone = phone;
      if (/^\S+@\S+\.\S+$/.test(email) && email !== user.email)
        patch.email = email.toLowerCase();
      if (Object.keys(patch).length > 0) updateProfile(patch);
    }

    /* Remember last order details for prefill on the next checkout */
    try {
      localStorage.setItem(
        "burgshake_last_order",
        JSON.stringify({
          orderNumber: order.orderNumber,
          placedAt: order.createdAt || new Date().toISOString(),
          items: order.items,
          subtotal: order.subtotal,
          tax: order.tax,
          discount: order.discount,
          couponCode: order.couponCode,
          total: order.total,
          outlet: order.pickup,
          customer: order.customer,
          payment: order.payment,
        }),
      );
    } catch (e) {
      console.error("Snapshot save failed:", e);
    }

   /* Snapshot the whole order before the cart clears —
     everything cart-derived will be zeroed out a tick from now */
  setCompletedOrder(order);

    /* Show success screen + clear cart */
    setOrderNumber(order.orderNumber);
    setPlacing(false);
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

          <div className="px-6 py-5 text-center">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              Order Number
            </div>
            <div className="mt-1.5 font-display text-[20px] font-extrabold tracking-tight text-neutral-950">
              {orderNumber}
            </div>
          </div>

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
                  {selectedDateLabel},{" "}
                  {ALL_TIME_SLOTS.find((s) => s.value === timeSlot)?.label}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-6 mb-6 flex items-baseline justify-between border-t border-neutral-200/70 pt-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
  {completedOrder?.payment === "razorpay" ? "Paid" : "Pay at counter"}
</span>
            <span className="font-display text-[20px] font-extrabold text-neutral-950">
  ₹{completedOrder?.total ?? 0}
</span>
          </div>

          <div className="mx-6 mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[12px] leading-[1.55] text-amber-800">
              <strong className="font-bold">Important:</strong> Show this order
              number at the counter. No home delivery — please collect at the
              scheduled time.
            </p>
          </div>

          <div className="space-y-2.5 px-6 pb-6">
  <button
    type="button"
    onClick={handleDownloadReceipt}
    className="group flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-[13.5px] font-bold text-neutral-800 transition-all duration-300 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
  >
    <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
    Download Receipt
  </button>

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

                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <Calendar className="h-3 w-3" />
                      Pickup Date
                    </label>
                    <div className="relative mt-3">
                      <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <select
                        value={date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white py-3.5 pl-11 pr-11 text-[14px] font-semibold text-neutral-900 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      >
                        {dateOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    </div>
                    <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                      Orders can be scheduled up to 7 days in advance.
                    </p>
                  </div>

                  {date && (
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
                          {availableTimeSlots.length === 0 ? (
                            <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5">
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                              <p className="text-[12px] leading-[1.55] text-amber-800">
                                <strong className="font-bold">
                                  No slots left for today.
                                </strong>{" "}
                                Please pick another date above.
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-neutral-200/70 bg-white p-3 sm:grid-cols-4">
                                {availableTimeSlots.map((slot) => (
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
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ STEP 2: Your Info ═══════ */}
              {step === 2 && (
                <div className="space-y-5">
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
                          setPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="98765 43210"
                        className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-[88px] pr-4 text-[14px] font-medium tabular-nums text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                      />
                      {phone.length === 10 && (
                        <Check
                          className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                      We&apos;ll send your order updates via SMS.
                    </p>
                  </div>

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

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Special Instructions{" "}
                      <span className="font-medium text-neutral-400">
                        (optional)
                      </span>
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
                  {submitError && (
                    <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-[12.5px] font-medium text-red-700">
                        {submitError}
                      </p>
                    </div>
                  )}
                  {/* Payment method — auto-selected by order total */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <CreditCard className="h-3 w-3" />
                      Payment Method
                    </label>

                    {(() => {
                      const method = PAYMENT_METHODS[requiredPayment];
                      const { Icon } = method;

                      return (
                        <div className="mt-3 rounded-2xl border border-brand-500 bg-brand-50/60 p-4 shadow-[0_10px_26px_-14px_rgba(249,115,22,0.5)]">
                          <div className="flex items-start gap-3.5">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500 text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-display text-[14px] font-bold text-neutral-950">
                                  {method.label}
                                </span>
                                <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white">
                                  {requiresOnlinePayment
                                    ? "Required"
                                    : "Available"}
                                </span>
                              </div>
                              <div className="mt-0.5 text-[11.5px] text-neutral-600">
                                {method.desc}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 border-t border-brand-200/60 pt-3 text-[11px] leading-[1.6] text-brand-800">
                            {requiresOnlinePayment ? (
                              <>
                                Orders of{" "}
                                <strong className="font-bold">
                                  ₹{ONLINE_PAYMENT_THRESHOLD} or more
                                </strong>{" "}
                                must be paid online before pickup. You&apos;ll
                                be redirected to a secure Razorpay window.
                              </>
                            ) : (
                              <>
                                Orders below{" "}
                                <strong className="font-bold">
                                  ₹{ONLINE_PAYMENT_THRESHOLD}
                                </strong>{" "}
                                can be paid in cash or by card when you collect
                                your order.
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Coupon — same in both payment modes */}
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      <Tag className="h-3 w-3" />
                      Coupon Code
                    </label>

                    {appliedCoupon ? (
                      /* Applied */
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
                      <>
                        {/* Input row */}
                        <div className="mt-3 flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              if (couponError) setCouponError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !applying) {
                                e.preventDefault();
                                applyCoupon();
                              }
                            }}
                            disabled={applying}
                            placeholder="Enter code"
                            className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-[13.5px] font-bold uppercase tracking-[0.1em] text-neutral-900 placeholder:text-neutral-300 placeholder:font-medium placeholder:tracking-normal outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={applying || !couponCode.trim()}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-neutral-950 px-5 text-[12.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 disabled:cursor-not-allowed disabled:bg-neutral-300"
                          >
                            {applying ? (
                              <>
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Checking
                              </>
                            ) : (
                              "Apply"
                            )}
                          </button>
                        </div>

                        {/* Error */}
                        {couponError && (
                          <div className="mt-2.5 flex items-center gap-2 text-[11.5px] font-semibold text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {couponError}
                          </div>
                        )}

                        {/* Available coupon chips from backend */}
                        {availableCoupons.length > 0 && (
                          <div className="mt-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                              Available offers
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {availableCoupons.map((c) => (
                                <button
                                  key={c._id || c.couponCode}
                                  onClick={() => {
                                    setCouponCode(c.couponCode);
                                    setCouponError("");
                                  }}
                                  title={couponLabel(c)}
                                  className="group/chip inline-flex items-center gap-1.5 rounded-full border border-dashed border-neutral-300 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-500 transition-all hover:border-brand-400 hover:bg-brand-50/60 hover:text-brand-600"
                                >
                                  <Tag className="h-2.5 w-2.5" />
                                  {c.couponCode}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
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

                <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li
                      key={`${item.slug}__${
                        item.customizations
                          ? JSON.stringify(item.customizations)
                          : ""
                      }`}
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
                        {item.customizations && (
                          <div className="mt-0.5 truncate text-[10.5px] font-medium text-neutral-500">
                            {[
                              item.customizations.bun,
                              item.customizations.patty,
                              ...(item.customizations.extras || []),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
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

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-white/60 px-3 py-2.5">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-neutral-600">
                    {payment === "razorpay"
                      ? "Secure · Razorpay · SSL"
                      : "Pay cash or card at pickup"}
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
