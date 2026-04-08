import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { crear, listar, restaurar, eliminar, descargar, getScheduler, setScheduler } from "../controllers/backup.controller.js";

const router = express.Router();

// Solo ADMIN puede gestionar respaldos
router.get("/",                    verifyToken, authorizeRoles("ADMIN"), listar);
router.post("/crear",              verifyToken, authorizeRoles("ADMIN"), crear);
router.post("/restaurar/:filename",verifyToken, authorizeRoles("ADMIN"), restaurar);
router.delete("/:filename",        verifyToken, authorizeRoles("ADMIN"), eliminar);
router.get("/descargar/:filename", verifyToken, authorizeRoles("ADMIN"), descargar);
router.get("/scheduler",            verifyToken, authorizeRoles("ADMIN"), getScheduler);
router.post("/scheduler",           verifyToken, authorizeRoles("ADMIN"), setScheduler);

export default router;