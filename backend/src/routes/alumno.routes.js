import express from "express";
import { create } from "../controllers/alumno.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";//
import { getAll } from "../controllers/alumno.controller.js"; // Importar controlador para obtener todos los alumnos
import { getProfile } from "../controllers/alumno.controller.js"; // Importar controlador para obtener el perfil del alumno autenticado
import { update } from "../controllers/alumno.controller.js"; // Importar controlador para actualizar alumno (solo para ADMIN)
import { updatePerfil } from "../controllers/alumno.controller.js"; // Importar controlador para que el alumno actualice su propio perfil
import { updateFoto } from "../controllers/alumno.controller.js";
import { uploadImg } from "../config/multer.js"; // Importar configuración de multer para imágenes de perfil
import { getById } from "../controllers/alumno.controller.js"; // Importar controlador para obtener un alumno por ID (solo para ADMIN)
import { cambiarEstado } from "../controllers/alumno.controller.js";

const router = express.Router();

// SOLO ADMIN
router.post("/", verifyToken, authorizeRoles("ADMIN"), create);
// SOLO ADMIN → ver todos los alumnos
router.get("/", verifyToken, authorizeRoles("ADMIN"), getAll);
// ALUMNO → ver su propio perfil
router.get("/me", verifyToken, getProfile);
router.put("/perfil", verifyToken, updatePerfil); // Ruta para que el alumno actualice su propio perfil
router.put("/foto", verifyToken, uploadImg.single("foto"), updateFoto); // Ruta para actualizar foto de perfil del alumno

router.get("/:id", verifyToken, authorizeRoles("ADMIN"), getById); // Ruta para que el ADMIN vea el perfil de un alumno específico
router.patch("/:id/estado", verifyToken, authorizeRoles("ADMIN"), cambiarEstado); // Ruta para que el ADMIN cambie el estado de un alumno específico


router.put("/:id", verifyToken, authorizeRoles("ADMIN"), update); // Ruta para que el ADMIN actualice el perfil de un alumno específico

 

export default router;