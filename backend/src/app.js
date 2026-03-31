import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import alumnoRoutes from "./routes/alumno.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Expedientes UTN funcionando ");
});
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/alumnos", alumnoRoutes);

export default app;