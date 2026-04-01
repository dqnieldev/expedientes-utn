import express from "express";
import {
  create,
  getByAlumno,
  updateEstado
} from "../controllers/documento.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Crear documento (ADMIN o ALUMNO)
router.post("/", verifyToken, upload.single("file"), create);

// Ver documentos de un alumno
router.get("/:alumnoId", verifyToken, getByAlumno);

// Validar documento (solo ADMIN)
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateEstado);

export default router;