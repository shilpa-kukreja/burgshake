import { verifyToken } from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    let token = null;

    /* 1. Try httpOnly cookie */
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    /* 2. Fallback to Authorization header */
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new ApiError(401, "Not authenticated. Please sign in."));
    }

    /* Verify + attach user */
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, "User no longer exists."));
    }
    if (!user.isActive) {
      return next(new ApiError(403, "Account has been deactivated."));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}