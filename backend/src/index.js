import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { logger, getLevel } from "./logger.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

// Ensure base upload directories exist
const tmpUploadDir = path.join(process.cwd(), "uploads_tmp");
const finalUploadDir = path.join(process.cwd(), "uploads");
fs.mkdirSync(tmpUploadDir, { recursive: true });
fs.mkdirSync(finalUploadDir, { recursive: true });

// Configure multer to store incoming files in a temporary directory first
const upload = multer({ dest: tmpUploadDir });

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

// POST /upload expects three fields:
// - reportFile: single, .xls
// - layoutFile: single, .dxf or .dwg
// - otherFiles: multiple, any extension
app.post(
  "/upload",
  upload.fields([
    { name: "reportFile", maxCount: 1 },
    { name: "layoutFile", maxCount: 1 },
    { name: "otherFiles", maxCount: 50 },
  ]),
  async (req, res, next) => {
    try {
      const fixFilenameEncoding = originalName => {
        if (typeof originalName !== "string" || originalName.length === 0) {
          return originalName;
        }
        const isLatin1Only = /^[\x00-\xff]*$/.test(originalName);
        const decoded = Buffer.from(originalName, "latin1").toString("utf8");
        const hasReplacement = decoded.includes("\ufffd");
        const hasCyrillic = /[\u0400-\u04FF]/.test(decoded);
        if (isLatin1Only && !hasReplacement && hasCyrillic) {
          return decoded;
        }
        return originalName;
      };

      const files = req.files || {};
      const report = (files.reportFile || [])[0];
      const layout = (files.layoutFile || [])[0];
      const others = files.otherFiles || [];

      // Validate required files
      if (!report) {
        return res.status(400).json({ error: "Missing reportFile (.xls)" });
      }
      if (!layout) {
        return res
          .status(400)
          .json({ error: "Missing layoutFile (.dxf or .dwg)" });
      }

      // Validate extensions
      const hasExt = filename => filename && filename.includes(".");
      const getExt = filename =>
        hasExt(filename) ? filename.split(".").pop()?.toLowerCase() : "";

      const reportExt = getExt(report.originalname || "");
      if (reportExt !== "xls") {
        return res.status(400).json({ error: "reportFile must be .xls" });
      }

      const layoutExt = getExt(layout.originalname || "");
      if (!(layoutExt === "dxf" || layoutExt === "dwg")) {
        return res
          .status(400)
          .json({ error: "layoutFile must be .dxf or .dwg" });
      }

      const uploadId = randomUUID();
      const targetDir = path.join(finalUploadDir, uploadId);
      await fs.promises.mkdir(targetDir, { recursive: true });

      // Move files from tmp to final dir preserving original names
      const moveFile = async file => {
        const fromPath = file.path; // multer temp path
        // Decode potential latin1-mojibake to UTF-8 and sanitize
        const original = file.originalname || file.filename;
        const fixed = fixFilenameEncoding(original);
        const base = path.basename(fixed);
        const safeName = base.replace(/[\\\/:*?"<>|]/g, "_");
        const toPath = path.join(targetDir, safeName);
        await fs.promises.rename(fromPath, toPath);
        return toPath;
      };

      await moveFile(report);
      await moveFile(layout);
      for (const file of others) {
        await moveFile(file);
      }

      logger.info("Uploaded files stored", {
        uploadId,
        count: 2 + others.length,
      });
      res.json({ uploadId });
    } catch (err) {
      next(err);
    }
  }
);

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err?.message, stack: err?.stack });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info("Server started", { port, level: getLevel() });
});
