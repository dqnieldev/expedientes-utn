import prisma from "../config/prisma.js";
import transporter from "../config/mailer.js";

// CREAR O ACTUALIZAR DOCUMENTO
export const createDocumento = async (data) => {
  const { tipo, alumnoId, url } = data;
  const alumnoIdInt = parseInt(alumnoId);
  if (!alumnoIdInt) throw new Error("alumnoId inválido");

  const tipoLabel = {
    ACTA_NACIMIENTO: "Acta de Nacimiento",
    CURP:            "CURP",
    CERTIFICADO:     "Certificado de Bachillerato",
    CONSTANCIA:      "Constancia de Estudios",
  }[tipo] ?? tipo;

  // Verificar si ya existía (reemplazo) o es nuevo
  const existente = await prisma.documento.findUnique({
    where: { alumnoId_tipo: { alumnoId: alumnoIdInt, tipo } },
  });
  const esReemplazo = !!existente;

  // Upsert del documento
  const doc = await prisma.documento.upsert({
    where: {
      alumnoId_tipo: { alumnoId: alumnoIdInt, tipo },
    },
    update: {
      url,
      estado: "EN_REVISION",
    },
    create: {
      tipo,
      url,
      alumnoId: alumnoIdInt,
    },
    include: {
      alumno: {
        include: { usuario: true },
      },
    },
  });

  // Notificar al admin
  try {
    const admin = await prisma.usuario.findFirst({
      where: { role: "ADMIN" },
    });

    if (admin?.email) {
      await transporter.sendMail({
        from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
        to:      admin.email,
        subject: `📄 ${esReemplazo ? "Documento reemplazado" : "Nuevo documento"} — ${doc.alumno.nombre}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
            <h2 style="color:#1a2744;margin-bottom:8px">
              ${esReemplazo ? "Documento reemplazado" : "Nuevo documento subido"}
            </h2>
            <p style="color:#6b7280;font-size:14px">
              El alumno <strong>${doc.alumno.nombre}</strong> ha 
              ${esReemplazo ? "reemplazado" : "subido"} un documento que requiere revisión.
            </p>
            <table style="margin-top:16px;width:100%;font-size:13px;border-collapse:collapse">
              <tr>
                <td style="padding:8px 0;color:#9ca3af;width:120px">Alumno</td>
                <td style="padding:8px 0;color:#111827;font-weight:600">${doc.alumno.nombre}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#9ca3af">Matrícula</td>
                <td style="padding:8px 0;color:#111827;font-weight:600">${doc.alumno.matricula}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#9ca3af">Documento</td>
                <td style="padding:8px 0;color:#111827;font-weight:600">${tipoLabel}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#9ca3af">Acción</td>
                <td style="padding:8px 0;font-weight:600;color:#EF9F27">
                  ${esReemplazo ? "Reemplazo — en revisión" : "Nuevo — en revisión"}
                </td>
              </tr>
            </table>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px">
              Ingresa al panel de administración para revisar y validar el documento.
            </p>
            <p style="color:#9ca3af;font-size:12px;margin-top:4px">
              Sistema Paperless — Universidad Tecnológica de Nayarit
            </p>
          </div>
        `,
      });
    }
  } catch (emailErr) {
    // No fallar si el email falla — el documento ya se guardó
    console.error("Error enviando notificación al admin:", emailErr.message);
  }

  return doc;
};

// Obtener todos los documentos de un alumno específico
export const getDocumentosByAlumno = async (alumnoId) => {
  return await prisma.documento.findMany({
    where: { alumnoId }
  });
};

// Actualizar el estado de un documento (por ejemplo, aprobado, rechazado, pendiente)
export const updateDocumentoEstado = async (id, estado, razonRechazo = null) => {

  // Si se rechaza → eliminar el documento de la BD
  if (estado === "RECHAZADO") {
    const doc = await prisma.documento.findUnique({
      where: { id },
      include: { alumno: { include: { usuario: true } } },
    });

    if (!doc) throw new Error("Documento no encontrado");

    // Eliminar de la BD
    await prisma.documento.delete({ where: { id } });

    // Notificar por email
    const tipoLabel = {
      ACTA_NACIMIENTO: "Acta de Nacimiento",
      CURP:            "CURP",
      CERTIFICADO:     "Certificado de Bachillerato",
      CONSTANCIA:      "Constancia de Estudios",
    }[doc.tipo] ?? doc.tipo;

    await transporter.sendMail({
      from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
      to:      doc.alumno.usuario.email,
      subject: "❌ Documento rechazado — Paperless UTN",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1a2744;margin-bottom:8px">Documento rechazado</h2>
          <p style="color:#6b7280;font-size:14px">
            Hola <strong>${doc.alumno.nombre}</strong>, tu documento fue rechazado y eliminado del sistema.
          </p>
          <div style="margin-top:20px;padding:16px;background:#fef2f2;border-radius:8px;border-left:4px solid #E24B4A">
            <p style="margin:0;font-size:13px;color:#6b7280">Documento</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#E24B4A">${tipoLabel}</p>
            ${razonRechazo ? `
            <p style="margin:12px 0 0;font-size:13px;color:#6b7280">Motivo</p>
            <p style="margin:4px 0 0;font-size:14px;color:#374151">${razonRechazo}</p>
            ` : ""}
          </div>
          <p style="color:#6b7280;font-size:13px;margin-top:20px">
            Por favor, sube nuevamente el documento corregido desde tu panel.
          </p>
          <p style="color:#9ca3af;font-size:12px;margin-top:16px">Sistema Paperless — Universidad Tecnológica de Nayarit</p>
        </div>
      `,
    });

    return doc;
  }

  // Para APROBADO / EN_REVISION → actualizar normalmente
  const doc = await prisma.documento.update({
    where: { id },
    data:  { estado, razonRechazo: null },
    include: { alumno: { include: { usuario: true } } },
  });

  if (estado === "APROBADO") {
    const tipoLabel = {
      ACTA_NACIMIENTO: "Acta de Nacimiento",
      CURP:            "CURP",
      CERTIFICADO:     "Certificado de Bachillerato",
      CONSTANCIA:      "Constancia de Estudios",
    }[doc.tipo] ?? doc.tipo;

    await transporter.sendMail({
      from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
      to:      doc.alumno.usuario.email,
      subject: "✅ Documento aprobado — Paperless UTN",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1a2744;margin-bottom:8px">Documento aprobado</h2>
          <p style="color:#6b7280;font-size:14px">
            Hola <strong>${doc.alumno.nombre}</strong>, tu documento ha sido aprobado.
          </p>
          <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #1D9E75">
            <p style="margin:0;font-size:13px;color:#6b7280">Documento</p>
            <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#1D9E75">${tipoLabel}</p>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">Sistema Paperless — Universidad Tecnológica de Nayarit</p>
        </div>
      `,
    });
  }

  return doc;
};

// Obtener todos los documentos con información básica del alumno (para ADMIN)
export const getAllDocumentos = async () => {
  return await prisma.documento.findMany({
    include: {
      alumno: {
        select: {
          id: true,
          nombre: true,
          matricula: true,
          carrera: true,
          foto: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
