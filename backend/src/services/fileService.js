import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { logger } from "../logger.js";
import { createSafeFilename } from "../utils/fileUtils.js";
import config from "../config/index.js";

export class FileService {
  constructor() {
    this.initializeDirectories();
  }

  /**
   * Initialize upload directories
   */
  initializeDirectories() {
    try {
      fs.mkdirSync(config.upload.tmpDir, { recursive: true });
      fs.mkdirSync(config.upload.finalDir, { recursive: true });
      logger.info("Upload directories initialized", {
        tmpDir: config.upload.tmpDir,
        finalDir: config.upload.finalDir,
      });
    } catch (error) {
      logger.error("Failed to initialize directories", {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Process uploaded files and move them to final directory
   */
  async processUploadedFiles(files) {
    const uploadId = randomUUID();
    const targetDir = path.join(config.upload.finalDir, uploadId);

    try {
      // Create target directory
      await fs.promises.mkdir(targetDir, { recursive: true });

      const processedFiles = {
        uploadId,
        reportFile: null,
        layoutFile: null,
        otherFiles: [],
      };

      // Process report file
      if (files.reportFile && files.reportFile[0]) {
        processedFiles.reportFile = await this.moveFile(
          files.reportFile[0],
          targetDir
        );
      }

      // Process layout file
      if (files.layoutFile && files.layoutFile[0]) {
        processedFiles.layoutFile = await this.moveFile(
          files.layoutFile[0],
          targetDir
        );
      }

      // Process other files
      if (files.otherFiles && files.otherFiles.length > 0) {
        for (const file of files.otherFiles) {
          const movedFile = await this.moveFile(file, targetDir);
          processedFiles.otherFiles.push(movedFile);
        }
      }

      const totalFiles =
        (processedFiles.reportFile ? 1 : 0) +
        (processedFiles.layoutFile ? 1 : 0) +
        processedFiles.otherFiles.length;

      logger.info("Files processed successfully", {
        uploadId,
        totalFiles,
        targetDir,
      });

      return processedFiles;
    } catch (error) {
      // Cleanup on failure
      await this.cleanupDirectory(targetDir);
      throw error;
    }
  }

  /**
   * Move a single file from temp to target directory
   */
  async moveFile(file, targetDir) {
    const fromPath = file.path; // multer temp path
    const originalName = file.originalname || file.filename;
    const safeName = createSafeFilename(originalName);
    const toPath = path.join(targetDir, safeName);

    try {
      await fs.promises.rename(fromPath, toPath);

      const fileInfo = {
        originalName,
        safeName,
        path: toPath,
        size: file.size,
        mimetype: file.mimetype,
      };

      logger.debug("File moved successfully", fileInfo);
      return fileInfo;
    } catch (error) {
      logger.error("Failed to move file", {
        fromPath,
        toPath,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get upload information by ID
   */
  async getUploadInfo(uploadId) {
    const uploadDir = path.join(config.upload.finalDir, uploadId);

    try {
      const exists = await fs.promises
        .access(uploadDir)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        return null;
      }

      const files = await fs.promises.readdir(uploadDir);
      const fileStats = await Promise.all(
        files.map(async filename => {
          const filePath = path.join(uploadDir, filename);
          const stats = await fs.promises.stat(filePath);
          return {
            name: filename,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
      );

      return {
        uploadId,
        directory: uploadDir,
        files: fileStats,
        totalFiles: files.length,
      };
    } catch (error) {
      logger.error("Failed to get upload info", {
        uploadId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Delete upload directory and all files
   */
  async deleteUpload(uploadId) {
    const uploadDir = path.join(config.upload.finalDir, uploadId);
    return this.cleanupDirectory(uploadDir);
  }

  /**
   * Cleanup directory (used for error handling and deletion)
   */
  async cleanupDirectory(dirPath) {
    try {
      const exists = await fs.promises
        .access(dirPath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        await fs.promises.rm(dirPath, { recursive: true, force: true });
        logger.debug("Directory cleaned up", { dirPath });
      }
    } catch (error) {
      logger.error("Failed to cleanup directory", {
        dirPath,
        error: error.message,
      });
      // Don't throw here as this is cleanup
    }
  }
}

// Export singleton instance
export const fileService = new FileService();
