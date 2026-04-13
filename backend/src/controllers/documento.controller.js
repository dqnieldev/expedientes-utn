import {
  createDocumento,
  getDocumentosByAlumno,
  updateDocumentoEstado,
  getAllDocumentos
} from "../services/documento.service.js";
import { registrarLog } from "../services/audit.service.js";

// Crear un nuevo documento para un alumno
export const create = async (req, res) => {
  try {
    const { tipo, alumnoId } = req.body;
    const filePath = req.file.filename;

    const doc = await createDocumento({
      tipo,
      url: filePath,
      alumnoId: Number(alumnoId)
    });

    res.status(201).json(doc);
  } catch (error) {
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
    });

    res.json(doc);
  } catch (error) {
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