import { registerUser, loginUser }       from "../services/auth.service.js";
import { changePassword }                from "../services/auth.service.js";
import { solicitarReset, resetPassword } from "../services/auth.service.js";
import { body, validationResult }        from "express-validator";

// ── Helper para responder errores de validación ───────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  return null;
};

// ── Validadores exportados (se usan en las rutas) ─────────────────────────────
export const validateLogin = [
  body("email")
    .notEmpty().withMessage("El correo es requerido")
    .isEmail().withMessage("Formato de correo inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("La contraseña es requerida")
    .isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
];

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty().withMessage("La contraseña actual es requerida"),
  body("newPassword")
    .notEmpty().withMessage("La nueva contraseña es requerida")
    .isLength({ min: 6 }).withMessage("Mínimo 6 caracteres")
    .not().equals("").withMessage("La contraseña no puede estar vacía"),
];

export const validateForgotPassword = [
  body("matricula")
    .notEmpty().withMessage("La matrícula es requerida")
    .trim(),
];

export const validateResetPassword = [
  body("token")
    .notEmpty().withMessage("El token es requerido"),
  body("newPassword")
    .notEmpty().withMessage("La nueva contraseña es requerida")
    .isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
];

// ── Controllers ───────────────────────────────────────────────────────────────

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changePasswordController = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await changePassword(userId, currentPassword, newPassword);
    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const solicitarResetController = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const { matricula } = req.body;
    const result = await solicitarReset(matricula);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};