import winston from "winston";
import config from "./config.js";

let logLevel;
if (config.logLevel) {
  logLevel = config.logLevel;
} else {
  switch (config.nodeEnv) {
    case "production":
      logLevel = "info";
      break;
    case "development":
      logLevel = "debug";
      break;
    default:
      logLevel = "debug";
      break;
  }
}
const isDevelopment = config.nodeEnv === "development";

const developmentFormat = winston.format.combine(
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "stack"],
  }),
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(info => {
    const { timestamp, level, message, stack, metadata } = info;
    const metadataIsPresent = metadata && Object.keys(metadata).length > 0;

    const lines = [`${timestamp} ${level}: ${message}`];
    if (stack) {
      lines.push(stack);
    }
    if (metadataIsPresent) {
      lines.push(JSON.stringify(metadata, null, 2));
    }
    return lines.join("\n");
  })
);

const productionFormat = winston.format.combine(
  winston.format.metadata({
    fillExcept: ["message", "level", "timestamp", "stack"],
  }),
  winston.format.errors({ stack: true }),
  winston.format.timestamp(),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: logLevel,
  levels: winston.config.npm.levels,
  format: isDevelopment ? developmentFormat : productionFormat,
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
