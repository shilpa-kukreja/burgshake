import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/* ═══════════════════════════════════════════════════
   Uploads are stored and returned as RELATIVE paths.

   We deliberately do NOT prefix the request origin
   (http://localhost:4000 or https://api.burgshake.com).
   That would bake a specific host into the database, so
   the same document would break the moment you deploy
   to a different domain.

   The frontend resolves these at render time using
   resolveImageUrl() in lib/api.js — prepending the
   correct API base URL for whichever environment it's
   running in.
   ═══════════════════════════════════════════════════ */

function toRelativePath(filename) {
  return `/uploads/${filename}`;
}

/* POST /api/admin/upload/single */
export async function uploadSingleFile(req, res, next) {
  try {
    if (!req.file) throw new ApiError(400, "No file uploaded");

    res.json(
      new ApiResponse(
        200,
        { url: toRelativePath(req.file.filename) },
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

    const urls = req.files.map((f) => toRelativePath(f.filename));

    res.json(
      new ApiResponse(200, { urls }, `${urls.length} files uploaded`)
    );
  } catch (err) {
    next(err);
  }
}