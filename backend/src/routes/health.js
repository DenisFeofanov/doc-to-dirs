import { Router } from "express";
import { getHealth, getStatus } from "../controllers/healthController.js";

const router = Router();

/**
 * @route GET /api/health
 * @desc Get service health status
 * @access Public
 */
router.get("/", getHealth);

/**
 * @route GET /api/health/status
 * @desc Get simple status (backward compatibility)
 * @access Public
 */
router.get("/status", getStatus);

export default router;
