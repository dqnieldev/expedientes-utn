import express from "express";
import { listarLogs } from "../controllers/audit.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Solo DEVELOPER ve los logs
router.get("/", verifyToken, authorizeRoles("DEVELOPER"), listarLogs);

export default router;