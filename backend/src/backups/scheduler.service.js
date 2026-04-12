// src/backups/scheduler.service.js
import cron from "node-cron";
import { crearBackup } from "./backup.service.js";
import transporter from "../config/mailer.js";
import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Archivo donde se persiste la config
const CONFIG_PATH = path.join(__dirname, "../../scheduler.config.json");

let tareaActiva = null;
let configActual = null;

// ── Leer config desde archivo ─────────────────────────────────────────────────
const leerConfig = () => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error leyendo scheduler.config.json:", err.message);
  }
  return null;
};

// ── Guardar config en archivo ─────────────────────────────────────────────────
const guardarConfig = (config) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Error guardando scheduler.config.json:", err.message);
  }
};

// ── Construir expresión cron ──────────────────────────────────────────────────
const buildCronExpression = ({ frecuencia, hora, diaSemana }) => {
  const [h, m] = hora.split(":").map(Number);
  if (frecuencia === "diario")  return `${m} ${h} * * *`;
  if (frecuencia === "semanal") return `${m} ${h} * * ${diaSemana}`;
  if (frecuencia === "cada6h")  return `0 */6 * * *`;
  throw new Error("Frecuencia inválida");
};

// ── Notificar al admin por email ──────────────────────────────────────────────
const notificarAdmin = async (filename, size) => {
  try {
    const admin = await prisma.usuario.findFirst({ where: { role: "ADMIN" } });
    if (!admin?.email) return;

    await transporter.sendMail({
      from:    `"Paperless UTN" <${process.env.GMAIL_USER}>`,
      to:      admin.email,
      subject: "✅ Respaldo automático completado — Paperless UTN",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1a2744;margin-bottom:8px">Respaldo completado</h2>
          <p style="color:#6b7280;font-size:14px">Se generó un respaldo automático exitosamente.</p>
          <table style="margin-top:16px;width:100%;font-size:13px;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#9ca3af;width:120px">Archivo</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${filename}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9ca3af">Tamaño</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${size}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9ca3af">Fecha</td>
              <td style="padding:8px 0;color:#111827;font-weight:600">${new Date().toLocaleString("es-MX")}</td>
            </tr>
          </table>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">Sistema Paperless — Universidad Tecnológica de Nayarit</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Error enviando notificación de respaldo:", err.message);
  }
};

// ── Iniciar o reiniciar scheduler ─────────────────────────────────────────────
export const iniciarScheduler = (config) => {
  process.setMaxListeners(20);

  if (tareaActiva) {
    tareaActiva.stop();
    tareaActiva = null;
  }

  if (!config.activo) {
    configActual = null;
    guardarConfig({ activo: false });
    console.log("🔴 Respaldos automáticos desactivados");
    return;
  }

  const expresion = buildCronExpression(config);

  tareaActiva = cron.schedule(expresion, async () => {
    console.log("⏰ Ejecutando respaldo automático...");
    try {
      const resultado = await crearBackup();
      console.log("✅ Respaldo automático creado:", resultado.filename);
      await notificarAdmin(resultado.filename, resultado.size);
    } catch (err) {
      console.error("❌ Error en respaldo automático:", err.message);
    }
  }, { timezone: "America/Mazatlan" });

  configActual = config;
  guardarConfig(config); // ← persiste en archivo
  console.log(`✅ Respaldo automático programado: ${expresion}`);
};

export const detenerScheduler = () => {
  if (tareaActiva) {
    tareaActiva.stop();
    tareaActiva = null;
  }
  configActual = null;
};

export const getConfigActual = () => configActual;

// ── Restaurar scheduler al arrancar el servidor ───────────────────────────────
export const restaurarScheduler = () => {
  const config = leerConfig();
  if (config?.activo) {
    console.log("🔄 Restaurando scheduler desde archivo...");
    iniciarScheduler(config);
  }
};