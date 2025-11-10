// backend/src/routes/metrics.js
// This file re-exports the canonical metrics from ../lib/metrics.js
import express from "express";
import { loginCounter, registerCounter, metricsMiddleware } from "../lib/metrics.js";

const router = express.Router();

// Expose the same /metrics endpoint (if used as a route)
router.get('/', metricsMiddleware);

export { loginCounter, registerCounter };
export default router;