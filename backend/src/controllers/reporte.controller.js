import { generarReporteAlumno, generarReporteGeneral } from "../reports/reporte.service.js";
import prisma from "../config/prisma.js";

// Reporte de expediente de un alumno específico
export const reporteAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;

    const alumno = await prisma.alumno.findUnique({
      where: { id: Number(alumnoId) }
    });

    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    const docs = await prisma.documento.findMany({
      where: { alumnoId: Number(alumnoId) }
    });

    const pdfBuffer = await generarReporteAlumno(alumno, docs);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="expediente-${alumno.matricula}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Reporte general de todos los alumnos (solo ADMIN)
export const reporteGeneral = async (req, res) => {
  try {
    const alumnos = await prisma.alumno.findMany({
      include: {
        documentos: true
      },
      orderBy: { nombre: "asc" }
    });

    const pdfBuffer = await generarReporteGeneral(alumnos);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="reporte-general-expedientes.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Reporte del alumno autenticado (para el alumno)
export const reporteMio = async (req, res) => {
  try {
    const alumno = await prisma.alumno.findUnique({
      where: { usuarioId: req.user.id }
    });

    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });

    const docs = await prisma.documento.findMany({
      where: { alumnoId: alumno.id }
    });

    const pdfBuffer = await generarReporteAlumno(alumno, docs);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="mi-expediente.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};