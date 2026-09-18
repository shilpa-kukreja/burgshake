import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

/* 404 handler — placed before the error handler */
export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

/* Central error handler */
export function errorHandler(err, req, res, next) {
  let error = err;

  /* Mongoose bad ObjectId */
  if (error.name === "CastError") {
    error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  }

  /* Mongoose validation */
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((e) => e.message);
    error = new ApiError(400, "Validation failed", errors);
  }

  /* Duplicate key */
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  /* JWT */
  if (error.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }
  if (error.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  const payload = {
    success: false,
    message,
    errors: error.errors || [],
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (env.NODE_ENV === "development") {
    console.error("❌ Error:", message);
  }

  res.status(statusCode).json(payload);
}