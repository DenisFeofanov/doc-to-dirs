import cors from "cors";
import express from "express";
import { getLevel, logger } from "./logger.js";
import router from "./router.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  logger.info("Incoming request", { method: req.method, path: req.path });
  next();
});
app.use("/", router);
app.use((err, _req, res, _next) => {
  logger.error("Unhandled error", { message: err?.message, stack: err?.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info("Server started", { port, level: getLevel() });
});
