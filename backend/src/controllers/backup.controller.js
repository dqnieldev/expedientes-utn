import {
  crearBackup,
  listarBackups,
  restaurarBackup,
  eliminarBackup
} from "../backups/backup.service.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { iniciarScheduler, detenerScheduler, getConfigActual } from "../backups/scheduler.service.js";
import { registrarLog } from "../services/audit.service.js";

const __filename  = fileURLToPath(import.meta.url);
const __dirname   = path.dirname(__filename);
const BACKUPS_DIR = path.join(__dirname, "../../backups");

export const crear = async (req, res) => {
  try {
    const result = await crearBackup();

    await registrarLog({
      accion:    "CREAR_BACKUP",
      entidad:   "BACKUP",
      detalle:   `Backup creado: ${result.filename} (${result.size})`,
      usuarioId: req.user?.id,
      ip:        req.ip,
    });

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

// ── Obtener config actual del scheduler ───────────────────────────────────────
export const getScheduler = (req, res) => {
  const config = getConfigActual();
  res.json({ config: config ?? null });
};

// ── Guardar y aplicar config del scheduler ────────────────────────────────────
export const setScheduler = (req, res) => {
  try {
    const { activo, frecuencia, hora, diaSemana } = req.body;

    // Validaciones básicas
    if (activo && !frecuencia) 
      return res.status(400).json({ message: "La frecuencia es requerida" });
    if (activo && !hora)
      return res.status(400).json({ message: "La hora es requerida" });
    if (activo && frecuencia === "semanal" && diaSemana === undefined)
      return res.status(400).json({ message: "El día de la semana es requerido" });

    const config = { activo, frecuencia, hora, diaSemana };
    iniciarScheduler(config);

    res.json({ message: activo ? "Respaldo automático programado" : "Respaldo automático desactivado", config });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};