import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

// CREAR ALUMNO + USUARIO
export const createAlumno = async (data) => {
  const {
    nombre,
    matricula,
    carrera,
    cuatrimestre_actual,
    email
  } = data;

  // validar matrícula
  const existingAlumno = await prisma.alumno.findUnique({
    where: { matricula }
  });

  if (existingAlumno) {
    throw new Error("La matrícula ya existe");
  }

  // validar email
  const existingUser = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  // contraseña = matrícula
  const passwordHash = await bcrypt.hash(matricula, 10);

  // crear usuario
  const user = await prisma.usuario.create({
    data: {
      email,
      password: passwordHash,
      role: "ALUMNO",
      mustChangePassword: true
    }
  });

  // crear alumno
  const alumno = await prisma.alumno.create({
    data: {
      nombre,
      matricula,
      carrera,
      cuatrimestre_actual,
      usuarioId: user.id
    }
  });

  return alumno;
};

// OBTENER TODOS LOS ALUMNOS
export const getAlumnos = async () => {
  return await prisma.alumno.findMany({
    include: {
      usuario: {
        select: {
          id: true,
          email: true,
          role: true
        }
      }
    }
  });
};

// OBTENER EL PERFIL DEL ALUMNO AUTENTICADO
export const getMyAlumno = async (userId) => {
  return await prisma.alumno.findUnique({
    where: {
      usuarioId: userId
    }
  });
};

// ACTUALIZAR ALUMNO (SOLO ADMIN)
export const updateAlumno = async (id, data) => {
  return await prisma.alumno.update({
    where: { id },
    data
  });
};