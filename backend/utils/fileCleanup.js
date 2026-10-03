import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import MenuItem from "../models/MenuItem.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* Must match the folder multer writes to and express.static serves from */
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

/**
 * Pull a filename out of any of these forms:
 *   http://localhost:4000/uploads/1726-abc.jpeg?x=1
 *   /uploads/1726-abc.jpeg
 *   uploads/1726-abc.jpeg
 *   1726-abc.jpeg
 * Returns null if there's no valid image filename.
 */
export function extractUploadFilename(url) {
  if (!url || typeof url !== "string") return null;

  const clean = url.split("?")[0].split("#")[0];
  const parts = clean.split("/").filter(Boolean);
  const filename = parts[parts.length - 1];

  if (!filename) return null;
  if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(filename)) return null;
  return filename;
}

/**
 * Delete one upload. Never throws.
 * Returns true if deleted / already gone, false on real errors.
 */
export async function deleteUploadFile(url) {
  const filename = extractUploadFilename(url);
  if (!filename) return false;

  /* Prevent path traversal: ensure resolved path stays inside UPLOAD_DIR */
  const fullPath = path.resolve(UPLOAD_DIR, filename);
  if (!fullPath.startsWith(UPLOAD_DIR + path.sep)) {
    console.warn("Blocked path traversal:", url);
    return false;
  }

  try {
    await fs.unlink(fullPath);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") return true; // already gone — fine
    console.error("Failed to delete upload:", fullPath, err.message);
    return false;
  }
}

/**
 * Delete many uploads, skipping any URL that's still referenced by
 * another MenuItem (protects against someone pasting a shared URL).
 * Never throws.
 */
export async function deleteUnreferencedUploads(urls = [], excludeSlug = null) {
  const unique = [...new Set(urls.filter(Boolean))];

  for (const url of unique) {
    try {
      const stillInUse = await MenuItem.exists({
        ...(excludeSlug ? { slug: { $ne: excludeSlug } } : {}),
        $or: [{ img: url }, { gallery: url }],
      });

      if (stillInUse) {
        console.log("Skipping still-referenced upload:", url);
        continue;
      }

      await deleteUploadFile(url);
    } catch (err) {
      console.error("Cleanup error for", url, err.message);
    }
  }
}