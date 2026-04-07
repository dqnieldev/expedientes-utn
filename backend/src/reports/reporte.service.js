import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const LOGO_PATH  = path.join(__dirname, "../../public/imagenes/membrete-utn.png");

const TIPO_LABEL = {
  ACTA_NACIMIENTO: "Acta de Nacimiento",
  CURP:            "CURP",
  CERTIFICADO:     "Certificado de Bachillerato",
  CONSTANCIA:      "Constancia de Estudios",
};

const ESTADO_LABEL = {
  APROBADO:    "Aprobado",
  RECHAZADO:   "Rechazado",
  EN_REVISION: "En Revisión",
  PENDIENTE:   "Pendiente",
};

const ESTADO_COLOR = {
  APROBADO:    "#1D9E75",
  RECHAZADO:   "#E24B4A",
  EN_REVISION: "#EF9F27",
  PENDIENTE:   "#9CA3AF",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function drawHeader(doc) {
  try {
    doc.image(LOGO_PATH, 40, 25, { width: 515, height: 70 });
  } catch {
    doc.fontSize(10).fillColor("#666").text("Universidad Tecnológica de Nayarit", 40, 40);
  }
  doc.moveTo(40, 100).lineTo(555, 100).strokeColor("#024E3F").lineWidth(2).stroke();
  doc.y = 110;
}

function drawFooter(doc) {
  const pageHeight = doc.page.height;
  doc.fontSize(8)
    .fillColor("#9CA3AF")
    .text(
      `Documento generado el ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })} · Sistema Paperless UTN`,
      40, pageHeight - 40, { align: "center", width: 515 }
    );
}

function sectionTitle(doc, text) {
  doc.moveDown(0.8)
    .fontSize(11)
    .fillColor("#024E3F")
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc.moveTo(40, doc.y + 3).lineTo(555, doc.y + 3).strokeColor("#E5E7EB").lineWidth(1).stroke();
  doc.moveDown(0.6);
}

function infoRow(doc, label, value) {
  const y = doc.y;
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6B7280")
    .text(label, 40, y, { width: 160, continued: false });
  doc.font("Helvetica").fontSize(9).fillColor("#111827")
    .text(value || "—", 210, y, { width: 340 });
  doc.y = y + 18;
}

function estadoBadge(doc, label, estado) {
  const color  = ESTADO_COLOR[estado] || "#9CA3AF";
  const eLabel = ESTADO_LABEL[estado] || estado;
  const y      = doc.y;

  doc.font("Helvetica").fontSize(9).fillColor("#111827")
    .text(label, 40, y + 3, { width: 270 });

  doc.roundedRect(320, y, 100, 18, 4).fillColor(color).fill();
  doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica-Bold")
    .text(eLabel, 320, y + 5, { width: 100, align: "center" });

  doc.y = y + 26;
}

// ── 1. REPORTE DE EXPEDIENTE DE UN ALUMNO ─────────────────────────────────

export const generarReporteAlumno = (alumno, docs) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];

    doc.on("data", chunk => buffers.push(chunk));
    doc.on("end",  () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    drawHeader(doc);

    // Título
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#111827").font("Helvetica-Bold")
      .text("Reporte de Expediente Digital", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#6B7280").font("Helvetica")
      .text(`Matrícula: ${alumno.matricula}`, { align: "center" });
    doc.moveDown(0.8);

    // Datos académicos
    sectionTitle(doc, "Datos Académicos");
    infoRow(doc, "Nombre completo",  alumno.nombre);
    infoRow(doc, "Matrícula",        alumno.matricula);
    infoRow(doc, "Carrera",          alumno.carrera);
    infoRow(doc, "Cuatrimestre",     String(alumno.cuatrimestre_actual));
    infoRow(doc, "Estado",           alumno.estado);

    // Datos personales
    if (alumno.curp || alumno.telefono || alumno.ciudad) {
      sectionTitle(doc, "Datos Personales");
      if (alumno.curp)             infoRow(doc, "CURP",             alumno.curp);
      if (alumno.fecha_nacimiento) infoRow(doc, "Fecha Nacimiento", new Date(alumno.fecha_nacimiento).toLocaleDateString("es-MX"));
      if (alumno.lugar_nacimiento) infoRow(doc, "Lugar Nacimiento", alumno.lugar_nacimiento);
      if (alumno.sexo)             infoRow(doc, "Sexo",             alumno.sexo);
      if (alumno.telefono)         infoRow(doc, "Teléfono",         alumno.telefono);
      if (alumno.ciudad)           infoRow(doc, "Ciudad",           alumno.ciudad);
      if (alumno.estado_direccion) infoRow(doc, "Estado",           alumno.estado_direccion);
    }

    // Documentos
    sectionTitle(doc, "Estado del Expediente");
    const TIPOS = ["ACTA_NACIMIENTO", "CURP", "CERTIFICADO", "CONSTANCIA"];
    TIPOS.forEach(tipo => {
      const d      = docs.find(x => x.tipo === tipo);
      const estado = d?.estado || "PENDIENTE";
      estadoBadge(doc, TIPO_LABEL[tipo], estado);
    });

    // Resumen
    const aprobados  = docs.filter(d => d.estado === "APROBADO").length;
    const pendientes = Math.max(0, 4 - docs.length);
    sectionTitle(doc, "Resumen");
    infoRow(doc, "Documentos requeridos", "4");
    infoRow(doc, "Documentos subidos",    String(docs.length));
    infoRow(doc, "Aprobados",             String(aprobados));
    infoRow(doc, "Pendientes",            String(pendientes));

    drawFooter(doc);
    doc.end();
  });
};

