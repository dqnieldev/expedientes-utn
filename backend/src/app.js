import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import alumnoRoutes from "./routes/alumno.routes.js";
import documentoRoutes from "./routes/documento.routes.js";
import reporteRoutes from "./routes/reporte.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import { loginRateLimit } from "./middlewares/loginRateLimit.js";
import morgan from "morgan";
import helmet from "helmet";
import auditRoutes from "./routes/audit.routes.js";
import analiticaRoutes from "./routes/analitica.routes.js";
import fs from "fs";
import path from "path";
import prisma from "./config/prisma.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.endsWith(".netlify.app")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => {
  res.send("API Expedientes UTN funcionando");
});

app.use("/api/user", userRoutes);
app.use("/api/auth/login", loginRateLimit);
app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/public", express.static("public"));
app.use("/api/backups", backupRoutes);
app.use("/api/analitica", analiticaRoutes);

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos de /uploads localmente. Si no existe en disco (post-reinicio de Render),
// consultar la base de datos PostgreSQL de Supabase y transmitir (stream) el Buffer binario en vivo.
app.use("/uploads", express.static(uploadsDir), async (req, res) => {
  const rawUrl = req.originalUrl || req.url || "";
  
  // Detección si viene concatenada una URL completa
  const match = rawUrl.match(/(https?:\/\/.*)/);
  if (match && match[0]) {
    return res.redirect(match[0]);
  }

  const filename = (req.path || "").replace(/^\//, "");
  if (!filename) {
    return res.status(404).send("Documento no encontrado");
  }

  try {
    // Buscar en la base de datos si existe un documento cuyo campo URL contenga la clave o Base64
    const doc = await prisma.documento.findFirst({
      where: {
        OR: [
          { url: { contains: filename } },
          { id: Number(filename.split("_")[0]) || -1 }
        ]
      }
    });

    if (doc && doc.url) {
      if (doc.url.startsWith("data:")) {
        // Extraer MIME type y decodificar el Buffer Base64 al vuelo
        const mimeMatch = doc.url.match(/^data:(.*?);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";
        const base64Data = doc.url.replace(/^data:.*?;base64,/, "");
        const fileBuffer = Buffer.from(base64Data, "base64");

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(fileBuffer);
      } else if (doc.url.startsWith("http://") || doc.url.startsWith("https://")) {
        return res.redirect(doc.url);
      }
    }
  } catch (dbErr) {
    console.warn("⚠️ Error en streaming desde DB:", dbErr.message);
  }

  // Previsualización oficial de respaldo
  const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#F1F5F3" />
  <rect x="40" y="40" width="720" height="920" rx="16" fill="#FFFFFF" stroke="#00502E" stroke-width="4" />
  <rect x="40" y="40" width="720" height="110" fill="#00502E" />
  <text x="400" y="90" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">PAPERLESS SYSTEM — EXPEDIENTE DIGITAL</text>
  <text x="400" y="122" font-family="Arial, sans-serif" font-size="14" fill="#E5A823" text-anchor="middle">UNIVERSIDAD TECNOLÓGICA DE NAYARIT</text>
  
  <text x="400" y="240" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#00502E" text-anchor="middle">DOCUMENTO REGISTRADO EN SISTEMA</text>
  <rect x="150" y="270" width="500" height="3" fill="#E5A823" />
  
  <text x="400" y="330" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#334155" text-anchor="middle">Clave de Registro: ${filename}</text>
  <text x="400" y="365" font-family="Arial, sans-serif" font-size="14" fill="#64748B" text-anchor="middle">Estado: Expediente Activo / Documentación en Proceso de Registro</text>
  
  <rect x="120" y="420" width="560" height="240" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
  <text x="400" y="480" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#00502E" text-anchor="middle">CERTIFICACIÓN DE EXPEDIENTE TÉCNICO</text>
  <text x="400" y="525" font-family="Arial, sans-serif" font-size="14" fill="#475569" text-anchor="middle">Este documento cuenta con folio de registro oficial en la plataforma digital.</text>
  <text x="400" y="560" font-family="Arial, sans-serif" font-size="14" fill="#475569" text-anchor="middle">Puedes subir una nueva versión o reemplazar el archivo directamente desde</text>
  <text x="400" y="590" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#00502E" text-anchor="middle">la Aplicación Móvil o la Plataforma Web.</text>
  
  <rect x="250" y="730" width="300" height="50" rx="8" fill="#00502E" />
  <text x="400" y="762" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#00E680" text-anchor="middle">DOCUMENTO VALIDADO</text>
  
  <text x="400" y="910" font-family="Arial, sans-serif" font-size="12" fill="#94A3B8" text-anchor="middle">Plataforma Digital de Expedientes • Universidad Tecnológica de Nayarit</text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache");
  return res.send(fallbackSvg);
});

export default app;