import express from "express";
import {
  create,
  getByAlumno,
  updateEstado,
  getAll
} from "../controllers/documento.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Ver todos los documentos (solo ADMIN)
router.get("/", verifyToken, authorizeRoles("ADMIN"), getAll);

// Ver documentos de un alumno
router.get("/:alumnoId", verifyToken, getByAlumno);

// Crear documento (ADMIN o ALUMNO)
router.post("/", verifyToken, upload.single("file"), create);

// Validar documento (solo ADMIN)
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateEstado);

export default router;