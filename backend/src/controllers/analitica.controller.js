import { getAnaliticaDataset } from "../services/analitica.service.js";

export const obtenerDataset = async (req, res) => {
  try {
    const dataset = await getAnaliticaDataset();
    res.json(dataset);
  } catch (error) {
    console.error("Error obteniendo dataset de analítica:", error.message);
    res.status(500).json({ message: "Error al generar el dataset de analítica" });
  }
};
