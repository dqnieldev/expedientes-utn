import {
  createAlumno,
  getAlumnos,
  getMyAlumno,
  updateAlumno,
  updatePerfilAlumno,
  updateFotoAlumno,
  getAlumnoById
} from "../services/alumno.service.js";
import { cambiarEstadoAlumno } from "../services/alumno.service.js";
import { eliminarAlumno } from "../services/alumno.service.js";

// Controlador para crear un nuevo alumno (solo para ADMIN)
export const create = async (req, res) => {
  try {
    const alumno = await createAlumno(req.body);
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los alumnos (solo ADMIN)
export const getAll = async (req, res) => {
  try {
    const alumnos = await getAlumnos();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener el perfil del alumno autenticado
export const getProfile = async (req, res) => {
  try {
    const alumno = await getMyAlumno(req.user.id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un alumno por ID (solo ADMIN)
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await getAlumnoById(Number(id));
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar alumno (solo ADMIN)
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const alumno = await updateAlumno(Number(id), req.body);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar perfil del alumno autenticado
export const updatePerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    if (req.body.fecha_nacimiento) {
      req.body.fecha_nacimiento = new Date(req.body.fecha_nacimiento);
    }
    const alumno = await updatePerfilAlumno(userId, req.body);
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Actualizar foto de perfil del alumno
export const updateFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se recibió imagen" });
    const alumno = await updateFotoAlumno(req.user.id, req.file.filename);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ── Cambiar estado del alumno ─────────────────────────────────────────────────
export const cambiarEstado = async (req, res) => {
  try {
    const { id }     = req.params;
    const { estado } = req.body;

    const estadosValidos = ["ACTIVO", "BAJA", "BAJA_TEMPORAL"];
    if (!estadosValidos.includes(estado))
      return res.status(400).json({ message: "Estado inválido" });

    const alumno = await cambiarEstadoAlumno(Number(id), estado);
    res.json({ message: "Estado actualizado correctamente", alumno });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ELIMINAR ALUMNO (SOLO PARA ADMIN)
export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAlumno(Number(id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};