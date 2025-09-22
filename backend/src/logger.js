import winston from "winston";

const levelFromEnv = process.env.LOG_LEVEL?.toLowerCase?.() || "info";

export const logger = winston.createLogger({
  level: levelFromEnv,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export function getLevel() {
  return logger.level;
}
