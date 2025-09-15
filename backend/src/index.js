import express from "express";
import cors from "cors";
import { logger, getLevel } from "./logger.js";
import config from "./config/index.js";
import routes from "./routes/index.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

// Basic middleware
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(requestLogger);

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.type("text").send("Backend is running. Visit /api for API endpoints.");
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(config.server.port, () => {
  logger.info("Server started", {
    port: config.server.port,
    environment: config.server.env,
    logLevel: getLevel(),
  });
});
