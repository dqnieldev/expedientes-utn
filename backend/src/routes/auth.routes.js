import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { changePasswordController } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { solicitarResetController, resetPasswordController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register); // Ruta para registrar un nuevo usuario
router.post("/login", login); // Ruta para iniciar sesión y obtener un token JWT
router.put("/change-password", verifyToken, changePasswordController); // Ruta para cambiar la contraseña del usuario (protegida por JWT)

router.post("/forgot-password", solicitarResetController); // Ruta para solicitar restablecimiento de contraseña
router.post("/reset-password", resetPasswordController); // Ruta para restablecer la contraseña usando el token enviado por correo

export default router;
