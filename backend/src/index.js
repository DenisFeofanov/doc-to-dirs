import express from "express";
import cors from "cors";
import { logger, getLevel } from "./logger.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info("Incoming request", { method: req.method, path: req.path });
  next();
});

app.get("/status", (req, res) => {
  const payload = { status: "ok", time: new Date().toISOString() };
  logger.debug("Reporting status", payload);
  res.json(payload);
});

app.get("/", (req, res) => {
  res.type("text").send("Backend is running. See /status");
});

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err?.message, stack: err?.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info("Server started", { port, level: getLevel() });
});
