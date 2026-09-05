import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg"
};

export function getMaxUploadSize() {
  const configured = Number(process.env.MAX_UPLOAD_SIZE_MB);
  return Number.isFinite(configured) && configured > 0
    ? configured * 1024 * 1024
    : 10 * 1024 * 1024;
}

export function isAllowedImageType(mimeType: string) {
  return Boolean(ALLOWED_TYPES[mimeType]);
}

export function getExtensionFromMime(mimeType: string) {
  return ALLOWED_TYPES[mimeType] || null;
}

export function sanitizeOriginalName(name: string) {
  return path.basename(name).slice(0, 180) || "upload";
}

export async function ensureUploadDirectory() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  return UPLOAD_DIR;
}

export async function saveUploadedFile(file: File) {
  if (!isAllowedImageType(file.type)) {
    throw new Error("Unsupported image type");
  }

  const maxSize = getMaxUploadSize();
  if (file.size <= 0 || file.size > maxSize) {
    throw new Error(`Image must be between 1 byte and ${maxSize / 1024 / 1024}MB`);
  }

  const extension = getExtensionFromMime(file.type);
  if (!extension) throw new Error("Unsupported image type");

  const filename = `${Date.now()}-${randomUUID()}.${extension}`;
  const directory = await ensureUploadDirectory();
  const filePath = path.join(directory, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    filename,
    originalName: sanitizeOriginalName(file.name),
    url: `/uploads/${filename}`,
    mimeType: file.type,
    size: file.size
  };
}

export async function deleteUploadedFile(filename: string) {
  if (!/^[a-zA-Z0-9-]+\.(jpg|png|gif|webp|svg)$/.test(filename)) {
    throw new Error("Invalid filename");
  }

  const directory = await ensureUploadDirectory();
  const filePath = path.resolve(directory, filename);
  const expectedRoot = path.resolve(directory);

  if (!filePath.startsWith(expectedRoot + path.sep)) {
    throw new Error("Invalid file path");
  }

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}
