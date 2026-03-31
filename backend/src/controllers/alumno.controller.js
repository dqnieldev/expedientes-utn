import { createAlumno } from "../services/alumno.service.js"; // Importar función para crear alumno
import { getAlumnos,getMyAlumno } from "../services/alumno.service.js"; // Importar función para obtener el alumno asociado al usuario autenticado
import { updateAlumno } from "../services/alumno.service.js"; // Importar función para actualizar alumno (solo para ADMIN)

// Controlador para crear un nuevo alumno (solo para ADMIN)
export const create = async (req, res) => {
  try {
    const alumno = await createAlumno(req.body);

    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Agregar controlador para obtener todos los alumnos (solo para ADMIN)
export const getAll = async (req, res) => {
  try {
    const alumnos = await getAlumnos();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar controlador para obtener el perfil del alumno autenticado
export const getProfile = async (req, res) => {
  try {
    const alumno = await getMyAlumno(req.user.id);

    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar controlador para actualizar un alumno (solo para ADMIN)
export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const alumno = await updateAlumno(Number(id), req.body);

    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};