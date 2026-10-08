"use client";

import { useEffect, useRef } from "react";
import { api } from "../lib/api";

const STORAGE_KEY = "burgshake_admin_last_seen_order";
const DEFAULT_INTERVAL = 30_000; // 30 seconds

export function useNewOrderAlert({
  enabled = true,
  interval = DEFAULT_INTERVAL,
  onNewOrder,
} = {}) {
  /* Keep the callback in a ref so changing it doesn't restart polling */
  const callbackRef = useRef(onNewOrder);
  useEffect(() => {
    callbackRef.current = onNewOrder;
  }, [onNewOrder]);

  useEffect(() => {
    if (!enabled) return;

    let live = true;
    let timer = null;

    const poll = async () => {
      try {
        const res = await api.adminListOrders({ limit: 1, sort: "newest" });
        if (!live) return;

        const latest = res?.data?.orders?.[0];
        if (!latest?.orderNumber) return;

        const stored = localStorage.getItem(STORAGE_KEY);

        /* First run on this browser — record the current top order
           as the baseline. Don't alert on stuff that was already
           there before the admin opened the panel. */
        if (!stored) {
          localStorage.setItem(STORAGE_KEY, latest.orderNumber);
          return;
        }

        if (stored !== latest.orderNumber) {
          localStorage.setItem(STORAGE_KEY, latest.orderNumber);
          callbackRef.current?.(latest);
        }
      } catch {
        /* Network blip — ignore, we'll try again next tick */
      }
    };

    /* Fire immediately so we don't wait 30s on mount */
    poll();

    timer = setInterval(poll, interval);

    return () => {
      live = false;
      if (timer) clearInterval(timer);
    };
  }, [enabled, interval]);
}