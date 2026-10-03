"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, getToken, setToken, clearToken } from "../lib/api";

const AuthContext = createContext(null);
const ORDERS_KEY = "burgshake_orders";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [orders, setOrders] = useState([]);
const [ordersHydrated, setOrdersHydrated] = useState(false);



/* Hydrate orders from localStorage */
useEffect(() => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) setOrders(JSON.parse(raw));
  } catch (e) {
    console.error("Orders read error:", e);
  }
  setOrdersHydrated(true);
}, []);

/* Persist on change */
useEffect(() => {
  if (!ordersHydrated) return;
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Orders write error:", e);
  }
}, [orders, ordersHydrated]);

const addOrder = useCallback((order) => {
  setOrders((prev) => {
    /* De-dupe by orderNumber */
    if (prev.some((o) => o.orderNumber === order.orderNumber)) return prev;
    return [order, ...prev];
  });
}, []);

const clearOrders = useCallback(() => setOrders([]), []);


  /* ── Hydrate user on mount if token exists ─────── */
  useEffect(() => {
    async function loadUser() {
      const token = getToken();
      if (!token) {
        setHydrated(true);
        return;
      }
      try {
        const res = await api.me();
        setUser(res.data.user);
      } catch {
        clearToken();
        setUser(null);
      }
      setHydrated(true);
    }
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.login(email, password);
      setToken(res.data.token);
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const signup = useCallback(async (data) => {
    try {
      const res = await api.register(data);
      setToken(res.data.token);
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);


  const sendOtp = useCallback(async (phone) => {
  return await api.sendOtp(phone);
}, []);

const verifyOtp = useCallback(async (data) => {
  const res = await api.verifyOtp(data);
  setToken(res.data.token);
  setUser(res.data.user);
  return res.data;   // { user, token, isNewUser }
}, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (patch) => {
    try {
      const res = await api.updateProfile(patch);
      setUser(res.data.user);
      return { ok: true, user: res.data.user };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const value = {
  user,
  hydrated,
  isAdmin: user?.role === "admin",
  orders,
  login,
  signup,
   sendOtp,        // ← new
  verifyOtp,      // ← new
  logout,
  updateProfile,
  addOrder,
  clearOrders,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const FALLBACK = {
  user: null,
  hydrated: false,
  isAdmin: false,
  orders: [],
  login: async () => ({ ok: false, error: "AuthProvider missing" }),
  signup: async () => ({ ok: false, error: "AuthProvider missing" }),
  sendOtp: async () => { throw new Error("AuthProvider missing"); },
  verifyOtp: async () => { throw new Error("AuthProvider missing"); },
  logout: () => {},
  updateProfile: async () => ({ ok: false, error: "AuthProvider missing" }),
  addOrder: () => {},
  clearOrders: () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || FALLBACK;
}