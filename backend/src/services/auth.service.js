 import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
export const changePassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);

  return await prisma.usuario.update({
    where: { id: userId },
    data: {
      password: hashed,
      mustChangePassword: false
    }
  });
};

