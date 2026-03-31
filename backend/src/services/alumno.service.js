import prisma from "../config/prisma.js";

export const createAlumno = async (data) => {
  const {
    nombre,
    matricula,
    carrera,
    cuatrimestre_actual,
    usuarioId
  } = data;

  

  // Validar si ya existe matricula
  const existingAlumno = await prisma.alumno.findUnique({
    where: { matricula }
  });

  if (existingAlumno) {
    throw new Error("La matrícula ya existe");
  }

  const alumno = await prisma.alumno.create({
    data: {
      nombre,
      matricula,
      carrera,
      cuatrimestre_actual,
      usuarioId
    }
  });
  

  return alumno;
};

// Agregar función para obtener todos los alumnos (solo para ADMIN)
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
// Agregar función para obtener el alumno asociado al usuario autenticado
export const getMyAlumno = async (userId) => {
  return await prisma.alumno.findUnique({
    where: {
      usuarioId: userId
    }
  });
};

// Agregar función para actualizar un alumno (solo para ADMIN)
export const updateAlumno = async (id, data) => {
  return await prisma.alumno.update({
    where: { id },
    data
  });
};