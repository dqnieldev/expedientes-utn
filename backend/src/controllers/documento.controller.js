import {
  createDocumento,
  getDocumentosByAlumno,
  updateDocumentoEstado,
  getAllDocumentos
} from "../services/documento.service.js";

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
    const { id } = req.params;
    const { estado } = req.body;

    const doc = await updateDocumentoEstado(Number(id), estado);

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