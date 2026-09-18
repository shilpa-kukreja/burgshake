import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

function buildUrl(req, filename) {
  const base =
    env.SERVER_URL ||
    `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${filename}`;
}

/* POST /api/admin/upload/single */
export async function uploadSingleFile(req, res, next) {
  try {
    if (!req.file) throw new ApiError(400, "No file uploaded");
    res.json(
      new ApiResponse(
        200,
        { url: buildUrl(req, req.file.filename) },
        "Uploaded"
      )
    );
  } catch (err) {
    next(err);
  }
}

/* POST /api/admin/upload/multiple */
export async function uploadMultipleFiles(req, res, next) {
  try {
    if (!req.files?.length) throw new ApiError(400, "No files uploaded");
    const urls = req.files.map((f) => buildUrl(req, f.filename));
    res.json(
      new ApiResponse(200, { urls }, `${urls.length} files uploaded`)
    );
  } catch (err) {
    next(err);
  }
}