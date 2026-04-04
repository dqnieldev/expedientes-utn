import prisma from "../config/prisma.js";

// CREAR O ACTUALIZAR DOCUMENTO
export const createDocumento = async (data) => {
  const { tipo, alumnoId, url } = data;
  const alumnoIdInt = parseInt(alumnoId);
  if (!alumnoIdInt) throw new Error("alumnoId inválido");

  // Si ya existe un documento del mismo tipo para ese alumno, actualiza la url
  // Si no existe, lo crea
  return await prisma.documento.upsert({
    where: {
      alumnoId_tipo: {
        alumnoId: alumnoIdInt,
        tipo
      }
    },
    update: {
      url,
      estado: "EN_REVISION" // al reemplazar vuelve a revisión
    },
    create: {
      tipo,
      url,
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