// ── 2. REPORTE GENERAL DE TODOS LOS ALUMNOS ───────────────────────────────

export const generarReporteGeneral = (alumnos) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];

    doc.on("data", chunk => buffers.push(chunk));
    doc.on("end",  () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    drawHeader(doc);

    doc.moveDown(0.5);
    doc.fontSize(16).fillColor("#111827").font("Helvetica-Bold")
      .text("Reporte General de Expedientes", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#6B7280").font("Helvetica")
      .text(`Total de alumnos: ${alumnos.length}`, { align: "center" });
    doc.moveDown(0.8);

    // Tabla
    const colX    = [40, 155, 310, 430, 490];
    const headers = ["Matrícula", "Nombre", "Carrera", "Docs", "Estado"];

    const tableY = doc.y;
    doc.rect(40, tableY, 515, 20).fillColor("#024E3F").fill();
    headers.forEach((h, i) => {
      doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica-Bold")
        .text(h, colX[i] + 3, tableY + 6, { width: (colX[i+1] || 555) - colX[i] - 6 });
    });
    doc.y = tableY + 22;

    alumnos.forEach((alumno, idx) => {
      const docsCount = alumno.documentos?.length || 0;
      const y  = doc.y;
      const bg = idx % 2 === 0 ? "#F9FAFB" : "#FFFFFF";

      doc.rect(40, y, 515, 18).fillColor(bg).fill();

      doc.fontSize(8).fillColor("#111827").font("Helvetica");
      doc.text(alumno.matricula,                                                          colX[0] + 3, y + 5, { width: colX[1] - colX[0] - 6 });
      doc.text(alumno.nombre,                                                             colX[1] + 3, y + 5, { width: colX[2] - colX[1] - 6 });
      doc.text(alumno.carrera.length > 22 ? alumno.carrera.substring(0, 22) + "..." : alumno.carrera,
                                                                                          colX[2] + 3, y + 5, { width: colX[3] - colX[2] - 6 });
      doc.text(`${docsCount}/4`,                                                          colX[3] + 3, y + 5, { width: colX[4] - colX[3] - 6 });

      const estadoColor = alumno.estado === "ACTIVO" ? "#1D9E75" : "#E24B4A";
      doc.fontSize(8).fillColor(estadoColor).font("Helvetica-Bold")
        .text(alumno.estado,                                                              colX[4] + 3, y + 5, { width: 65 - 6 });

      doc.y = y + 20;

      if (doc.y > doc.page.height - 80) {
        doc.addPage();
        drawHeader(doc);
        doc.moveDown(0.5);
      }
    });

    drawFooter(doc);
    doc.end();
  });
};