import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { login, register, changePasswordController, solicitarResetController,
    resetPasswordController, validateLogin, validateChangePassword,
    validateForgotPassword, validateResetPassword,
 } from "../controllers/auth.controller.js";

const router = express.Router();

// Rutas de autenticación y gestión de contraseñas con validación de datos 
router.post("/register", validateLogin, register);
router.post("/login",           validateLogin,           login);
router.post("/change-password", verifyToken, validateChangePassword, changePasswordController);
router.post("/forgot-password", validateForgotPassword,  solicitarResetController);
router.post("/reset-password",  validateResetPassword,   resetPasswordController);

export default router;
