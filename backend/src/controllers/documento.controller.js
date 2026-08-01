import {
  createDocumento,
  getDocumentosByAlumno,
  updateDocumentoEstado,
  getAllDocumentos
} from "../services/documento.service.js";
import { registrarLog } from "../services/audit.service.js";
import prisma from "../config/prisma.js";
import { uploadBufferToSupabase } from "../config/supabase.js";
import fs from "fs";

// Crear o actualizar un documento para un alumno
export const create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibió ningún archivo válido" });
    }

    const { tipo, alumnoId } = req.body;
    if (!tipo) {
      return res.status(400).json({ message: "El tipo de documento es requerido" });
    }

    let targetAlumnoId = Number(alumnoId);
    if (!targetAlumnoId && req.user?.id) {
      const alumno = await prisma.alumno.findUnique({ where: { usuarioId: req.user.id } });
      if (alumno) targetAlumnoId = alumno.id;
    }

    if (!targetAlumnoId) {
      return res.status(400).json({ message: "No se encontró el perfil de alumno para asociar el documento" });
    }

    const ext = req.file.originalname?.endsWith(".png") ? ".png" : req.file.originalname?.endsWith(".jpg") ? ".jpg" : ".pdf";
    const filename = req.file.filename || `${Date.now()}_${targetAlumnoId}${ext}`;

    let fileUrl = filename;

    // Intentar subida directa a Supabase Storage (Nube Persistente)
    if (req.file.buffer) {
      const supabaseUrl = await uploadBufferToSupabase(req.file.buffer, filename, req.file.mimetype || "application/pdf");
      if (supabaseUrl) {
        fileUrl = supabaseUrl;
      }
    } else if (req.file.path) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const supabaseUrl = await uploadBufferToSupabase(fileBuffer, filename, req.file.mimetype || "application/pdf");
        if (supabaseUrl) {
          fileUrl = supabaseUrl;
        }
      } catch (err) {
        console.warn("Could not read disk file for Supabase upload:", err.message);
      }
    }

    const doc = await createDocumento({
      tipo,
      url: fileUrl,
      alumnoId: targetAlumnoId
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error("Error en subida de documento:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Actualizar el estado de un documento
export const updateEstado = async (req, res) => {
  try {
    const { id }                          = req.params;
    const { estado, razonRechazo = null } = req.body;

    const doc = await updateDocumentoEstado(Number(id), estado, razonRechazo);

    await registrarLog({
      accion:    estado === "APROBADO" ? "APROBAR_DOCUMENTO" : estado === "RECHAZADO" ? "RECHAZAR_DOCUMENTO" : "ACTUALIZAR_DOCUMENTO",
      entidad:   "DOCUMENTO",
      entidadId: Number(id),
      detalle:   `Documento ${estado}${razonRechazo ? ` — Motivo: ${razonRechazo}` : ""}`,
      usuarioId: req.user?.id,
      ip:        req.ip,
    }).catch(() => {});

    res.json(doc);
  } catch (error) {
    console.error("Error actualizando estado de documento:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Obtener documentos de un alumno
export const getByAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const docs = await getDocumentosByAlumno(Number(alumnoId));
    res.json(docs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los documentos (solo ADMIN)
export const getAll = async (req, res) => {
  try {
    const docs = await getAllDocumentos();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};