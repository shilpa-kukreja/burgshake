import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name must be under 60 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone must be a 10-digit number"],
    },

    /* Only admins use passwords. Regular users auth via OTP. */
    password: {
      type: String,
      select: false,
      minlength: [6, "Password must be at least 6 characters"],
      required: function () {
        return this.role === "admin";
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* Set when the user first verifies via OTP */
    verifiedAt: {
      type: Date,
      default: null,
    },

    lastLoginAt: Date,
  },
  { timestamps: true }
);

/* Hash password only if present + modified */
userSchema.pre("save", async function () {
  if (!this.password) return;
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

/* Safe compare — returns false for users without a password */
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    verifiedAt: this.verifiedAt,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;