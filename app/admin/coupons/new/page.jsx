"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminGuard from "../../../components/admin/AdminGuard";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import CouponForm from "../../../components/admin/CouponForm";

export default function NewCouponPage() {
  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Add coupon"
        subtitle="Create a new discount code"
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Link
          href="/admin/coupons"
          className="group mb-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to coupons
        </Link>

        <div className="mx-auto max-w-3xl">
          <CouponForm mode="new" />
        </div>
      </main>
    </AdminGuard>
  );
}