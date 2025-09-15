import { logger } from "../logger.js";

/**
 * Middleware to log all incoming requests
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
