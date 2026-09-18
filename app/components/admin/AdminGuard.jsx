"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminGuard({ children }) {
  const { user, hydrated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin) {
      router.replace("/admin/login?error=not-admin");
    }
  }, [hydrated, user, isAdmin, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-500" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return children;
}