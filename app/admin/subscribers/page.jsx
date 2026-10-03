"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Loader2, AlertCircle, Users } from "lucide-react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { api } from "../../lib/api";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminListSubscribers();
      setSubscribers(res.data.subscribers || []);
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

  const handleDelete = async (sub) => {
    if (!confirm(`Remove "${sub.email}"?`)) return;
    setBusyId(sub._id);
    try {
      await api.adminDeleteSubscriber(sub._id);
      setSubscribers((prev) => prev.filter((s) => s._id !== sub._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
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
        title="Subscribers"
        subtitle={`${subscribers.length} total`}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
        ) : subscribers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-3 font-display text-[15px] font-bold text-neutral-800">
              No subscribers yet
            </p>
            <p className="mt-1.5 text-[12.5px] text-neutral-500">
              Signups from the footer form will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-neutral-200/70 bg-white">
            <div className="grid grid-cols-12 gap-3 border-b border-neutral-200/70 bg-neutral-50/60 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              <div className="col-span-8">Email</div>
              <div className="col-span-3">Subscribed</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            <ul className="divide-y divide-neutral-200/70">
              {subscribers.map((sub) => (
                <li
                  key={sub._id}
                  className="grid grid-cols-12 items-center gap-3 px-5 py-4 transition-colors hover:bg-brand-50/30"
                >
                  <div className="col-span-8 flex items-center gap-2.5 min-w-0">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-[13.5px] font-semibold text-neutral-950">
                      {sub.email}
                    </span>
                  </div>

                  <div className="col-span-3 text-[12px] font-medium text-neutral-500">
                    {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => handleDelete(sub)}
                      disabled={busyId === sub._id}
                      title="Delete"
                      className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      {busyId === sub._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </AdminGuard>
  );
}