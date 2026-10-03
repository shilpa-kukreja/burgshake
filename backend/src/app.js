import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { errorHandler , notFound  } from "../middlewares/error.middleware.js";
import uploadRoutes from "../routes/upload.routes.js";
import authRoutes from "../routes/auth.routes.js";
import wishlistRoutes from "../routes/wishlist.routes.js";
import { env } from "../config/env.js";

import adminMenuRoutes  from "../routes/menu.admin.routes.js";
import publicMenuRoutes from "../routes/menu.public.routes.js";
import Contactrouter from "../routes/admin.contact.routes.js";
import SubmitContactRouter from "../routes/contact.routes.js";
import adminrouter from "../routes/admin.routes.js";
import Categoryrouter from "../routes/category.routes.js";

import subscriberRoutes      from "../routes/subscriber.routes.js";
import adminSubscriberRoutes from "../routes/subscriber.admin.routes.js";

import couponPublicRoutes from "../routes/coupon.public.routes.js";
import couponAdminRoutes from "../routes/coupon.admin.routes.js";

import Orderrouter from "../routes/order.routes.js";
import orderAdminRoutes from "../routes/order.admin.routes.js";

import blogPublicRoutes from "../routes/blog.public.routes.js";
import blogAdminRoutes from "../routes/blog.admin.routes.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Security */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(cookieParser());

app.use(
  cors({
    origin: env.CLIENT_URL.split(",").map((s) => s.trim()),
    credentials: true,
  })
);

/* Rate Limiting */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* Parsers */
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

/* Logging */
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* Health Check */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Burgshake API is running 🍔",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

/* Routes */
app.use("/api/auth", authRoutes);

app.use("/api/menu",  publicMenuRoutes);   // PUBLIC  — no auth
app.use("/api/admin", adminMenuRoutes);    // ADMIN   — protect + adminOnly



app.use("/api/admin", adminrouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", Contactrouter);
app.use("/api/submit/contact",SubmitContactRouter);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/categories", Categoryrouter);

app.use("/api/subscribe",        subscriberRoutes);       // public
app.use("/api/admin/subscribers", adminSubscriberRoutes); // admin

app.use("/api/coupons", couponPublicRoutes);
app.use("/api/admin/coupons", couponAdminRoutes);


app.use("/api/orders",       Orderrouter);        // public
app.use("/api/admin/orders", orderAdminRoutes);   // admin


app.use("/api/blogs", blogPublicRoutes);        // public
app.use("/api/admin/blogs", blogAdminRoutes);   // admin

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Burgshake API is running",
  });
});

/* Error Handling - MUST BE LAST */
app.use(notFound);
app.use(errorHandler);

export default app;