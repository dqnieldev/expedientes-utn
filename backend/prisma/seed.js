import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@utn.com";
  const password = "admin123";

  // verificar si ya existe
  const existing = await prisma.usuario.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("⚠️ El admin ya existe");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      mustChangePassword: false
    }
  });

  console.log("✅ Admin creado:");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", password);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });