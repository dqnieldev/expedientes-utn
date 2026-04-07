import express from "express";
import { crear, listar, restaurar, eliminar, descargar } from "../controllers/backup.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Solo ADMIN puede gestionar respaldos
router.get("/",                    verifyToken, authorizeRoles("ADMIN"), listar);
router.post("/crear",              verifyToken, authorizeRoles("ADMIN"), crear);
router.post("/restaurar/:filename",verifyToken, authorizeRoles("ADMIN"), restaurar);
router.delete("/:filename",        verifyToken, authorizeRoles("ADMIN"), eliminar);
router.get("/descargar/:filename", verifyToken, authorizeRoles("ADMIN"), descargar);

export default router;