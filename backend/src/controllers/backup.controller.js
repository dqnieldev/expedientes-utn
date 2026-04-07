import {
  crearBackup,
  listarBackups,
  restaurarBackup,
  eliminarBackup
} from "../backups/backup.service.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);
const BACKUPS_DIR = path.join(__dirname, "../../backups");

export const crear = async (req, res) => {
  try {
    const result = await crearBackup();
    res.json({ message: "Respaldo creado exitosamente", backup: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear respaldo: " + error.message });
  }
};

export const listar = async (req, res) => {
  try {
    const backups = listarBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restaurar = async (req, res) => {
  try {
    const { filename } = req.params;
    const result = await restaurarBackup(filename);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al restaurar: " + error.message });
  }
};

export const eliminar = async (req, res) => {
  try {
    const { filename } = req.params;
    const result = eliminarBackup(filename);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const descargar = async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(BACKUPS_DIR, filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    res.download(filepath, filename);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};