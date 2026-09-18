"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "burgshake_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* ── Read from localStorage on mount ─────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Cart read error:", e);
    }
    setHydrated(true);
  }, []);

  
 useEffect(() => {
  if (!hydrated) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // ⚠️ Do NOT dispatch cart:updated here — the listener above already listens
    // to that event, and re-firing it creates an infinite loop.
  } catch (e) {
    console.error("Cart write error:", e);
  }
}, [items, hydrated]);

  /* ── Listen to external cart updates (from featured/menu cards) ── */
  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {}
    };
    window.addEventListener("cart:updated", refresh);
    return () => window.removeEventListener("cart:updated", refresh);
  }, []);

  /* ── Body scroll lock when drawer open ───────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── ESC key closes drawer ────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Public actions ───────────────────────────────── */
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  /* ── Derived values ───────────────────────────────── */
  const count = items.reduce((sum, p) => sum + (p.qty || 1), 0);
  const subtotal = items.reduce(
    (sum, p) => sum + p.price * (p.qty || 1),
    0
  );
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;

  const value = {
    items,
    isOpen,
    count,
    subtotal,
    tax,
    total,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}