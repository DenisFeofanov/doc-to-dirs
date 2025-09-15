import { logger } from "../logger.js";
import { sendError } from "../utils/responseUtils.js";

/**
 * Global error handling middleware
 */
export const errorHandler = (error, req, res, next) => {
  // Log the error
  logger.error("Unhandled error", {
    message: error?.message,
    stack: error?.stack,
    path: req.path,
    method: req.method,
  });

  // Don't send stack trace in production
  const isDevelopment = process.env.NODE_ENV === "development";
  const errorResponse = {
    message: error.message || "Internal Server Error",
    ...(isDevelopment && { stack: error.stack }),
  };

  // Handle specific error types
  if (error.name === "ValidationError") {
    return sendError(res, errorResponse, 400);
  }

  if (error.name === "MulterError") {
    let message = "File upload error";
    let statusCode = 400;

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;
      default:
        message = error.message;
    }

    return sendError(res, message, statusCode);
  }

  // Default to 500 for unknown errors
  return sendError(res, errorResponse, 500);
};

/**
 * 404 handler for routes that don't exist
 */
export const notFoundHandler = (req, res) => {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
};
