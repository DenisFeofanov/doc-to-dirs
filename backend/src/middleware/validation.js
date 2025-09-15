import { validateFileExtension } from "../utils/fileUtils.js";
import { sendError } from "../utils/responseUtils.js";
import config from "../config/index.js";

/**
 * Validates uploaded files according to configuration
 */
export const validateUploadedFiles = (req, res, next) => {
  try {
    const files = req.files || {};
    const { reportFile = [], layoutFile = [], otherFiles = [] } = files;

    // Check required files
    if (reportFile.length === 0) {
      return sendError(res, "Missing reportFile (.xls)", 400);
    }

    if (layoutFile.length === 0) {
      return sendError(res, "Missing layoutFile (.dxf or .dwg)", 400);
    }

    const report = reportFile[0];
    const layout = layoutFile[0];

    // Validate report file extension
    if (
      !validateFileExtension(
        report.originalname,
        config.upload.allowedExtensions.reportFile
      )
    ) {
      return sendError(
        res,
        `reportFile must be one of: ${config.upload.allowedExtensions.reportFile.join(
          ", "
        )}`,
        400
      );
    }

    // Validate layout file extension
    if (
      !validateFileExtension(
        layout.originalname,
        config.upload.allowedExtensions.layoutFile
      )
    ) {
      return sendError(
        res,
        `layoutFile must be one of: ${config.upload.allowedExtensions.layoutFile.join(
          ", "
        )}`,
        400
      );
    }

    // Validate file counts
    if (reportFile.length > config.upload.maxFiles.reportFile) {
      return sendError(
        res,
        `Too many report files. Maximum: ${config.upload.maxFiles.reportFile}`,
        400
      );
    }

    if (layoutFile.length > config.upload.maxFiles.layoutFile) {
      return sendError(
        res,
        `Too many layout files. Maximum: ${config.upload.maxFiles.layoutFile}`,
        400
      );
    }

    if (otherFiles.length > config.upload.maxFiles.otherFiles) {
      return sendError(
        res,
        `Too many other files. Maximum: ${config.upload.maxFiles.otherFiles}`,
        400
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
