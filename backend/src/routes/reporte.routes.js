import express from "express";
import { reporteAlumno, reporteGeneral, reporteMio } from "../controllers/reporte.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Alumno descarga su propio reporte
router.get("/mio", verifyToken, reporteMio);

// Admin descarga reporte de un alumno específico
router.get("/alumno/:alumnoId", verifyToken, authorizeRoles("ADMIN"), reporteAlumno);

// Admin descarga reporte general
router.get("/general", verifyToken, authorizeRoles("ADMIN"), reporteGeneral);

export default router;