import { createAlumno } from "../services/alumno.service.js";

export const create = async (req, res) => {
  try {
    const alumno = await createAlumno(req.body);

    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};