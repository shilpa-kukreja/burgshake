const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const TOKEN_KEY = "burgshake_admin_token";

/* ── Token helpers ─────────────────────────────── */
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/* ── Core fetch wrapper ────────────────────────── */
async function request(path, options = {}) {
  const { method = "GET", body, headers = {}, auth = true } = options;

  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  let json;
  try {
    json = await res.json();
  } catch {
    json = { success: false, message: "Invalid server response" };
  }

  if (!res.ok) {
    const error = new Error(json.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.errors = json.errors || [];
    error.data = json;
    throw error;
  }

  return json;
}

/* ── File upload helper ────────────────────────── */
async function uploadFile(path, formData) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json.message || "Upload failed");
    err.status = res.status;
    throw err;
  }
  return json;
}

/* ═══════════════════════════════════════════════════
   API
   ═══════════════════════════════════════════════════ */
export const api = {
  /* ═══════════════════════════════════════════════
     AUTH
     ═══════════════════════════════════════════════ */
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  register: (data) =>
    request("/api/auth/register", {
      method: "POST",
      body: data,
      auth: false,
    }),

  me: () => request("/api/auth/me"),

  logout: () => {
    clearToken();
    return Promise.resolve();
  },

  updateProfile: (data) =>
    request("/api/auth/profile", { method: "PATCH", body: data }),

  changePassword: (data) =>
    request("/api/auth/password", { method: "PATCH", body: data }),

  /* ═══════════════════════════════════════════════
     PUBLIC — MENU
     ═══════════════════════════════════════════════ */
  getMenu: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/menu${q ? `?${q}` : ""}`, { auth: false });
  },

  getMenuById: (slug) =>
    request(`/api/menu/${slug}`, { auth: false }),

  getMenuCategories: () =>
    request("/api/menu/categories/list", { auth: false }),

  getFeaturedBestsellers: () =>
    request("/api/menu/featured/bestsellers", { auth: false }),

  /* ═══════════════════════════════════════════════
     PUBLIC — CATEGORIES
     ═══════════════════════════════════════════════ */
  getCategories: () => request("/api/categories", { auth: false }),

  /* ═══════════════════════════════════════════════
     PUBLIC — CONTACT
     ═══════════════════════════════════════════════ */
  submitContact: (data) =>
    request("/api/contact", {
      method: "POST",
      body: data,
      auth: false,
    }),

  /* ═══════════════════════════════════════════════
     ORDERS (customer)
     ═══════════════════════════════════════════════ */
  createOrder: (data) =>
    request("/api/orders", { method: "POST", body: data }),

  verifyOrderPayment: (data) =>
    request("/api/orders/verify", { method: "POST", body: data }),

  getMyOrders: () => request("/api/orders/my"),

  getOrderByNumber: (orderNumber) =>
    request(`/api/orders/${orderNumber}`),

  cancelOrder: (orderNumber) =>
    request(`/api/orders/${orderNumber}/cancel`, { method: "POST" }),

  /* ═══════════════════════════════════════════════
     WISHLIST
     ═══════════════════════════════════════════════ */
  getWishlist: () => request("/api/wishlist"),

  toggleWishlistItem: (itemId) =>
    request("/api/wishlist/toggle", {
      method: "POST",
      body: { itemId },
    }),

  addToWishlist: (itemId) =>
    request("/api/wishlist/add", {
      method: "POST",
      body: { itemId },
    }),

  removeFromWishlist: (itemId) =>
    request(`/api/wishlist/${itemId}`, { method: "DELETE" }),

  clearWishlist: () =>
    request("/api/wishlist", { method: "DELETE" }),

  moveWishlistToCart: (itemIds) =>
    request("/api/wishlist/move-to-cart", {
      method: "POST",
      body: { itemIds },
    }),

  /* ═══════════════════════════════════════════════
     UPLOAD
     ═══════════════════════════════════════════════ */
  uploadSingle: (formData) =>
    uploadFile("/api/admin/upload/single", formData),

  uploadMultiple: (formData) =>
    uploadFile("/api/admin/upload/multiple", formData),

  /* ═══════════════════════════════════════════════
     ADMIN — DASHBOARD
     ═══════════════════════════════════════════════ */
  adminDashboard: () => request("/api/admin/dashboard"),

  /* ═══════════════════════════════════════════════
     ADMIN — MENU
     ═══════════════════════════════════════════════ */
  adminListMenu: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/admin/menu${q ? `?${q}` : ""}`);
  },

  adminGetMenu: (slug) => request(`/api/admin/menu/${slug}`),

  adminCreateMenu: (data) =>
    request("/api/admin/menu", { method: "POST", body: data }),

  adminUpdateMenu: (slug, data) =>
    request(`/api/admin/menu/${slug}`, { method: "PATCH", body: data }),

  adminDeleteMenu: (slug) =>
    request(`/api/admin/menu/${slug}`, { method: "DELETE" }),

  adminToggleAvailability: (slug) =>
    request(`/api/admin/menu/${slug}/toggle-availability`, {
      method: "PATCH",
    }),

  adminToggleFeatured: (slug) =>
    request(`/api/admin/menu/${slug}/toggle-featured`, {
      method: "PATCH",
    }),

  adminToggleBestseller: (slug) =>
    request(`/api/admin/menu/${slug}/toggle-bestseller`, {
      method: "PATCH",
    }),

  adminMenuStats: () => request("/api/admin/menu/stats/summary"),

  /* ═══════════════════════════════════════════════
     ADMIN — CATEGORIES
     ═══════════════════════════════════════════════ */
  adminListCategories: () => request("/api/admin/categories"),

  adminCreateCategory: (data) =>
    request("/api/admin/categories", { method: "POST", body: data }),

  adminUpdateCategory: (slug, data) =>
    request(`/api/admin/categories/${slug}`, {
      method: "PATCH",
      body: data,
    }),

  adminToggleCategoryActive: (slug) =>
    request(`/api/admin/categories/${slug}/toggle-active`, {
      method: "PATCH",
    }),

  adminDeleteCategory: (slug, force = false) =>
    request(
      `/api/admin/categories/${slug}${force ? "?force=true" : ""}`,
      { method: "DELETE" }
    ),

  adminReorderCategories: (order) =>
    request("/api/admin/categories/reorder", {
      method: "POST",
      body: { order },
    }),

  /* ═══════════════════════════════════════════════
     ADMIN — ORDERS
     ═══════════════════════════════════════════════ */
  adminListOrders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/admin/orders${q ? `?${q}` : ""}`);
  },

  adminGetOrder: (orderNumber) =>
    request(`/api/admin/orders/${orderNumber}`),

  adminUpdateOrderStatus: (orderNumber, status) =>
    request(`/api/admin/orders/${orderNumber}/status`, {
      method: "PATCH",
      body: { status },
    }),

  adminUpdateOrderPayment: (orderNumber, paymentStatus) =>
    request(`/api/admin/orders/${orderNumber}/payment`, {
      method: "PATCH",
      body: { paymentStatus },
    }),

  adminDeleteOrder: (orderNumber) =>
    request(`/api/admin/orders/${orderNumber}`, { method: "DELETE" }),

  adminOrderStats: () => request("/api/admin/orders/stats/summary"),

  /* ═══════════════════════════════════════════════
     ADMIN — CONTACTS
     ═══════════════════════════════════════════════ */
  adminListContacts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/admin/contacts${q ? `?${q}` : ""}`);
  },

  adminGetContact: (id) => request(`/api/admin/contacts/${id}`),

  adminUpdateContactStatus: (id, status, adminNotes) =>
    request(`/api/admin/contacts/${id}/status`, {
      method: "PATCH",
      body: { status, adminNotes },
    }),

  adminDeleteContact: (id) =>
    request(`/api/admin/contacts/${id}`, { method: "DELETE" }),

  adminContactStats: () => request("/api/admin/contacts/stats/summary"),

  /* ═══════════════════════════════════════════════
     ADMIN — USERS
     ═══════════════════════════════════════════════ */
  adminListUsers: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/admin/users${q ? `?${q}` : ""}`);
  },

  adminGetUser: (id) => request(`/api/admin/users/${id}`),

  adminUpdateUserRole: (id, role) =>
    request(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      body: { role },
    }),

  adminToggleUserActive: (id) =>
    request(`/api/admin/users/${id}/toggle-active`, { method: "PATCH" }),

  adminDeleteUser: (id) =>
    request(`/api/admin/users/${id}`, { method: "DELETE" }),

  adminUserStats: () => request("/api/admin/users/stats/summary"),
};