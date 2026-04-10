import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";//
import { uploadImg } from "../config/multer.js"; // Importar configuración de multer para imágenes de perfil

// Importar controladores y validadores del alumno
import {
  create, getAll, getProfile, getById,
  update, updatePerfil, updateFoto,
  cambiarEstado, eliminar,
  validateCrearAlumno, validateUpdateAlumno, validateUpdatePerfil,
} from "../controllers/alumno.controller.js";

const router = express.Router();

// SOLO ADMIN
router.post("/", verifyToken, authorizeRoles("ADMIN"),validateCrearAlumno, create);
// SOLO ADMIN → ver todos los alumnos
router.get("/", verifyToken, authorizeRoles("ADMIN"), getAll);
// ALUMNO → ver su propio perfil
router.get("/me", verifyToken, getProfile);
router.put("/perfil", verifyToken, validateUpdatePerfil, updatePerfil); // Ruta para que el alumno actualice su propio perfil
router.put("/foto", verifyToken, uploadImg.single("foto"), updateFoto); // Ruta para actualizar foto de perfil del alumno

router.get("/:id", verifyToken, authorizeRoles("ADMIN"), getById); // Ruta para que el ADMIN vea el perfil de un alumno específico
router.patch("/:id/estado", verifyToken, authorizeRoles("ADMIN"), cambiarEstado); // Ruta para que el ADMIN cambie el estado de un alumno específico
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), eliminar); // Ruta para que el ADMIN elimine un alumno específico


router.put("/:id", verifyToken, authorizeRoles("ADMIN"), validateUpdateAlumno, update); // Ruta para que el ADMIN actualice el perfil de un alumno específico

 

export default router;