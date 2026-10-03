import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // auto-delete after 5 minutes
  },
});

const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
export default Otp;