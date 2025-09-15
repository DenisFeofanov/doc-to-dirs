import { sendSuccess } from "../utils/responseUtils.js";
import { logger } from "../logger.js";

/**
 * Health check endpoint
 */
export const getHealth = (req, res) => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "unknown",
  };

  logger.debug("Health check requested", healthData);
  sendSuccess(res, healthData, "Service is healthy");
};

/**
 * Simple status endpoint for backward compatibility
 */
export const getStatus = (req, res) => {
  const statusData = {
    status: "ok",
    time: new Date().toISOString(),
  };

  logger.debug("Status check requested", statusData);
  sendSuccess(res, statusData);
};
