import path from "path";

const config = {
  // Server configuration
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    env: process.env.NODE_ENV || "development",
  },

  // File upload configuration
  upload: {
    tmpDir: path.join(process.cwd(), "uploads_tmp"),
    finalDir: path.join(process.cwd(), "uploads"),
    maxFileSize: 50 * 1024 * 1024, // 50MB
    maxFiles: {
      reportFile: 1,
      layoutFile: 1,
      otherFiles: 50,
    },
    allowedExtensions: {
      reportFile: ["xls"],
      layoutFile: ["dxf", "dwg"],
      otherFiles: [], // Allow any extension for other files
    },
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};

export default config;
