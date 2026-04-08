 import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/mailer.js";


// Función para registrar un nuevo usuario
export const registerUser = async (email, password) => {
  email = email.toLowerCase().trim(); // Normalizar el email para evitar problemas de mayúsculas/minúsculas y espacios
  const existingUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  return user;
};

// Función para autenticar a un usuario y generar un token JWT
export const loginUser = async (email, password) => {
  email = email.toLowerCase().trim(); // Normalizar el email para evitar problemas de mayúsculas/minúsculas y espacios
  const user = await prisma.usuario.findFirst({ // Usamos findFirst con case-insensitive para evitar problemas de mayúsculas/minúsculas
  where: {
    email: {
      equals: email,
      mode: "insensitive"
    }
  }
});

  if (!user) throw new Error("Usuario no encontrado");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Contraseña incorrecta");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
    mustChangePassword: user.mustChangePassword
  };
};

// Función para cambiar la contraseña del usuario
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.usuario.findUnique({ where: { id: userId } });

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("La contraseña actual es incorrecta");

  const hashed = await bcrypt.hash(newPassword, 10);

  return await prisma.usuario.update({
    where: { id: userId },
    data: {
      password: hashed,
      mustChangePassword: false
    }
  });
};

// ── Solicitar reset de contraseña ─────────────────────────────────────────────
export const solicitarReset = async (matricula) => {
  // Buscar alumno por matrícula e incluir su Usuario
  const alumno = await prisma.alumno.findUnique({
    where: { matricula },
    include: { usuario: true },
  });

  if (!alumno) throw new Error("No se encontró un alumno con esa matrícula");

  const token   = crypto.randomBytes(32).toString("hex");
  const expiry  = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await prisma.usuario.update({
    where: { id: alumno.usuario.id },
    data: {
      resetToken:       token,
      resetTokenExpiry: expiry,
    },
  });

  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
    to:      alumno.usuario.email,
    subject: "Recuperación de contraseña — Paperless UTN",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1a2744;margin-bottom:8px">Recuperar contraseña</h2>
        <p style="color:#6b7280;font-size:14px">Hola <strong>${alumno.nombre}</strong>, recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${link}"
           style="display:inline-block;margin-top:24px;padding:12px 24px;background:#1a2744;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600">
          Restablecer contraseña
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">Este enlace expira en <strong>1 hora</strong>. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });

  return { message: "Correo enviado correctamente" };
};

// ── Resetear contraseña con token ─────────────────────────────────────────────
export const resetPassword = async (token, newPassword) => {
  const user = await prisma.usuario.findFirst({
    where: {
      resetToken:       token,
      resetTokenExpiry: { gt: new Date() }, // token no expirado
    },
  });

  if (!user) throw new Error("El enlace es inválido o ha expirado");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.usuario.update({
    where: { id: user.id },
    data: {
      password:          hashed,
      resetToken:        null,
      resetTokenExpiry:  null,
      mustChangePassword: false,
    },
  });

  return { message: "Contraseña restablecida correctamente" };
};


