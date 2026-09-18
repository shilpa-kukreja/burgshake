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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

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
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const FALLBACK = {
  user: null,
  hydrated: false,
  isAdmin: false,
  login: async () => ({ ok: false, error: "AuthProvider missing" }),
  signup: async () => ({ ok: false, error: "AuthProvider missing" }),
  logout: () => {},
  updateProfile: async () => ({ ok: false, error: "AuthProvider missing" }),
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx || FALLBACK;
}