import { fileService } from "../services/fileService.js";
import { sendSuccess, sendError } from "../utils/responseUtils.js";
import { logger } from "../logger.js";

/**
 * Handle file upload
 */
export const uploadFiles = async (req, res, next) => {
  try {
    const files = req.files || {};

    logger.info("Processing file upload", {
      reportFiles: files.reportFile?.length || 0,
      layoutFiles: files.layoutFile?.length || 0,
      otherFiles: files.otherFiles?.length || 0,
    });

    const result = await fileService.processUploadedFiles(files);

    logger.info("Upload completed successfully", {
      uploadId: result.uploadId,
      totalFiles:
        (result.reportFile ? 1 : 0) +
        (result.layoutFile ? 1 : 0) +
        result.otherFiles.length,
    });

    sendSuccess(
      res,
      { uploadId: result.uploadId },
      "Files uploaded successfully",
      201
    );
  } catch (error) {
    logger.error("Upload failed", { error: error.message });
    next(error);
  }
};

/**
 * Get upload information
 */
export const getUpload = async (req, res, next) => {
  try {
    const { uploadId } = req.params;

    if (!uploadId) {
      return sendError(res, "Upload ID is required", 400);
    }

    const uploadInfo = await fileService.getUploadInfo(uploadId);

    if (!uploadInfo) {
      return sendError(res, "Upload not found", 404);
    }

    sendSuccess(res, uploadInfo, "Upload information retrieved");
  } catch (error) {
    logger.error("Failed to get upload info", {
      uploadId: req.params.uploadId,
      error: error.message,
    });
    next(error);
  }
};

/**
 * Delete upload
 */
export const deleteUpload = async (req, res, next) => {
  try {
    const { uploadId } = req.params;

    if (!uploadId) {
      return sendError(res, "Upload ID is required", 400);
    }

    // Check if upload exists first
    const uploadInfo = await fileService.getUploadInfo(uploadId);
    if (!uploadInfo) {
      return sendError(res, "Upload not found", 404);
    }

    await fileService.deleteUpload(uploadId);

    logger.info("Upload deleted successfully", { uploadId });
    sendSuccess(res, { uploadId }, "Upload deleted successfully");
  } catch (error) {
    logger.error("Failed to delete upload", {
      uploadId: req.params.uploadId,
      error: error.message,
    });
    next(error);
  }
};
