// src/services/audit.service.js
import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const LOG_PATH   = path.join(__dirname, "../../logs/audit.log");

// Asegurar que existe la carpeta logs
const ensureLogsDir = () => {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Escribir en archivo
const escribirArchivo = (entry) => {
  try {
    ensureLogsDir();
    const linea = `[${entry.createdAt}] [${entry.accion}] [${entry.entidad}] ${entry.detalle ?? ""} | usuarioId:${entry.usuarioId ?? "sistema"} | ip:${entry.ip ?? "-"}\n`;
    fs.appendFileSync(LOG_PATH, linea, "utf-8");
  } catch (err) {
    console.error("Error escribiendo log en archivo:", err.message);
  }
};

// Registrar evento
export const registrarLog = async ({ accion, entidad, entidadId, detalle, usuarioId, ip }) => {
  try {
    const log = await prisma.auditLog.create({
      data: {
        accion,
        entidad,
        entidadId: entidadId ?? null,
        detalle:   detalle   ?? null,
        usuarioId: usuarioId ?? null,
        ip:        ip        ?? null,
      },
    });
    escribirArchivo({ ...log, createdAt: log.createdAt.toISOString() });
    return log;
  } catch (err) {
    console.error("Error registrando log:", err.message);
  }
};

// Obtener logs paginados
export const getLogs = async ({ page = 1, limit = 50, accion, entidad } = {}) => {
  const where = {
    ...(accion  && { accion }),
    ...(entidad && { entidad }),
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, pages: Math.ceil(total / limit) };
};