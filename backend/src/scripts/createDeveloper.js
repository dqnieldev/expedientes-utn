import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const email    = "paperlessutndev@gmail.com";   // ← cambia esto
const password = "Dev123456";              // ← cambia esto

async function main() {
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) {
    console.log("⚠️  Ya existe un usuario con ese email.");
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.usuario.create({
    data: {
      email,
      password: hash,
      role: "DEVELOPER",
      mustChangePassword: false,   // tú ya sabes la contraseña
    },
  });

  console.log("✅ Developer creado:");
  console.log(`   Email : ${user.email}`);
  console.log(`   Rol   : ${user.role}`);
  console.log(`   ID    : ${user.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());