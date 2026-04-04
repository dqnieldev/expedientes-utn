import { createAlumno } from "../services/alumno.service.js"; // Importar función para crear alumno
import { getAlumnos,getMyAlumno } from "../services/alumno.service.js"; // Importar función para obtener el alumno asociado al usuario autenticado
import { updateAlumno } from "../services/alumno.service.js"; // Importar función para actualizar alumno (solo para ADMIN)
import { updatePerfilAlumno } from "../services/alumno.service.js"; // Importar función para que el alumno actualice su propio perfil
import { updateFotoAlumno } from "../services/alumno.service.js"; // Importar función para actualizar foto de perfil del alumno
import upload from "../config/multer.js";


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

// Agregar controlador para que el alumno actualice su propio perfil
export const updatePerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    // Si se envía fecha de nacimiento, convertirla a Date
    if (req.body.fecha_nacimiento) {
      req.body.fecha_nacimiento = new Date(req.body.fecha_nacimiento);
    }

    const alumno = await updatePerfilAlumno(userId, req.body); // Actualizar el alumno asociado al usuario autenticado

    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Agregar controlador para actualizar la foto de perfil del alumno
export const updateFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se recibió imagen" });
    const alumno = await updateFotoAlumno(req.user.id, req.file.filename);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};