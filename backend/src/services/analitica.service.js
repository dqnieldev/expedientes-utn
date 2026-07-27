import prisma from "../config/prisma.js";

export const getAnaliticaDataset = async () => {
  const [alumnos, documentos, auditLogs] = await Promise.all([
    prisma.alumno.findMany({
      include: {
        documentos: true,
        usuario: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.documento.findMany({
      include: {
        alumno: {
          select: {
            carrera: true,
            cuatrimestre_actual: true,
            estado: true,
          },
        },
      },
    }),
    prisma.auditLog.groupBy({
      by: ["usuarioId", "accion"],
      _count: {
        _all: true,
      },
    }),
  ]);

  // Mapa de intentos fallidos por usuario
  const loginFallidosMap = {};
  auditLogs.forEach((log) => {
    if (log.accion === "LOGIN_FALLIDO" && log.usuarioId) {
      loginFallidosMap[log.usuarioId] = log._count._all;
    }
  });

  // Transformar lista de alumnos para clustering / supervisado
  const alumnosDataset = alumnos.map((alumno) => {
    const docs = alumno.documentos || [];
    const totalDocs = docs.length;
    const aprobados = docs.filter((d) => d.estado === "APROBADO").length;
    const rechazados = docs.filter((d) => d.estado === "RECHAZADO").length;
    const enRevision = docs.filter((d) => d.estado === "EN_REVISION").length;
    const pendientes = docs.filter((d) => d.estado === "PENDIENTE").length;
    const intentosFallidos = loginFallidosMap[alumno.usuarioId] || 0;

    return {
      alumnoId: alumno.id,
      matricula: alumno.matricula,
      carrera: alumno.carrera,
      cuatrimestre: alumno.cuatrimestre_actual,
      estadoAlumno: alumno.estado,
      totalDocumentos: totalDocs,
      documentosAprobados: aprobados,
      documentosRechazados: rechazados,
      documentosEnRevision: enRevision,
      documentosPendientes: pendientes,
      porcentajeCompletado: totalDocs > 0 ? Math.round((aprobados / 4) * 100) : 0,
      intentosLoginFallidos: intentosFallidos,
      fechaRegistro: alumno.createdAt,
    };
  });

  // Transformar lista de documentos para clasificación
  const documentosDataset = documentos.map((doc) => ({
    documentoId: doc.id,
    alumnoId: doc.alumnoId,
    tipo: doc.tipo,
    estado: doc.estado,
    razonRechazo: doc.razonRechazo || null,
    carrera: doc.alumno?.carrera || "Sin Carrera",
    cuatrimestre: doc.alumno?.cuatrimestre_actual || 1,
    estadoAlumno: doc.alumno?.estado || "ACTIVO",
    fechaCreacion: doc.createdAt,
  }));

  const totalDocumentos = documentos.length;
  const aprobadosTotal = documentos.filter((d) => d.estado === "APROBADO").length;
  const rechazadosTotal = documentos.filter((d) => d.estado === "RECHAZADO").length;

  return {
    metadatos: {
      totalAlumnos: alumnos.length,
      totalDocumentos,
      tasaAprobacionGlobal: totalDocumentos > 0 ? Number(((aprobadosTotal / totalDocumentos) * 100).toFixed(2)) : 0,
      tasaRechazoGlobal: totalDocumentos > 0 ? Number(((rechazadosTotal / totalDocumentos) * 100).toFixed(2)) : 0,
      generadoEn: new Date().toISOString(),
    },
    alumnos: alumnosDataset,
    documentos: documentosDataset,
  };
};
