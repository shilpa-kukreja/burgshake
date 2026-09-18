import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";

const UPLOAD_DIR = "uploads";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new ApiError(400, "Only image files allowed (jpg, png, webp, gif)"));
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

export const uploadSingleMiddleware = multer({
  storage,
  fileFilter,
  limits,
}).single("file");

export const uploadMultipleMiddleware = multer({
  storage,
  fileFilter,
  limits,
}).array("files", 10);