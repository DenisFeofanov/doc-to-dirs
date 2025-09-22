import express from "express";
import getStatus from "./services/getStatus.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.type("text").send("Backend is running");
});

router.get("/status", (_req, res) => {
  const payload = getStatus();

  res.json(payload);
});

export default router;
