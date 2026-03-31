import express from "express";
import { create } from "../controllers/alumno.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";//
import { getAll } from "../controllers/alumno.controller.js"; // Importar controlador para obtener todos los alumnos
import { getProfile } from "../controllers/alumno.controller.js"; // Importar controlador para obtener el perfil del alumno autenticado
import { update } from "../controllers/alumno.controller.js"; // Importar controlador para actualizar alumno (solo para ADMIN)

const router = express.Router();

// SOLO ADMIN
router.post("/", verifyToken, authorizeRoles("ADMIN"), create);

// SOLO ADMIN → ver todos los alumnos
router.get("/", verifyToken, authorizeRoles("ADMIN"), getAll);

// ALUMNO → ver su propio perfil
router.get("/me", verifyToken, getProfile);

router.put("/:id", verifyToken, authorizeRoles("ADMIN"), update);

export default router;