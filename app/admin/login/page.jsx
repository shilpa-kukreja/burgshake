"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";
  const errorParam = searchParams.get("error");

  const { user, isAdmin, hydrated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* If already logged in as admin, redirect */
  useEffect(() => {
    if (hydrated && user && isAdmin) {
      router.replace(from);
    }
  }, [hydrated, user, isAdmin, router, from]);

  useEffect(() => {
    if (errorParam === "not-admin") {
      setError("This account doesn't have admin access.");
    }
  }, [errorParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    if (res.user.role !== "admin") {
      setError("This account doesn't have admin access.");
      return;
    }

    router.replace(from);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center mt-5 bg-[#FDFCFB] px-4 py-12">
      {/* Background glows */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.16)_0%,_transparent_65%)]" />
        <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="relative w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="group mb-6 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to site
        </Link>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-[0_40px_80px_-30px_rgba(249,115,22,0.4)]">
          {/* Header */}
          <div className="relative border-b border-neutral-200/70 bg-gradient-to-br from-neutral-950 via-neutral-950 to-brand-600/40 px-6 py-8 text-center sm:px-8 sm:py-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
                <Shield className="h-6 w-6 text-brand-400" strokeWidth={2} />
              </div>
              <h1 className="mt-5 font-display text-[22px] font-bold tracking-[-0.01em] text-white sm:text-[24px]">
                Admin Sign In
              </h1>
              <p className="mt-2 text-[12.5px] text-white/60">
                Only authorized Burgshake staff
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
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

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                Email
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@burgshake.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-4 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
              </div>
            </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-10 pr-11 text-[14px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to panel
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11.5px] text-neutral-400">
          Not an admin?{" "}
          <Link
            href="/login"
            className="font-semibold text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-brand-600"
          >
            Customer sign in
          </Link>
        </p>
      </div>
    </div>
  );
}