import express from "express";
import { create } from "../controllers/alumno.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// SOLO ADMIN
router.post("/", verifyToken, authorizeRoles("ADMIN"), create);

export default router;