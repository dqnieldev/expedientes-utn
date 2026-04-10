import cron from "node-cron";
import { crearBackup } from "./backup.service.js";
import transporter from "../config/mailer.js";
import prisma from "../config/prisma.js";
import { EventEmitter } from "events";
EventEmitter.defaultMaxListeners = 20;

let tareaActiva = null;
let configActual = null;

// Convierte la config del admin a expresión cron
const buildCronExpression = ({ frecuencia, hora, diaSemana }) => {
  const [h, m] = hora.split(":").map(Number);
  if (frecuencia === "diario")  return `${m} ${h} * * *`;
  if (frecuencia === "semanal") return `${m} ${h} * * ${diaSemana}`; // 0=dom, 1=lun...
  if (frecuencia === "cada6h")  return `0 */6 * * *`;
  throw new Error("Frecuencia inválida");
};

const notificarAdmin = async (filename, size) => {
  try {
    // Obtener email del admin
    const admin = await prisma.usuario.findFirst({
      where: { role: "ADMIN" },
    });
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

// Inicia o reinicia la tarea programada
export const iniciarScheduler = (config) => {
  // Detener tarea anterior si existe
  if (tareaActiva) {
    tareaActiva.stop();
    tareaActiva = null;
  }

  if (!config.activo) {
    configActual = null;
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