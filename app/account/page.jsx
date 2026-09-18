"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  Save,
  Check,
  Package,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import AccountOrders from "../components/AccountOrders";

const TABS = [
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "profile", label: "Profile", Icon: User },
  { id: "settings", label: "Settings", Icon: Settings },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, myOrders, hydrated, logout, updateProfile } = useAuth();
  const { count: wishlistCount, openWishlist } = useWishlist();

  const [tab, setTab] = useState("orders");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  /* Loading */
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-500" />
      </div>
    );
  }

  /* Not logged in → gate */
  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-md px-6">
          <div className="rounded-3xl border border-neutral-200/70 bg-white p-8 text-center shadow-[0_30px_70px_-30px_rgba(249,115,22,0.3)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 ring-1 ring-brand-100">
              <User className="h-7 w-7 text-brand-500" strokeWidth={1.8} />
            </div>
            <h1 className="mt-5 font-display text-[1.6rem] font-bold tracking-[-0.015em] text-neutral-950">
              Sign in required
            </h1>
            <p className="mt-2 text-[13.5px] leading-[1.65] text-neutral-500">
              Log in to view your orders, profile, and saved items.
            </p>
            <Link
              href="/login?from=/account"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-[13.5px] font-bold text-white transition-all duration-300 hover:bg-brand-500 hover:shadow-[0_14px_34px_-12px_rgba(249,115,22,0.7)]"
            >
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    const patch = {};
    if (editName.trim().length >= 2) patch.name = editName.trim();
    if (/^\d{10}$/.test(editPhone)) patch.phone = editPhone;
    if (/^\S+@\S+\.\S+$/.test(editEmail)) patch.email = editEmail;

    if (Object.keys(patch).length === 0) return;
    updateProfile(patch);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const startEdit = () => {
    setEditName(user.name || "");
    setEditPhone(user.phone || "");
    setEditEmail(user.email || "");
    setEditing(true);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] pt-24 sm:pt-28 lg:pt-32">
      {/* Background glows */}
      {/* <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.14)_0%,_transparent_65%)]" />
        <div className="absolute -left-40 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(249,115,22,0.08)_0%,_transparent_65%)]" />
      </div> */}

      <div className="mx-auto max-w-6xl px-6 pb-16 lg:px-10 lg:pb-20">
        {/* ═══ Header card ═══════════════════════════ */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200/70  shadow-[0_20px_50px_-25px_rgba(249,115,22,0.3)]">
          <div className="relative p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgb(249 115 22 / 0.15) 1px, transparent 0)",
                backgroundSize: "26px 26px",
              }}
            />

            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-[0_12px_28px_-10px_rgba(249,115,22,0.6)]">
                <span className="font-display text-[22px] font-extrabold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand-600">
                  <span className="h-px w-6 bg-brand-500" />
                  Your Account
                </div>
                <h1 className="mt-2 font-display text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-neutral-950 sm:text-[1.9rem]">
                  Hey,{" "}
                  <span className="font-serif italic font-normal text-brand-500">
                    {user.name?.split(" ")[0]}.
                  </span>
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      +91 {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={openWishlist}
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all duration-300 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                  aria-label="Open wishlist"
                >
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-extrabold text-white ring-2 ring-[#FDFCFB]">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[12px] font-bold text-neutral-700 transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative grid grid-cols-3 divide-x divide-neutral-200/70 border-t border-neutral-200/70 bg-white/60 backdrop-blur-sm">
            <div className="px-5 py-4 text-center sm:text-left">
              <div className="font-display text-[18px] font-extrabold tabular-nums text-neutral-950">
                {myOrders.length}
              </div>
              <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Total Orders
              </div>
            </div>
            <div className="px-5 py-4 text-center sm:text-left">
              <div className="font-display text-[18px] font-extrabold tabular-nums text-neutral-950">
                {wishlistCount}
              </div>
              <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Saved Items
              </div>
            </div>
            <div className="px-5 py-4 text-center sm:text-left">
              <div className="font-display text-[18px] font-extrabold tabular-nums text-brand-600">
                ₹
                {myOrders
                  .reduce((s, o) => s + (Number(o.total) || 0), 0)
                  .toLocaleString()}
              </div>
              <div className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-neutral-400">
                Total Spent
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Tabs ══════════════════════════════════ */}
        <div className="mt-8 flex gap-1 overflow-x-auto rounded-full border border-neutral-200/70 bg-white p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-[12.5px] font-bold transition-all duration-300 ${
                tab === id
                  ? "bg-neutral-950 text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.4)]"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {id === "orders" && myOrders.length > 0 && (
                <span
                  className={`ml-0.5 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9.5px] font-extrabold ${
                    tab === id
                      ? "bg-white text-neutral-950"
                      : "bg-brand-500 text-white"
                  }`}
                >
                  {myOrders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ Tab content ═══════════════════════════ */}
        <div className="mt-6">
          {tab === "orders" && <AccountOrders orders={myOrders} />}

          {tab === "profile" && (
            <div className="rounded-3xl border border-neutral-200/70 bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[16px] font-bold tracking-[-0.01em] text-neutral-950">
                    Profile Information
                  </h2>
                  <p className="mt-1 text-[12.5px] text-neutral-500">
                    Update your personal details.
                  </p>
                </div>
                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-600 transition-all hover:border-neutral-950"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-bold text-white transition-all ${
                        saved ? "bg-emerald-500" : "bg-neutral-950 hover:bg-brand-500"
                      }`}
                    >
                      {saved ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <ProfileField
                  label="Full Name"
                  value={editing ? editName : user.name}
                  onChange={setEditName}
                  editing={editing}
                />
                <ProfileField
                  label="Email Address"
                  value={editing ? editEmail : user.email}
                  onChange={setEditEmail}
                  editing={editing}
                  type="email"
                />
                <ProfileField
                  label="Phone Number"
                  value={editing ? editPhone : user.phone || "Not set"}
                  onChange={(v) =>
                    setEditPhone(v.replace(/\D/g, "").slice(0, 10))
                  }
                  editing={editing}
                  prefix="+91"
                />
                <ProfileField
                  label="Member Since"
                  value={memberSince}
                  editing={false}
                />
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-4">
              {/* <SettingCard
                title="Notifications"
                desc="Get order updates via SMS and email."
                value="Enabled"
              />
              <SettingCard
                title="Marketing emails"
                desc="Seasonal offers, new menu drops, and surprises."
                value="On"
              />
              <SettingCard
                title="Language"
                desc="Preferred language for your account."
                value="English"
              /> */}

              <div className="rounded-3xl border border-red-200/70 bg-red-50/40 p-6">
                <h3 className="font-display text-[15px] font-bold text-red-900">
                  Sign out of your account
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.6] text-red-700/80">
                  You&apos;ll need to sign in again to access orders and saved
                  items.
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[12.5px] font-bold text-white transition-all hover:bg-red-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable components ──────────────────────── */
function ProfileField({ label, value, onChange, editing, type = "text", prefix }) {
  return (
    <div>
      <label className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </label>
      {editing ? (
        <div className="relative mt-2">
          {prefix && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-neutral-500">
              {prefix}
            </span>
          )}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pr-4 text-[14px] font-medium text-neutral-900 outline-none transition-all focus:border-brand-400 focus:ring-4 focus:ring-brand-100 ${
              prefix ? "pl-[68px]" : "pl-4"
            }`}
          />
        </div>
      ) : (
        <div className="mt-2 truncate rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-3.5 text-[14px] font-medium text-neutral-800">
          {value || "—"}
        </div>
      )}
    </div>
  );
}

function SettingCard({ title, desc, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-neutral-200/70 bg-white p-5">
      <div className="min-w-0">
        <div className="font-display text-[14px] font-bold tracking-[-0.01em] text-neutral-950">
          {title}
        </div>
        <div className="mt-1 text-[12.5px] leading-[1.55] text-neutral-500">
          {desc}
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700 ring-1 ring-brand-100">
        {value}
      </span>
    </div>
  );
}