"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  Shield,
  ShieldOff,
  Trash2,
  Star,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "admin", label: "Admins" },
  { id: "active", label: "Active" },
  { id: "blocked", label: "Blocked" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListUsers({ limit: 100 });
      setUsers(res.data.users);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (filter === "admin") list = list.filter((u) => u.role === "admin");
    if (filter === "active") list = list.filter((u) => u.isActive);
    if (filter === "blocked") list = list.filter((u) => !u.isActive);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }
    return list;
  }, [users, filter, search]);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (
      !confirm(
        `Change role of ${user.name} to "${newRole}"?`
      )
    )
      return;
    setBusy(user._id);
    try {
      await api.adminUpdateUserRole(user._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const toggleActive = async (user) => {
    if (
      !confirm(
        user.isActive
          ? `Block ${user.name}? They won't be able to sign in.`
          : `Unblock ${user.name}?`
      )
    )
      return;
    setBusy(user._id);
    try {
      const res = await api.adminToggleUserActive(user._id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: res.data.isActive } : u
        )
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (user) => {
    if (
      !confirm(
        `Permanently delete ${user.name}? This cannot be undone.`
      )
    )
      return;
    setBusy(user._id);
    try {
      await api.adminDeleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleMenuClick = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("admin:open-menu"));
    }
  };

  return (
    <AdminGuard>
      <AdminTopbar
        title="Users"
        subtitle={`${users.length} total users`}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
                  filter === f.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, phone…"
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-[12.5px] font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-4">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid place-items-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <p className="font-display text-[15px] font-bold text-neutral-800">
              No users found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user) => (
              <article
                key={user._id}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200/70 bg-white p-4 transition-all hover:border-brand-200 sm:flex-row sm:items-center sm:p-5"
              >
                {/* Avatar + info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[14px] font-extrabold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-display text-[14px] font-bold text-neutral-950">
                        {user.name}
                      </span>
                      {user.role === "admin" && (
                        <span className="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-brand-700 ring-1 ring-brand-200">
                          <Shield className="h-2.5 w-2.5" />
                          Admin
                        </span>
                      )}
                      {!user.isActive && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] text-red-700 ring-1 ring-red-200">
                          Blocked
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-neutral-500">
                      <span>{user.email}</span>
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid shrink-0 grid-cols-2 gap-4 sm:flex sm:items-center sm:gap-6">
                  <div className="text-center">
                    <div className="font-display text-[15px] font-extrabold tabular-nums text-neutral-950">
                      {user.orderCount || 0}
                    </div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Orders
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-[15px] font-extrabold tabular-nums text-brand-600">
                      ₹{(user.totalSpent || 0).toLocaleString()}
                    </div>
                    <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                      Spent
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => toggleRole(user)}
                    disabled={busy === user._id}
                    title={user.role === "admin" ? "Remove admin" : "Make admin"}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-all disabled:opacity-40 ${
                      user.role === "admin"
                        ? "bg-brand-50 text-brand-600 hover:bg-brand-100"
                        : "text-neutral-500 hover:bg-brand-50 hover:text-brand-600"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldOff className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleActive(user)}
                    disabled={busy === user._id}
                    title={user.isActive ? "Block user" : "Unblock user"}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition-all disabled:opacity-40 ${
                      user.isActive
                        ? "text-neutral-500 hover:bg-red-50 hover:text-red-600"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {user.isActive ? (
                      <Star className="h-3.5 w-3.5" />
                    ) : (
                      <Star className="h-3.5 w-3.5 fill-current" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(user)}
                    disabled={busy === user._id}
                    title="Delete user"
                    className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-all hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}