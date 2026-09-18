"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPageContent=()=> {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/account";
  const { login, signup, user } = useAuth();

  const [mode, setMode] = useState("login"); // login | signup
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* Login fields */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");

  /* Signup fields */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");

  /* If already logged in, redirect */
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const res = login(loginEmail, loginPw);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(redirectTo);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const res = signup({ name, email, phone, password: pw });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(redirectTo);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      {/* Background glows */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.14)_0%,_transparent_65%)]" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-xl px-6 pb-16 lg:pb-20">
        {/* Back link */}
        {/* <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link> */}

        {/* Card */}
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200/70 bg-white shadow-[0_30px_70px_-30px_rgba(249,115,22,0.3)]">

          {/* Header */}
          <div className="relative border-b border-neutral-200/70 px-6 py-7 sm:px-8">
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                <Sparkles className="h-3 w-3" />
                {mode === "login" ? "Welcome back" : "Get started"}
              </div>

              <h1 className="mt-3 font-display text-[1.65rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 sm:text-[1.85rem]">
                {mode === "login" ? (
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
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200/70 bg-white px-6 pt-4 sm:px-8">
            <div className="flex gap-1 rounded-full bg-neutral-100 p-1">
              {[
                { id: "login", label: "Sign In" },
                { id: "signup", label: "Sign Up" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setMode(t.id);
                    setError("");
                  }}
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

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="space-y-4 px-6 py-7 sm:px-8"
          >
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 px-3.5 py-3">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-red-500 text-white">
                  <span className="text-[10px] font-bold">!</span>
                </span>
                <p className="text-[12.5px] font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            {mode === "signup" && (
              <Field
                icon={User}
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Aarav Mehta"
                autoComplete="name"
              />
            )}

            <Field
              icon={Mail}
              label="Email Address"
              type="email"
              value={mode === "login" ? loginEmail : email}
              onChange={mode === "login" ? setLoginEmail : setEmail}
              placeholder="you@email.com"
              autoComplete="email"
            />

            {mode === "signup" && (
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
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="98765 43210"
                    className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-[76px] pr-4 text-[14px] font-medium tabular-nums text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={mode === "login" ? loginPw : pw}
                  onChange={(e) =>
                    mode === "login"
                      ? setLoginPw(e.target.value)
                      : setPw(e.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-11 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {mode === "signup" && (
                <p className="mt-2 text-[10.5px] font-medium text-neutral-400">
                  Minimum 6 characters.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            {/* Demo hint */}
            {mode === "login" && (
              <p className="text-center text-[11px] font-medium text-neutral-400">
                Demo mode — any valid email + 6-char password works.
              </p>
            )}
          </form>
        </div>

        {/* Bottom note */}
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
}

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