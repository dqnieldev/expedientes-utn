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


const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev")); // Agrega el middleware de morgan para registrar las solicitudes HTTP

app.get("/", (req, res) => {
  res.send("API Expedientes UTN funcionando ");
});
// Rutas de la API de usuarios, autenticación, alumnos y documentos
app.use("/api/user", userRoutes);
app.use("/api/auth/login", loginRateLimit);
app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/public", express.static("public")); // para servir el membrete
app.use("/api/backups", backupRoutes); // Rutas para gestión de respaldos


app.use("/uploads", express.static("uploads"));  // Servir archivos estáticos desde la carpeta "uploads"
  

export default app;