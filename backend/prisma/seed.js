import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Iniciando seed de usuarios iniciales...");

  // 1. Administrador (darkcabrera@gmail.com)
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.usuario.upsert({
    where: { email: "darkcabrera@gmail.com" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      email: "darkcabrera@gmail.com",
      password: adminPassword,
      role: "ADMIN",
      mustChangePassword: false,
    },
  });
  console.log("✅ Admin preparado:", admin.email);

  // 2. Desarrollador (paperlessutndev@gmail.com)
  const devPassword = await bcrypt.hash("dev123", 10);
  const dev = await prisma.usuario.upsert({
    where: { email: "paperlessutndev@gmail.com" },
    update: { password: devPassword, role: "DEVELOPER" },
    create: {
      email: "paperlessutndev@gmail.com",
      password: devPassword,
      role: "DEVELOPER",
      mustChangePassword: false,
    },
  });
  console.log("✅ Developer preparado:", dev.email);

  // 3. Alumno (tic-310134@utnay.edu.mx)
  const alumnoPassword = await bcrypt.hash("alumno123", 10);
  const usuarioAlumno = await prisma.usuario.upsert({
    where: { email: "tic-310134@utnay.edu.mx" },
    update: { password: alumnoPassword, role: "ALUMNO" },
    create: {
      email: "tic-310134@utnay.edu.mx",
      password: alumnoPassword,
      role: "ALUMNO",
      mustChangePassword: false,
    },
  });

  // Crear o vincular registro de Alumno
  const alumno = await prisma.alumno.upsert({
    where: { matricula: "TIC-310134" },
    update: { usuarioId: usuarioAlumno.id },
    create: {
      nombre: "Luis Daniel López Cabrera",
      matricula: "TIC-310134",
      carrera: "Ingeniería en Desarrollo y Gestión de Software",
      cuatrimestre_actual: 8,
      estado: "ACTIVO",
      usuarioId: usuarioAlumno.id,
    },
  });

  console.log("✅ Alumno preparado:", usuarioAlumno.email, "— Matricula:", alumno.matricula);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });