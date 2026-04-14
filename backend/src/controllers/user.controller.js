import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { registrarLog } from "../services/audit.service.js";

// ── GET /api/user/profile ─────────────────────────────────────────────────────
export const getProfile = (req, res) => {
  res.json({ user: req.user });
};

// ── GET /api/user/admins ──────────────────────────────────────────────────────
export const listarAdmins = async (req, res) => {
  try {
    const admins = await prisma.usuario.findMany({
      where: { role: "ADMIN" },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        mustChangePassword: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Validadores POST /api/user/admins ─────────────────────────────────────────
export const validarCrearAdmin = [
  body("email")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
];

// ── POST /api/user/admins ─────────────────────────────────────────────────────
export const crearAdmin = [
  ...validarCrearAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const existe = await prisma.usuario.findUnique({ where: { email } });
      if (existe)
        return res.status(409).json({ message: "Ya existe un usuario con ese email" });

      const hash = await bcrypt.hash(password, 12);

      const nuevo = await prisma.usuario.create({
        data: {
          email,
          password: hash,
          role: "ADMIN",
          mustChangePassword: true,   // deberá cambiar en primer login
        },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          mustChangePassword: true,
        },
      });

      await registrarLog({
        accion:    "CREAR_ADMIN",
        entidad:   "USUARIO",
        entidadId: nuevo.id,
        detalle:   `Developer creó admin: ${email}`,
        usuarioId: req.user?.id,
        ip:        req.ip,
      });

      res.status(201).json({ message: "Administrador creado correctamente", usuario: nuevo });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const eliminarAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    if (usuario.role !== "ADMIN")
      return res.status(400).json({ message: "Solo se pueden eliminar usuarios con rol ADMIN" });

    await prisma.usuario.delete({ where: { id } });

    await registrarLog({
      accion:    "ELIMINAR_ADMIN",
      entidad:   "USUARIO",
      entidadId: id,
      detalle:   `Developer eliminó admin: ${usuario.email}`,
      usuarioId: req.user?.id,
      ip:        req.ip,
    });

    res.json({ message: "Administrador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};