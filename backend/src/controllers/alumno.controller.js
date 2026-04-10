import {
  createAlumno, getAlumnos, getMyAlumno,
  updateAlumno, updatePerfilAlumno,
  updateFotoAlumno, getAlumnoById,
  cambiarEstadoAlumno, eliminarAlumno,
} from "../services/alumno.service.js";
import { body, param, validationResult } from "express-validator";

// ── Helper ────────────────────────────────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });
  return null;
};

// ── Validadores exportados ────────────────────────────────────────────────────
export const validateCrearAlumno = [
  body("nombre")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .trim(),
  body("matricula")
    .notEmpty().withMessage("La matrícula es requerida")
    .isLength({ min: 3, max: 20 }).withMessage("Matrícula inválida")
    .trim(),
  body("carrera")
    .notEmpty().withMessage("La carrera es requerida")
    .trim(),
  body("cuatrimestre_actual")
    .notEmpty().withMessage("El cuatrimestre es requerido")
    .isInt({ min: 1, max: 12 }).withMessage("Cuatrimestre debe ser entre 1 y 12"),
  body("email")
    .notEmpty().withMessage("El correo es requerido")
    .isEmail().withMessage("Formato de correo inválido")
    .normalizeEmail(),
];

export const validateUpdateAlumno = [
  body("nombre")
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 100 caracteres")
    .trim(),
  body("cuatrimestre_actual")
    .optional()
    .isInt({ min: 1, max: 12 }).withMessage("Cuatrimestre debe ser entre 1 y 12"),
  body("email")
    .optional()
    .isEmail().withMessage("Formato de correo inválido")
    .normalizeEmail(),
];

export const validateUpdatePerfil = [
  body("telefono")
    .optional()
    .isMobilePhone("es-MX").withMessage("Teléfono inválido"),
  body("codigo_postal")
    .optional()
    .isPostalCode("MX").withMessage("Código postal inválido"),
  body("fecha_nacimiento")
    .optional()
    .isISO8601().withMessage("Fecha de nacimiento inválida"),
  body("curp")
    .optional()
    .isLength({ min: 18, max: 18 }).withMessage("CURP debe tener 18 caracteres")
    .trim(),
];

// ── Controllers ───────────────────────────────────────────────────────────────

export const create = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const alumno = await createAlumno(req.body);
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const alumnos = await getAlumnos();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const alumno = await getMyAlumno(req.user.id);
    if (!alumno) return res.status(404).json({ message: "Alumno no encontrado" });
    res.json(alumno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const update = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const { id } = req.params;
    const alumno = await updateAlumno(Number(id), req.body);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePerfil = async (req, res) => {
  const err = validate(req, res);
  if (err) return;

  try {
    const userId = req.user.id;
    if (req.body.fecha_nacimiento)
      req.body.fecha_nacimiento = new Date(req.body.fecha_nacimiento);
    const alumno = await updatePerfilAlumno(userId, req.body);
    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateFoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se recibió imagen" });
    const alumno = await updateFotoAlumno(req.user.id, req.file.filename);
    res.json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await eliminarAlumno(Number(id));
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};