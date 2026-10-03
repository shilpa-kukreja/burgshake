"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "burgshake_wishlist";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* Read */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        /* Purge legacy entries that don't have a slug */
        const cleaned = Array.isArray(parsed)
          ? parsed.filter((i) => i && i.slug)
          : [];
        setItems(cleaned);
      }
    } catch (e) {
      console.error("Wishlist read error:", e);
    }
    setHydrated(true);
  }, []);

  /* Persist */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Wishlist write error:", e);
    }
  }, [items, hydrated]);

  /* Scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ESC */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Actions */
  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => setIsOpen((v) => !v), []);

  /* ── KEY CHANGE: lookup by slug, not id ── */
  const isWishlisted = useCallback(
    (slug) => items.some((i) => i.slug === slug),
    [items]
  );

  const toggleItem = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((p) => p.slug === product.slug);

      if (exists) {
        return prev.filter((p) => p.slug !== product.slug);
      }

      return [...prev, { ...product }];
    });
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const clearWishlist = useCallback(() => setItems([]), []);

  const count = items.length;

  const value = useMemo(
    () => ({
      items,
      isOpen,
      count,
      hydrated,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
      isWishlisted,
      toggleItem,
      removeItem,
      clearWishlist,
    }),
    [
      items,
      isOpen,
      count,
      hydrated,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
      isWishlisted,
      toggleItem,
      removeItem,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

const FALLBACK = {
  items: [],
  isOpen: false,
  count: 0,
  hydrated: false,
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
  return ctx || FALLBACK;
}