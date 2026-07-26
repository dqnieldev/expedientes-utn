import { Router } from "express";
import { obtenerDataset } from "../controllers/analitica.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// GET /api/analitica/dataset (Solo ADMIN y DEVELOPER)
router.get(
  "/dataset",
  verifyToken,
  authorizeRoles("ADMIN", "DEVELOPER"),
  obtenerDataset
);

export default router;
