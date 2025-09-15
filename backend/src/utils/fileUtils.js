import path from "path";

/**
 * Fixes filename encoding issues, particularly with Cyrillic characters
 * that may have been encoded as latin1 and need to be decoded as UTF-8
 */
export const fixFilenameEncoding = originalName => {
  if (typeof originalName !== "string" || originalName.length === 0) {
    return originalName;
  }

  const isLatin1Only = /^[\x00-\xff]*$/.test(originalName);
  const decoded = Buffer.from(originalName, "latin1").toString("utf8");
  const hasReplacement = decoded.includes("\ufffd");
  const hasCyrillic = /[\u0400-\u04FF]/.test(decoded);

  if (isLatin1Only && !hasReplacement && hasCyrillic) {
    return decoded;
  }

  return originalName;
};

/**
 * Sanitizes filename by removing invalid characters
 */
export const sanitizeFilename = filename => {
  if (!filename) return filename;
  return filename.replace(/[\\\/:*?"<>|]/g, "_");
};

/**
 * Checks if filename has an extension
 */
export const hasExtension = filename => {
  return filename && filename.includes(".");
};

/**
 * Gets file extension from filename
 */
export const getFileExtension = filename => {
  return hasExtension(filename) ? filename.split(".").pop()?.toLowerCase() : "";
};

/**
 * Validates file extension against allowed extensions
 */
export const validateFileExtension = (filename, allowedExtensions) => {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return true; // Allow any extension if none specified
  }

  const extension = getFileExtension(filename);
  return allowedExtensions.includes(extension);
};

/**
 * Creates a safe filename by fixing encoding and sanitizing
 */
export const createSafeFilename = originalName => {
  const fixed = fixFilenameEncoding(originalName);
  const base = path.basename(fixed);
  return sanitizeFilename(base);
};
