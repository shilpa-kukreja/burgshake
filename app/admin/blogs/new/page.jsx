"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminGuard from "../../../components/admin/AdminGuard";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import BlogForm from "../../../components/admin/BlogForm";

export default function NewBlogPage() {
  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="New blog post"
        subtitle="Write and publish a new post"
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Link
          href="/admin/blogs"
          className="group mb-5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
          Back to blog
        </Link>

        <div className="mx-auto max-w-4xl">
          <BlogForm mode="new" />
        </div>
      </main>
    </AdminGuard>
  );
}