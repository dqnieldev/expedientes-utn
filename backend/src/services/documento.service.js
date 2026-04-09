import prisma from "../config/prisma.js";
import transporter from "../config/mailer.js";

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
export const updateDocumentoEstado = async (id, estado, razonRechazo = null) => {
  const doc = await prisma.documento.update({
    where: { id },
    data:  {
      estado,
      razonRechazo: estado === "RECHAZADO" ? razonRechazo : null,
    },
    include: {
      alumno: {
        include: { usuario: true },
      },
    },
  });

  // ── Notificación por email ────────────────────────────────────────────────
  const email  = doc.alumno.usuario.email;
  const nombre = doc.alumno.nombre;

  const tipoLabel = {
    ACTA_NACIMIENTO: "Acta de Nacimiento",
    CURP:            "CURP",
    CERTIFICADO:     "Certificado de Bachillerato",
    CONSTANCIA:      "Constancia de Estudios",
  }[doc.tipo] ?? doc.tipo;

  if (estado === "APROBADO") {
    await transporter.sendMail({
      from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: "✅ Documento aprobado — Paperless UTN",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1a2744;margin-bottom:8px">Documento aprobado</h2>
          <p style="color:#6b7280;font-size:14px">
            Hola <strong>${nombre}</strong>, tu documento ha sido revisado y aprobado.
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

  if (estado === "RECHAZADO") {
    await transporter.sendMail({
      from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
      to:      email,
      subject: "❌ Documento rechazado — Paperless UTN",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1a2744;margin-bottom:8px">Documento rechazado</h2>
          <p style="color:#6b7280;font-size:14px">
            Hola <strong>${nombre}</strong>, tu documento ha sido revisado y no fue aprobado.
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
