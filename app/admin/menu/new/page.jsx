"use client";

import AdminGuard from "../../../components/admin/AdminGuard";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import MenuItemForm from "../../../components/admin/MenuItemForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewMenuItemPage() {
  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Add menu item"
        subtitle="Create a new dish for your menu"
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Link
          href="/admin/menu"
          className="group mb-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to menu
        </Link>

        <div className="mx-auto max-w-4xl">
          <MenuItemForm mode="new" />
        </div>
      </main>
    </AdminGuard>
  );
}