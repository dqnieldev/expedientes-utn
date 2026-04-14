import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getProfile, crearAdmin, listarAdmins, eliminarAdmin } from "../controllers/user.controller.js";

const router = express.Router();

// Perfil propio (cualquier autenticado)
router.get("/profile", verifyToken, getProfile);

// Gestión de admins — solo DEVELOPER
router.get("/admins",       verifyToken, authorizeRoles("DEVELOPER"), listarAdmins);
router.post("/admins",      verifyToken, authorizeRoles("DEVELOPER"), crearAdmin);
router.delete("/admins/:id", verifyToken, authorizeRoles("DEVELOPER"), eliminarAdmin);

export default router;