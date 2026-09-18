"use client";

import { Menu } from "lucide-react";

export default function AdminTopbar({ title, subtitle, onMenuClick, actions }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/70 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-brand-300 hover:text-brand-600 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950 sm:text-[18px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-[11.5px] font-medium text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}