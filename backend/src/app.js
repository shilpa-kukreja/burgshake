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
import Menurouter from "../routes/menu.routes.js";
import Orderrouter from "../routes/order.routes.js";
import Contactrouter from "../routes/admin.contact.routes.js";
import adminrouter from "../routes/admin.routes.js";
import Categoryrouter from "../routes/category.routes.js";


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Security */
app.use(helmet());
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
app.use("/api/admin", Menurouter);
app.use("/api/admin", adminrouter);
app.use("/api/orders", Orderrouter);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", Contactrouter);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/categories", Categoryrouter);



/* Error Handling - MUST BE LAST */
app.use(notFound);
app.use(errorHandler);

export default app;