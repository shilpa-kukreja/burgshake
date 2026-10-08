"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useNewOrderAlert } from "../../hooks/useNewOrderAlert";
import {
  playNotificationSound,
  showOrderNotification,
  requestNotificationPermission,
  installAudioUnlockListener,
} from "../../lib/alertSound";
import NewOrderToast from "./NewOrderToast";

export default function AdminGuard({ children }) {
  const { user, hydrated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /* The most recent new order we've been alerted about. Passed
     to the toast; cleared when the admin dismisses it or after
     the auto-timeout. */
  const [recentOrder, setRecentOrder] = useState(null);

  /* ── Auth gate ──────────────────────────────────── */
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isAdmin) {
      router.replace("/admin/login?error=not-admin");
    }
  }, [hydrated, user, isAdmin, router, pathname]);

  /* ── Request OS notification permission once ──────
     Only after we know the user is a signed-in admin, so the
     prompt doesn't appear to random visitors. */
  useEffect(() => {
    if (hydrated && user && isAdmin) {
      requestNotificationPermission();
    }
  }, [hydrated, user, isAdmin]);




  /* ── Unlock audio on the first user gesture ───────
     Browsers block audio until the user interacts with the page.
     Once the admin clicks anything, the AudioContext is unlocked
     for the rest of the session and the chime will play. */
  useEffect(() => {
    const cleanup = installAudioUnlockListener();
    return cleanup;
  }, []);




  /* ── Poll for new orders ──────────────────────────
     Enabled only for authenticated admins. Fires the sound,
     OS notification, and in-app toast when a new order lands. */
  useNewOrderAlert({
    enabled: hydrated && !!user && isAdmin,
    onNewOrder: (order) => {
      playNotificationSound();
      showOrderNotification(order);
      setRecentOrder(order);

      /* Auto-dismiss the toast after 10s */
      setTimeout(() => {
        setRecentOrder((cur) =>
          cur?.orderNumber === order.orderNumber ? null : cur
        );
      }, 10_000);
    },
  });

  /* ── Loading state ────────────────────────────────── */
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-500" />
      </div>
    );
  }

  /* ── Not authenticated ───────────────────────────── */
  if (!user || !isAdmin) return null;

  /* ── Authenticated ───────────────────────────────── */
  return (
    <>
      <NewOrderToast
        order={recentOrder}
        onDismiss={() => setRecentOrder(null)}
      />
      {children}
    </>
  );
}