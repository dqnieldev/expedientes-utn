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

// ACTUALIZAR PERFIL DEL ALUMNO (EL MISMO ALUMNO)
export const updatePerfilAlumno = async (userId, data) => {
  const {
    curp,
    lugar_nacimiento,
    fecha_nacimiento,
    sexo,
    estado_civil,
    calle,
    numero,
    colonia,
    codigo_postal,
    telefono,
    ciudad,
    estado_direccion
  } = data;

  const updateData = {
    ...(curp !== undefined && { curp }),
    ...(lugar_nacimiento !== undefined && { lugar_nacimiento }),
    ...(fecha_nacimiento !== undefined && { fecha_nacimiento }),
    ...(sexo !== undefined && { sexo }),
    ...(estado_civil !== undefined && { estado_civil }),
    ...(calle !== undefined && { calle }),
    ...(numero !== undefined && { numero }),
    ...(colonia !== undefined && { colonia }),
    ...(codigo_postal !== undefined && { codigo_postal }),
    ...(telefono !== undefined && { telefono }),
    ...(ciudad !== undefined && { ciudad }),
    ...(estado_direccion !== undefined && { estado_direccion })
  };

  return await prisma.alumno.update({
    where: { usuarioId: userId },
    data: updateData
  });
};

// ACTUALIZAR FOTO DE PERFIL DEL ALUMNO
export const updateFotoAlumno = async (userId, filename) => {
  return await prisma.alumno.update({
    where: { usuarioId: userId },
    data: { foto: filename }
  });
};
  
// OBTENER UN ALUMNO POR ID (SOLO PARA ADMIN)
export const getAlumnoById = async (id) => {
  return await prisma.alumno.findUnique({
    where: { id }
  });
};