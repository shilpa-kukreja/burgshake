import { Router } from "express";
import { body } from "express-validator";

import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  adminUpdatePaymentStatus,
  adminDeleteOrder,
  adminOrderStats,
} from "../controllers/order.admin.controller.js";
import {
  adminListUsers,
  adminGetUser,
  adminUpdateUserRole,
  adminToggleUserActive,
  adminDeleteUser,
  adminUserStats,
} from "../controllers/user.admin.controller.js";


import {
  adminListContacts,
  adminGetContact,
  adminUpdateContactStatus,
  adminDeleteContact,
  adminContactStats,
} from "../controllers/contact.admin.controller.js";


import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminToggleCategoryActive,
  adminDeleteCategory,
  adminReorderCategories,
} from "../controllers/category.admin.controller.js";

import { validate } from "../middlewares/validate.middleware.js";


import { adminDashboard } from "../controllers/dashboard.admin.controller.js";

const adminrouter = Router();

/* ── Order stats ─────────────────────────────────── */
adminrouter.get("/orders/stats/summary", adminOrderStats);

/* ── Order CRUD ──────────────────────────────────── */
adminrouter.get("/orders", adminListOrders);
adminrouter.get("/orders/:orderNumber", adminGetOrder);
adminrouter.patch("/orders/:orderNumber/status", adminUpdateOrderStatus);
adminrouter.patch("/orders/:orderNumber/payment", adminUpdatePaymentStatus);
adminrouter.delete("/orders/:orderNumber", adminDeleteOrder);
   
/* ════════════════════════════════════════════════════ */
adminrouter.get("/dashboard", adminDashboard);

/* ═══════════════════════════════════════════════
   USER MANAGEMENT
   ═══════════════════════════════════════════════ */
adminrouter.get("/users/stats/summary", adminUserStats);
adminrouter.get("/users", adminListUsers);
adminrouter.get("/users/:id", adminGetUser);
adminrouter.patch("/users/:id/role", adminUpdateUserRole);
adminrouter.patch("/users/:id/toggle-active", adminToggleUserActive);
adminrouter.delete("/users/:id", adminDeleteUser);


// Contact
adminrouter.get("/contacts/stats/summary", adminContactStats);
adminrouter.get("/contacts", adminListContacts);
adminrouter.get("/contacts/:id", adminGetContact);
adminrouter.patch("/contacts/:id/status", adminUpdateContactStatus);
adminrouter.delete("/contacts/:id", adminDeleteContact);

// Category

adminrouter.get("/categories", adminListCategories);
adminrouter.post(
  "/categories",
  [
    body("name").trim().isLength({ min: 2, max: 40 }),
    body("order").optional().isNumeric(),
    body("isActive").optional().isBoolean(),
  ],
  validate,
  adminCreateCategory
);
adminrouter.patch("/categories/:slug", adminUpdateCategory);
adminrouter.patch("/categories/:slug/toggle-active", adminToggleCategoryActive);
adminrouter.delete("/categories/:slug", adminDeleteCategory);
adminrouter.post("/categories/reorder", adminReorderCategories);



export default adminrouter;