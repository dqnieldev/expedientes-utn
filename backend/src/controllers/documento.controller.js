import {
  createDocumento,
  getDocumentosByAlumno,
  updateDocumentoEstado
} from "../services/documento.service.js"; // Importamos las funciones del servicio de documentos

// Controladores para manejar las solicitudes relacionadas con los documentos de los alumnos

// Crear un nuevo documento para un alumno
export const create = async (req, res) => {
  try {
    const doc = await createDocumento(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los documentos de un alumno específico
export const getByAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const docs = await getDocumentosByAlumno(Number(alumnoId));
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar el estado de un documento
export const updateEstado = async (req, res) => {
  try {
    const { id } = req.params; // ID del documento a actualizar
    const { estado } = req.body; // Nuevo estado para el documento (por ejemplo, aprobado, rechazado, pendiente)

    const doc = await updateDocumentoEstado(Number(id), estado);

    res.json(doc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};