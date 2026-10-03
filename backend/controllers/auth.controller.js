import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
} from "../utils/token.js";
import { sendOtpSms } from "../services/sms.service.js";

/* ── Helpers ─────────────────────────────────────────── */

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_TTL_MS = 5 * 60 * 1000;       // 5 minutes
const OTP_COOLDOWN_MS = 60 * 1000;      // 1 min between sends to same phone
const OTP_MAX_ATTEMPTS = 5;

/* ═══════════════════════════════════════════════════
   POST /api/auth/send-otp
   Public — send a 6-digit OTP to a phone
   ═══════════════════════════════════════════════════ */
export async function sendOtp(req, res, next) {
  try {
    const phone = String(req.body.phone || "").trim();

    if (!/^\d{10}$/.test(phone)) {
      throw new ApiError(400, "Phone must be 10 digits.");
    }

    /* Per-phone cooldown */
    const existing = await Otp.findOne({ phone });
    if (existing) {
      const age = Date.now() - new Date(existing.createdAt).getTime();
      if (age < OTP_COOLDOWN_MS) {
        const wait = Math.ceil((OTP_COOLDOWN_MS - age) / 1000);
        throw new ApiError(
          429,
          `Please wait ${wait}s before requesting another OTP.`
        );
      }
    }

    const otp = generateOtp();

    /* Upsert — resets attempts and createdAt */
    await Otp.findOneAndUpdate(
      { phone },
      { phone, otp, attempts: 0, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOtpSms(phone, otp);

    res.json(new ApiResponse(200, null, "OTP sent successfully"));
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/auth/verify-otp
   Public — verify OTP. Creates the user if new.
   Body: { phone, otp, name?, email? }
   ═══════════════════════════════════════════════════ */
export async function verifyOtp(req, res, next) {
  try {
    const phone = String(req.body.phone || "").trim();
    const otp = String(req.body.otp || "").trim();
    const name = req.body.name ? String(req.body.name).trim() : "";
    const email = req.body.email
      ? String(req.body.email).trim().toLowerCase()
      : "";

    if (!/^\d{10}$/.test(phone)) {
      throw new ApiError(400, "Phone must be 10 digits.");
    }
    if (!/^\d{6}$/.test(otp)) {
      throw new ApiError(400, "OTP must be 6 digits.");
    }

    /* Look up the OTP record */
    const record = await Otp.findOne({ phone });
    if (!record) {
      throw new ApiError(400, "OTP expired or not found. Request a new one.");
    }

    /* Manual age check — TTL deletion can lag by up to 60s */
    const age = Date.now() - new Date(record.createdAt).getTime();
    if (age > OTP_TTL_MS) {
      await Otp.deleteOne({ _id: record._id });
      throw new ApiError(400, "OTP expired. Request a new one.");
    }

    /* Brute-force guard */
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: record._id });
      throw new ApiError(
        429,
        "Too many wrong attempts. Request a new OTP."
      );
    }

    /* Wrong code */
    if (record.otp !== otp) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      throw new ApiError(400, "Invalid OTP.");
    }

    /* Correct — burn the OTP immediately so it can't be reused */
    await Otp.deleteOne({ _id: record._id });

    /* Find or create the user */
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      if (!name || !email) {
        throw new ApiError(
          400,
          "Name and email are required for new signups."
        );
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new ApiError(400, "Invalid email address.");
      }

      /* Email must be free */
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        throw new ApiError(
          409,
          "This email is already linked to another account."
        );
      }

      user = await User.create({
        name,
        email,
        phone,
        role: "user",
        verifiedAt: new Date(),
        lastLoginAt: new Date(),
      });
      isNewUser = true;
    } else {
      if (!user.isActive) {
        throw new ApiError(403, "Account has been deactivated.");
      }
      /* First-time OTP verification (e.g. pre-existing user) */
      if (!user.verifiedAt) user.verifiedAt = new Date();
      user.lastLoginAt = new Date();
      await user.save();
    }

    /* Issue JWT (same shape as admin login) */
    const token = signToken({ id: user._id, role: user.role });
    setAuthCookie(res, token);

    res.json(
      new ApiResponse(
        200,
        {
          user: user.toSafeObject(),
          token,
          isNewUser,
        },
        isNewUser
          ? "Account created successfully"
          : "Signed in successfully"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   POST /api/auth/login  (ADMIN ONLY)
   ═══════════════════════════════════════════════════ */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    /* Only admins use email + password */
    if (user.role !== "admin") {
      throw new ApiError(
        403,
        "Please sign in with your phone number instead."
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account has been deactivated.");
    }

    user.lastLoginAt = new Date();
    await user.save();

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





