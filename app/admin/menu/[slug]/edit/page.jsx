"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import AdminGuard from "../../../../components/admin/AdminGuard";
import AdminTopbar from "../../../../components/admin/AdminTopbar";
import MenuItemForm from "../../../../components/admin/MenuItemForm";
import { api } from "../../../../lib/api";

export default function EditMenuItemPage({ params }) {
  const { slug } = use(params);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.adminGetMenu(slug);
        if (active) setItem(res.data.item);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title={item ? `Edit — ${item.name}` : "Edit item"}
        subtitle={item ? `/${item.slug}` : "Loading…"}
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
          {loading ? (
            <div className="grid place-items-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
            </div>
          ) : error ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-[13px] font-medium text-red-700">{error}</p>
            </div>
          ) : item ? (
            <MenuItemForm mode="edit" initialData={item} />
          ) : null}
        </div>
      </main>
    </AdminGuard>
  );
}