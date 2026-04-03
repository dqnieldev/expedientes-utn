import prisma from "../config/prisma.js";

// Servicio para manejar operaciones relacionadas con los documentos de los alumnos
export const createDocumento = async (data) => {
  const { tipo, alumnoId, url } = data; // ← lee url directo de data

  const alumnoIdInt = parseInt(alumnoId);
  if (!alumnoIdInt) throw new Error("alumnoId inválido");

  return await prisma.documento.create({
    data: {
      tipo,
      url,           // ← usa la url que ya viene procesada
      alumnoId: alumnoIdInt
    }
  });
};

// Obtener todos los documentos de un alumno específico
export const getDocumentosByAlumno = async (alumnoId) => {
  return await prisma.documento.findMany({
    where: { alumnoId }
  });
};

// Actualizar el estado de un documento (por ejemplo, aprobado, rechazado, pendiente)
export const updateDocumentoEstado = async (id, estado) => {
  return await prisma.documento.update({
    where: { id },
    data: { estado }
  });
};

