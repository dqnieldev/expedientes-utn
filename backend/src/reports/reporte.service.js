import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../config/prisma.js";

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
  APROBADO:   "Aprobado",
  RECHAZADO:  "Rechazado",
  EN_REVISION:"En Revisión",
  PENDIENTE:  "Pendiente",
};

const ESTADO_COLOR = {
  APROBADO:    "#1D9E75",
  RECHAZADO:   "#E24B4A",
  EN_REVISION: "#EF9F27",
  PENDIENTE:   "#9CA3AF",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function drawHeader(doc) {
  // Membrete
  try {
    doc.image(LOGO_PATH, 40, 30, { width: 520 });
  } catch {
    doc.fontSize(10).fillColor("#666").text("Universidad Tecnológica de Nayarit", 40, 40);
  }
  doc.moveDown(5);

  // Línea divisora
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor("#024E3F").lineWidth(2).stroke();
  doc.moveDown(0.5);
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
  doc.moveDown(0.5)
    .fontSize(11)
    .fillColor("#024E3F")
    .font("Helvetica-Bold")
    .text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc.moveTo(40, doc.y + 2).lineTo(555, doc.y + 2).strokeColor("#E5E7EB").lineWidth(1).stroke();
  doc.moveDown(0.5);
}

function infoRow(doc, label, value) {
  doc.font("Helvetica-Bold").fontSize(9).fillColor("#6B7280").text(label, 40, doc.y, { continued: true, width: 160 });
  doc.font("Helvetica").fontSize(9).fillColor("#111827").text(value || "—", { width: 350 });
}

function estadoBadge(doc, estado) {
  const color = ESTADO_COLOR[estado] || "#9CA3AF";
  const label = ESTADO_LABEL[estado] || estado;
  const x = doc.x;
  const y = doc.y;
  const w = 80;
  const h = 14;

  doc.roundedRect(x, y, w, h, 4).fillColor(color).fill();
  doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica-Bold")
    .text(label, x, y + 3, { width: w, align: "center" });
  doc.moveDown(0.3);
}

// ── 1. REPORTE DE EXPEDIENTE DE UN ALUMNO ─────────────────────────────────

export const generarReporteAlumno = (alumno, docs) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];

    doc.on("data", chunk => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    drawHeader(doc);

    // Título
    doc.fontSize(16).fillColor("#111827").font("Helvetica-Bold")
      .text("Reporte de Expediente Digital", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#6B7280").font("Helvetica")
      .text(`Matrícula: ${alumno.matricula}`, { align: "center" });
    doc.moveDown(1);

    // Datos académicos
    sectionTitle(doc, "Datos Académicos");
    infoRow(doc, "Nombre completo",  alumno.nombre);
    infoRow(doc, "Matrícula",        alumno.matricula);
    infoRow(doc, "Carrera",          alumno.carrera);
    infoRow(doc, "Cuatrimestre",     String(alumno.cuatrimestre_actual));
    infoRow(doc, "Estado",           alumno.estado);
    doc.moveDown(0.5);

    // Datos personales si existen
    if (alumno.curp || alumno.telefono || alumno.ciudad) {
      sectionTitle(doc, "Datos Personales");
      if (alumno.curp)             infoRow(doc, "CURP",             alumno.curp);
      if (alumno.fecha_nacimiento) infoRow(doc, "Fecha Nacimiento", new Date(alumno.fecha_nacimiento).toLocaleDateString("es-MX"));
      if (alumno.lugar_nacimiento) infoRow(doc, "Lugar Nacimiento", alumno.lugar_nacimiento);
      if (alumno.sexo)             infoRow(doc, "Sexo",             alumno.sexo);
      if (alumno.telefono)         infoRow(doc, "Teléfono",         alumno.telefono);
      if (alumno.ciudad)           infoRow(doc, "Ciudad",           alumno.ciudad);
      if (alumno.estado_direccion) infoRow(doc, "Estado",           alumno.estado_direccion);
      doc.moveDown(0.5);
    }

    // Documentos
    sectionTitle(doc, "Estado del Expediente");

    const TIPOS = ["ACTA_NACIMIENTO", "CURP", "CERTIFICADO", "CONSTANCIA"];
    TIPOS.forEach(tipo => {
      const d = docs.find(x => x.tipo === tipo);
      const estado = d?.estado || "PENDIENTE";

      doc.font("Helvetica-Bold").fontSize(9).fillColor("#111827")
        .text(TIPO_LABEL[tipo], 40, doc.y, { continued: true, width: 300 });

      estadoBadge(doc, estado);
    });

    doc.moveDown(1);

    // Resumen
    const aprobados  = docs.filter(d => d.estado === "APROBADO").length;
    const pendientes = 4 - docs.length;
    sectionTitle(doc, "Resumen");
    infoRow(doc, "Documentos requeridos", "4");
    infoRow(doc, "Documentos subidos",    String(docs.length));
    infoRow(doc, "Aprobados",             String(aprobados));
    infoRow(doc, "Pendientes",            String(pendientes < 0 ? 0 : pendientes));

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
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    drawHeader(doc);

    doc.fontSize(16).fillColor("#111827").font("Helvetica-Bold")
      .text("Reporte General de Expedientes", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#6B7280").font("Helvetica")
      .text(`Total de alumnos: ${alumnos.length}`, { align: "center" });
    doc.moveDown(1);

    // Tabla
    const colX    = [40, 160, 320, 420, 500];
    const headers = ["Matrícula", "Nombre", "Carrera", "Docs", "Estado"];

    // Header de tabla
    doc.rect(40, doc.y, 515, 18).fillColor("#024E3F").fill();
    headers.forEach((h, i) => {
      doc.fontSize(8).fillColor("#FFFFFF").font("Helvetica-Bold")
        .text(h, colX[i], doc.y - 14, { width: (colX[i+1] || 555) - colX[i] - 4 });
    });
    doc.moveDown(0.2);

    // Filas
    alumnos.forEach((alumno, idx) => {
      const docsCount = alumno.documentos?.length || 0;
      const y = doc.y;
      const bg = idx % 2 === 0 ? "#F9FAFB" : "#FFFFFF";

      doc.rect(40, y, 515, 16).fillColor(bg).fill();

      doc.fontSize(8).fillColor("#111827").font("Helvetica");
      doc.text(alumno.matricula,           colX[0], y + 4, { width: colX[1] - colX[0] - 4 });
      doc.text(alumno.nombre,              colX[1], y + 4, { width: colX[2] - colX[1] - 4 });
      doc.text(alumno.carrera.substring(0, 25) + (alumno.carrera.length > 25 ? "..." : ""),
                                           colX[2], y + 4, { width: colX[3] - colX[2] - 4 });
      doc.text(`${docsCount}/4`,           colX[3], y + 4, { width: colX[4] - colX[3] - 4 });

      const estadoColor = alumno.estado === "ACTIVO" ? "#1D9E75" : "#E24B4A";
      doc.fontSize(8).fillColor(estadoColor).font("Helvetica-Bold")
        .text(alumno.estado,               colX[4], y + 4, { width: 55 - 4 });

      doc.moveDown(0.15);

      // Nueva página si se necesita
      if (doc.y > doc.page.height - 80) {
        doc.addPage();
        drawHeader(doc);
      }
    });

    drawFooter(doc);
    doc.end();
  });
};