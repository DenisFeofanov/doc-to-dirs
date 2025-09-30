// all env variables in one place without business logic
export default {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "production", // production || development
  logLevel: process.env.LOG_LEVEL, // check logger.js for available levels
};
