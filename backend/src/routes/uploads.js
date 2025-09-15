import { Router } from "express";
import multer from "multer";
import {
  uploadFiles,
  getUpload,
  deleteUpload,
} from "../controllers/uploadController.js";
import { validateUploadedFiles } from "../middleware/validation.js";
import config from "../config/index.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: config.upload.tmpDir,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

/**
 * @route POST /api/uploads
 * @desc Upload files (report, layout, and other files)
 * @access Public
 * @body reportFile: single .xls file
 * @body layoutFile: single .dxf or .dwg file
 * @body otherFiles: multiple files of any type (optional)
 */
router.post(
  "/",
  upload.fields([
    { name: "reportFile", maxCount: config.upload.maxFiles.reportFile },
    { name: "layoutFile", maxCount: config.upload.maxFiles.layoutFile },
    { name: "otherFiles", maxCount: config.upload.maxFiles.otherFiles },
  ]),
  validateUploadedFiles,
  uploadFiles
);

/**
 * @route GET /api/uploads/:uploadId
 * @desc Get upload information by ID
 * @access Public
 */
router.get("/:uploadId", getUpload);

/**
 * @route DELETE /api/uploads/:uploadId
 * @desc Delete upload by ID
 * @access Public
 */
router.delete("/:uploadId", deleteUpload);

export default router;
