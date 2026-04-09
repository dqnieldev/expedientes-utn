import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import transporter from "../config/mailer.js";

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

// ── Cambiar estado del alumno + notificar por email ───────────────────────────
export const cambiarEstadoAlumno = async (id, nuevoEstado) => {
  const alumno = await prisma.alumno.findUnique({
    where:   { id },
    include: { usuario: true },
  });

  if (!alumno) throw new Error("Alumno no encontrado");

  const updated = await prisma.alumno.update({
    where: { id },
    data:  { estado: nuevoEstado },
  });

  // Configuración visual por estado
  const estadoInfo = {
    ACTIVO:         { label: "Activo",         color: "#1D9E75", emoji: "✅" },
    BAJA:           { label: "Baja Definitiva", color: "#E24B4A", emoji: "❌" },
    BAJA_TEMPORAL:  { label: "Baja Temporal",   color: "#EF9F27", emoji: "⚠️" },
  };

  const info = estadoInfo[nuevoEstado] ?? { label: nuevoEstado, color: "#6B7280", emoji: "ℹ️" };

  // Enviar correo al alumno
  await transporter.sendMail({
    from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
    to:      alumno.usuario.email,
    subject: `${info.emoji} Actualización de tu estado — Paperless UTN`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1a2744;margin-bottom:8px">Actualización de estado</h2>
        <p style="color:#6b7280;font-size:14px">
          Hola <strong>${alumno.nombre}</strong>, te informamos que tu estado en el sistema ha sido actualizado.
        </p>
        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid ${info.color}">
          <p style="margin:0;font-size:13px;color:#6b7280">Nuevo estado</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:${info.color}">${info.label}</p>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">
          Si tienes dudas, acude a Servicios Escolares o contacta a un administrador.
        </p>
        <p style="color:#9ca3af;font-size:12px;margin-top:4px">
          Sistema Paperless — Universidad Tecnológica de Nayarit
        </p>
      </div>
    `,
  });

  return updated;
};