"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "burgshake_wishlist";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* ── Read from localStorage ─────────────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Wishlist read error:", e);
    }
    setHydrated(true);
  }, []);

  /* ── Persist to localStorage (NO dispatch — avoids loop) ── */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Wishlist write error:", e);
    }
  }, [items, hydrated]);

  /* ── Body scroll lock when drawer open ───────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── ESC closes drawer ───────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Actions ─────────────────────────────────────── */
  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => setIsOpen((v) => !v), []);

  const isWishlisted = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const toggleItem = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          desc: product.desc,
          rating: product.rating,
          mrp: product.mrp,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const count = items.length;

  const value = {
    items,
    isOpen,
    count,
    openWishlist,
    closeWishlist,
    toggleWishlistDrawer,
    isWishlisted,
    toggleItem,
    removeItem,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/* Safe fallback — avoids crashes if used outside provider */
const FALLBACK = {
  items: [],
  isOpen: false,
  count: 0,
  openWishlist: () => {},
  closeWishlist: () => {},
  toggleWishlistDrawer: () => {},
  isWishlisted: () => false,
  toggleItem: () => {},
  removeItem: () => {},
  clearWishlist: () => {},
};

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx && typeof window !== "undefined") {
    console.warn(
      "[Burgshake] useWishlist() called outside <WishlistProvider>. Using fallback."
    );
  }
  return ctx || FALLBACK;
}