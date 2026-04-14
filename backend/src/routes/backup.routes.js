import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { crear, listar, restaurar, eliminar, descargar, getScheduler, setScheduler } from "../controllers/backup.controller.js";

const router = express.Router();

// Rutas para gestión de respaldos (solo para DEVELOPER)
router.get("/",                     verifyToken, authorizeRoles("DEVELOPER"), listar);
router.post("/crear",               verifyToken, authorizeRoles("DEVELOPER"), crear);
router.post("/restaurar/:filename", verifyToken, authorizeRoles("DEVELOPER"), restaurar);
router.delete("/:filename",         verifyToken, authorizeRoles("DEVELOPER"), eliminar);
router.get("/descargar/:filename",  verifyToken, authorizeRoles("DEVELOPER"), descargar);
router.get("/scheduler",            verifyToken, authorizeRoles("DEVELOPER"), getScheduler);
router.post("/scheduler",           verifyToken, authorizeRoles("DEVELOPER"), setScheduler);

export default router;