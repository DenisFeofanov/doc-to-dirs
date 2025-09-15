import { Router } from "express";
import healthRoutes from "./health.js";
import uploadRoutes from "./uploads.js";

const router = Router();

// Mount route modules
router.use("/health", healthRoutes);
router.use("/uploads", uploadRoutes);

// Root endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    version: "2.0.0",
    endpoints: {
      health: "/api/health",
      uploads: "/api/uploads",
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
