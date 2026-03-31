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