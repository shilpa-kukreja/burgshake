"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  MessageSquare,
  Users,
  LogOut,
  Store,
  ExternalLink, 
  LayoutGrid,

} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Menu", href: "/admin/menu", Icon: UtensilsCrossed },
  { label: "Categories", href: "/admin/categories", Icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", Icon: ClipboardList },
  { label: "Messages", href: "/admin/contacts", Icon: MessageSquare },
  { label: "Users", href: "/admin/users", Icon: Users },
];

export default function AdminSidebar({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-full flex-col bg-neutral-950 text-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/30">
          <Store className="h-4 w-4 text-white" strokeWidth={2.5} />
        </span>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-extrabold tracking-tight">
            <span className="text-white">Burg</span>
            <span className="text-brand-400">shake</span>
          </div>
          <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-white/40">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-1">
          {NAV.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-all duration-300 ${
                  active
                    ? "bg-brand-500 text-white shadow-[0_10px_24px_-10px_rgba(249,115,22,0.7)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    active ? "text-white" : "text-white/50 group-hover:text-white"
                  }`}
                  strokeWidth={2.2}
                />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Divider + view site */}
        <div className="my-5 h-px bg-white/10" />
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold text-white/50 transition-all duration-300 hover:bg-white/5 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <ExternalLink className="h-4 w-4" />
            View site
          </span>
        </Link>
      </nav>

      {/* User card + logout */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[12px] font-extrabold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[12.5px] font-bold text-white">
              {user?.name || "Admin"}
            </div>
            <div className="truncate text-[10.5px] text-white/40">
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}