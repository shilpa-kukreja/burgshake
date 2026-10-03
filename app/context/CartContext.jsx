"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "burgshake_cart";

/* ── Identity of a cart line: slug + customizations ── */
function lineKey(p) {
  if (!p || !p.slug) return "";
  if (!p.customizations) return p.slug;
  const c = p.customizations;
  const extras = Array.isArray(c.extras) ? [...c.extras].sort().join(",") : "";
  return `${p.slug}__${c.bun || ""}__${c.patty || ""}__${extras}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* Read */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const cleaned = Array.isArray(parsed)
          ? parsed.filter((p) => p && p.slug)
          : [];
        setItems(cleaned);
      }
    } catch (e) {
      console.error("Cart read error:", e);
    }
    setHydrated(true);
  }, []);

  /* Persist */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Cart write error:", e);
    }
  }, [items, hydrated]);

  /* Cross-tab sync */
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { setItems(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ESC */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Actions */
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((product, qty = 1, { open = true } = {}) => {
    setItems((prev) => {
      const key = lineKey(product);
      if (!key) return prev;                    // refuse items without slug

      const existingIdx = prev.findIndex((p) => lineKey(p) === key);

      if (existingIdx !== -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          qty: (copy[existingIdx].qty || 1) + qty,
        };
        return copy;
      }

      return [...prev, { ...product, qty }];
    });

    if (open) setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug, customizations = null) => {
    setItems((prev) =>
      prev.filter((p) =>
        customizations
          ? lineKey(p) !== lineKey({ slug, customizations })
          : p.slug !== slug
      )
    );
  }, []);

  /* updateQty now needs the full line, not just slug — two lines may share slug */
  const updateQty = useCallback((target, qty) => {
    const key = typeof target === "string" ? target : lineKey(target);
    if (qty <= 0) {
      setItems((prev) => prev.filter((p) => lineKey(p) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((p) => (lineKey(p) === key ? { ...p, qty } : p))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  /* Derived */
  const count = items.reduce((sum, p) => sum + (p.qty || 1), 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * (p.qty || 1), 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const value = useMemo(
    () => ({
      items,
      isOpen,
      count,
      subtotal,
      tax,
      total,
      hydrated,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }),
    [
      items,
      isOpen,
      count,
      subtotal,
      tax,
      total,
      hydrated,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}