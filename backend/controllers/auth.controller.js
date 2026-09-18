import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
} from "../utils/token.js";

/* ═══════════════════════════════════════════════════
   POST /api/auth/register
   ═══════════════════════════════════════════════════ */
export async function register(req, res, next) {
  try {
    const { name, email, phone, password } = req.body;

    /* Check duplicate email */
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    /* Create user — password hashed by pre-save hook */
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
    });

    /* Sign token + set cookie */
    const token = signToken({ id: user._id, role: user.role });
    setAuthCookie(res, token);

    res.status(201).json(
      new ApiResponse(
        201,
        { user: user.toSafeObject(), token },
        "Account created successfully"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/auth/login
   ═══════════════════════════════════════════════════ */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    /* Find user WITH password */
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    /* Verify password */
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account has been deactivated.");
    }

    /* Update last login */
    user.lastLoginAt = new Date();
    await user.save();

    /* Sign token */
    const token = signToken({ id: user._id, role: user.role });
    setAuthCookie(res, token);

    res.json(
      new ApiResponse(
        200,
        { user: user.toSafeObject(), token },
        "Signed in successfully"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/auth/logout
   ═══════════════════════════════════════════════════ */
export async function logout(req, res, next) {
  try {
    clearAuthCookie(res);
    res.json(new ApiResponse(200, null, "Signed out successfully"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   GET /api/auth/me  (protected)
   ═══════════════════════════════════════════════════ */
export async function me(req, res, next) {
  try {
    res.json(
      new ApiResponse(200, { user: req.user.toSafeObject() }, "User profile")
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/auth/profile  (protected)
   ═══════════════════════════════════════════════════ */
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, email } = req.body;

    const user = req.user;

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    /* Email change → check uniqueness */
    if (email && email.toLowerCase() !== user.email) {
      const taken = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id },
      });
      if (taken) {
        throw new ApiError(409, "This email is already in use.");
      }
      user.email = email.toLowerCase().trim();
    }

    await user.save();

    res.json(
      new ApiResponse(200, { user: user.toSafeObject() }, "Profile updated")
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   PATCH /api/auth/password  (protected)
   ═══════════════════════════════════════════════════ */
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) throw new ApiError(404, "User not found.");

    const ok = await user.comparePassword(currentPassword);
    if (!ok) {
      throw new ApiError(401, "Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    res.json(new ApiResponse(200, null, "Password changed successfully"));
  } catch (err) {
    next(err);
  }
}





