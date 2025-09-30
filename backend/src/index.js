import cors from "cors";
import express from "express";
import { getLevel, logger } from "./logger.js";
import router from "./router.js";
import config from "./config.js";

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  logger.debug("Incoming request", {
    method: req.method,
    path: req.path,
  });
  next();
});
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    logger.info("Response sent", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      contentLength: res.get("Content-Length"),
      contentType: res.get("Content-Type"),
      duration: Date.now() - startTime,
    });
  });
  next();
});

app.use("/", router);

app.use((err, _req, res, _next) => {
  logger.error("Unhandled error", { message: err?.message, stack: err?.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info("Server started", {
    port,
    level: getLevel(),
    nodeEnv: config.nodeEnv,
  });
});
