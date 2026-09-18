"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
} from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListContacts({ limit: 100 });
      setMessages(res.data.contacts);
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
    let list = messages;
    if (status !== "all") list = list.filter((m) => m.status === status);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, status, search]);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.adminUpdateContactStatus(id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.adminDeleteContact?.(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.message);
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
        title="Messages"
        subtitle={`${messages.filter((m) => m.status === "new").length} new`}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STATUS_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setStatus(t.id)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
                  status === t.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, message…"
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
            <MessageSquare className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 font-display text-[15px] font-bold text-neutral-800">
              No messages
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((m) => {
              const isOpen = expanded === m._id;
              return (
                <article
                  key={m._id}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                    m.status === "new"
                      ? "border-brand-200 shadow-[0_8px_24px_-16px_rgba(249,115,22,0.3)]"
                      : "border-neutral-200/70"
                  }`}
                >
                  <button
                    onClick={() => {
                      setExpanded(isOpen ? null : m._id);
                      if (!isOpen && m.status === "new") {
                        updateStatus(m._id, "read");
                      }
                    }}
                    className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-brand-50/30 sm:p-5"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-[13px] font-extrabold text-white">
                      {m.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[13.5px] font-bold text-neutral-950">
                          {m.name}
                        </span>
                        <StatusChip status={m.status} />
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          {m.topic}
                        </span>
                      </div>
                      <div className="mt-1 line-clamp-1 text-[12.5px] text-neutral-500">
                        {m.message}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {m.email}
                        </span>
                        {m.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {m.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right text-[10.5px] font-medium text-neutral-400">
                      {new Date(m.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-neutral-200/70 bg-neutral-50/40 p-4 sm:p-5">
                      <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        Message
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-neutral-700">
                        {m.message}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${m.email}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-brand-500"
                        >
                          <Mail className="h-3 w-3" />
                          Reply via email
                        </a>

                        <button
                          onClick={() => updateStatus(m._id, "replied")}
                          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Mark replied
                        </button>

                        <button
                          onClick={() => updateStatus(m._id, "archived")}
                          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-neutral-700 transition-all hover:border-neutral-950"
                        >
                          Archive
                        </button>

                        <button
                          onClick={() => handleDelete(m._id)}
                          className="ml-auto grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition-all hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </AdminGuard>
  );
}

function StatusChip({ status }) {
  const styles = {
    new: "bg-brand-50 text-brand-700 ring-brand-200",
    read: "bg-blue-50 text-blue-700 ring-blue-200",
    replied: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    archived: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.1em] ring-1 ${
        styles[status] || styles.new
      }`}
    >
      {status}
    </span>
  );
}