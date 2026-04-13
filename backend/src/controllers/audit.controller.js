import { getLogs } from "../services/audit.service.js";

export const listarLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, accion, entidad } = req.query;
    const result = await getLogs({
      page:    Number(page),
      limit:   Number(limit),
      accion,
      entidad,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};