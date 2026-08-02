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

app.use(express.json());
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

// Servir archivos de /uploads localmente. Si no existen en disco local (por reinicios de Render),
// redirigir transparentemente a Supabase Storage
app.use("/uploads", express.static(uploadsDir), (req, res) => {
  const rawPath = req.path || "";
  const filename = rawPath.replace(/^\//, "");
  if (filename) {
    const supabasePublicUrl = `https://gedlvdoioengnwnaxflk.supabase.co/storage/v1/object/public/expedientes-storage/uploads/${filename}`;
    return res.redirect(supabasePublicUrl);
  }
  res.status(404).send("Documento no encontrado");
});

export default app;