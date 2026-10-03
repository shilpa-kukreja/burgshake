"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  User,
  Phone,
  ArrowRight,
  Check,
  Sparkles,
  AlertCircle,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";
  const { sendOtp, verifyOtp, user } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [step, setStep] = useState("phone"); // phone | otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  /* Phone-step fields */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* OTP-step state */
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  /* Already signed in → redirect */
  if (user) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#FDFCFB] px-6 pt-24">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
          <h1 className="mt-6 font-display text-[1.6rem] font-bold tracking-[-0.015em] text-neutral-950">
            You&apos;re already signed in.
          </h1>
          <p className="mt-2 text-[14px] text-neutral-500">
            Welcome back, {user.name}.
          </p>
          <Link
            href="/account"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white transition-all hover:bg-brand-500"
          >
            Go to my account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* Resend cooldown ticker */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* Focus first OTP cell when arriving at the OTP step */
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  /* ── Send OTP ────────────────────────────────── */
  const handleSendOtp = async (e) => {
    e?.preventDefault?.();
    setError("");

    /* Client-side validation */
    if (mode === "signup") {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        setError("Please enter a valid email.");
        return;
      }
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone);
      setOtp(["", "", "", "", "", ""]);
      setStep("otp");
      setResendIn(30);
    } catch (err) {
      setError(err.message || "Couldn't send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify OTP ──────────────────────────────── */
  const handleVerify = async (e) => {
    e?.preventDefault?.();
    setError("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const payload = { phone, otp: code };
      if (mode === "signup") {
        payload.name = name.trim();
        payload.email = email.trim().toLowerCase();
      }
      await verifyOtp(payload);
      router.push(redirectTo);
    } catch (err) {
      const msg = err.message || "Invalid OTP. Please try again.";

      /* Backend said name+email required = phone isn't registered yet.
         Help the user by switching to Sign Up. */
      if (/name and email are required/i.test(msg)) {
        setError("No account found for this number. Please sign up first.");
        setMode("signup");
        setStep("phone");
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(msg);
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend ──────────────────────────────────── */
  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    setError("");
    setLoading(true);
    try {
      await sendOtp(phone);
      setResendIn(30);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Couldn't resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Back to phone step ──────────────────────── */
  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  /* ── Switch login/signup tab ─────────────────── */
  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setStep("phone");
    setError("");
    setOtp(["", "", "", "", "", ""]);
    if (newMode === "login") {
      setName("");
      setEmail("");
    }
  };

  /* ── OTP cell handlers ───────────────────────── */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste.length === 0) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    paste.split("").forEach((ch, i) => {
      if (i < 6) next[i] = ch;
    });
    setOtp(next);
    otpRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const maskedPhone =
    phone.length === 10
      ? `+91 ${phone.slice(0, 2)}XXX XX${phone.slice(-3)}`
      : `+91 ${phone}`;

  const isPhoneStep = step === "phone";
  const otpFilled = otp.join("").length === 6;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      <div className="mx-auto max-w-xl px-6 pb-16 lg:pb-20">
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_30px_70px_-30px_rgba(249,115,22,0.3)]">
          {/* Header */}
          <div className="relative border-b border-neutral-200/70 px-6 py-7 sm:px-8">
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                <Sparkles className="h-3 w-3" />
                {!isPhoneStep
                  ? "Verify"
                  : mode === "login"
                    ? "Welcome back"
                    : "Get started"}
              </div>

              <h1 className="mt-3 font-display text-[1.65rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 sm:text-[1.85rem]">
                {!isPhoneStep ? (
                  <>
                    Enter the{" "}
                    <span className="font-serif italic font-normal text-brand-500">
                      code.
                    </span>
                  </>
                ) : mode === "login" ? (
                  <>
                    Sign in to{" "}
                    <span className="font-serif italic font-normal text-brand-500">
                      Burgshake.
                    </span>
                  </>
                ) : (
                  <>
                    Create your{" "}
                    <span className="font-serif italic font-normal text-brand-500">
                      account.
                    </span>
                  </>
                )}
              </h1>

              {!isPhoneStep && (
                <p className="mt-3 text-[13px] leading-[1.6] text-neutral-500">
                  We sent a 6-digit code to{" "}
                  <strong className="font-bold text-neutral-800">
                    {maskedPhone}
                  </strong>
                  .
                </p>
              )}
            </div>
          </div>

          {/* Tabs — only on the phone step */}
          {isPhoneStep && (
            <div className="border-b border-neutral-200/70 bg-white px-6 pt-4 sm:px-8">
              <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
                {[
                  { id: "login", label: "Sign In" },
                  { id: "signup", label: "Sign Up" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => switchMode(t.id)}
                    className={`flex-1 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-300 ${
                      mode === t.id
                        ? "bg-white text-neutral-950 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.15)]"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={isPhoneStep ? handleSendOtp : handleVerify}
            className="space-y-4 px-6 py-7 sm:px-8"
          >
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 px-3.5 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-[12.5px] font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* ═══ PHONE STEP ═══════════════════ */}
            {isPhoneStep && (
              <>
                {mode === "signup" && (
                  <>
                    <Field
                      icon={User}
                      label="Full Name"
                      value={name}
                      onChange={setName}
                      placeholder="Aarav Mehta"
                      autoComplete="name"
                    />
                    <Field
                      icon={Mail}
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="you@email.com"
                      autoComplete="email"
                    />
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                    Phone Number
                  </label>
                  <div className="relative mt-2">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-neutral-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      autoFocus
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="98765 43210"
                      autoComplete="tel"
                      className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-[76px] pr-11 text-[14px] font-medium tabular-nums text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                    />
                    {phone.length === 10 && (
                      <Check
                        className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                    We&apos;ll text you a 6-digit code to verify.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    phone.length !== 10 ||
                    (mode === "signup" && (!name.trim() || !email.trim()))
                  }
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none disabled:hover:bg-neutral-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <div className="flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/50 px-3.5 py-3">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
                  <p className="text-[11.5px] leading-[1.55] text-brand-800">
                    No password needed. Your phone number is your key.
                  </p>
                </div>
              </>
            )}

            {/* ═══ OTP STEP ═════════════════════ */}
            {!isPhoneStep && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                    6-digit Code
                  </label>
                  <div className="mt-3 flex justify-between gap-2 sm:gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        disabled={loading}
                        aria-label={`OTP digit ${i + 1}`}
                        className="h-14 w-full max-w-[56px] rounded-2xl border border-neutral-200 bg-white text-center font-display text-[20px] font-bold tabular-nums text-neutral-900 outline-none transition-all duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpFilled}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none disabled:hover:bg-neutral-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      {mode === "signup"
                        ? "Verify & Create Account"
                        : "Verify & Sign In"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1 text-[11.5px] font-semibold">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    disabled={loading}
                    className="inline-flex items-center gap-1 text-neutral-500 transition-colors hover:text-brand-600 disabled:opacity-50"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Change number
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendIn > 0 || loading}
                    className="text-brand-600 transition-colors hover:text-brand-700 disabled:cursor-not-allowed disabled:text-neutral-400"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-neutral-500">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="font-semibold text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-brand-600"
          >
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link
            href="/privacy"
            className="font-semibold text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-brand-600"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

/* ── Small reusable field ────────────────────────────── */
function Field({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-4 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
        />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}