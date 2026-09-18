"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* Login page uses its own layout (no sidebar) */
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-sm lg:hidden"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute -right-12 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-700 shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>

      {/* Inject mobile toggle event listener */}
      <MobileMenuBridge onOpen={() => setMobileOpen(true)} />
    </div>
  );
}

/* Listens for a custom event from AdminTopbar */
function MobileMenuBridge({ onOpen }) {
  if (typeof window !== "undefined") {
    window.addEventListener("admin:open-menu", onOpen);
  }
  return null;
}