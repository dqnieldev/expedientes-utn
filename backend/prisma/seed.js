import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("🌱 Iniciando actualización de usuarios y correos reales...");

  // Limpiar/actualizar usuarios anteriores para asegurar que los correos lleguen a direcciones reales
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
  console.log("✅ Admin configurado:", admin.email);

  // Desarrollador
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
  console.log("✅ Developer configurado:", dev.email);

  // Alumno con email real para recibir notificaciones verdaderas
  const alumnoPassword = await bcrypt.hash("alumno123", 10);
  const usuarioAlumno = await prisma.usuario.upsert({
    where: { email: "darkcabrera@gmail.com" }, // Usar email real para pruebas completas
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      email: "tic-310134@utnay.edu.mx",
      password: alumnoPassword,
      role: "ALUMNO",
      mustChangePassword: false,
    },
  });

  // Alumno de prueba con email institucional pero también uno secundario real
  const usuarioAlumnoReal = await prisma.usuario.upsert({
    where: { email: "paperlessutndev@gmail.com" },
    update: { role: "DEVELOPER" },
    create: {
      email: "paperlessutndev@gmail.com",
      password: devPassword,
      role: "DEVELOPER",
      mustChangePassword: false,
    },
  });

  // Asegurar que el registro Alumno apunte al usuario
  const alumno = await prisma.alumno.upsert({
    where: { matricula: "TIC-310134" },
    update: { usuarioId: admin.id }, // Vincular al admin para pruebas
    create: {
      nombre: "Luis Daniel López Cabrera",
      matricula: "TIC-310134",
      carrera: "Ingeniería en Desarrollo y Gestión de Software",
      cuatrimestre_actual: 8,
      estado: "ACTIVO",
      usuarioId: admin.id,
    },
  });

  console.log("✅ Alumno vinculado a correo real:", admin.email, "— Matricula:", alumno.matricula);
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });