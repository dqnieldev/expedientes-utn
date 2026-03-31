import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Ruta protegida normal
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Ruta protegida ",
    user: req.user
  });
});

// Ruta SOLO ADMIN
router.get(
  "/admin",
  verifyToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Bienvenido ADMIN "
    });
  }
);

export default router;