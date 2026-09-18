import { ApiError } from "../utils/ApiError.js";

export function adminOnly(req, res, next) {
  if (!req.user) {
    return next(new ApiError(401, "Not authenticated."));
  }
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access only."));
  }
  next();
}