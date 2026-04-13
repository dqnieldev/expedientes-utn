import express from "express";
import { listarLogs } from "../controllers/audit.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", verifyToken, authorizeRoles("ADMIN"), listarLogs);

export default router;