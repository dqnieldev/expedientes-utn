import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PG_DUMP    = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe"`;
const PG_RESTORE = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_restore.exe"`;
const PSQL       = `"C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe"`;
const BACKUPS_DIR = path.join(__dirname, "../../backups");

// Parsear DATABASE_URL para extraer credenciales
function parseDbUrl(url) {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) throw new Error("DATABASE_URL inválida");
  return {
    user:     match[1],
    password: match[2],
    host:     match[3],
    port:     match[4],
    database: match[5]
  };
}

// Asegurar que existe la carpeta de backups
function ensureBackupsDir() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
}

// Crear respaldo
export const crearBackup = async () => {
  ensureBackupsDir();

  const db  = parseDbUrl(process.env.DATABASE_URL);
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}_${String(now.getHours()).padStart(2,"0")}${String(now.getMinutes()).padStart(2,"0")}${String(now.getSeconds()).padStart(2,"0")}`;
  const filename  = `backup_${timestamp}.sql`;
  const filepath  = path.join(BACKUPS_DIR, filename);

  const cmd = `${PG_DUMP} -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -F p -f "${filepath}"`;

  const env = { ...process.env, PGPASSWORD: db.password };

  await execAsync(cmd, { env });

  const stats = fs.statSync(filepath);

  return {
    filename,
    filepath,
    size: `${(stats.size / 1024).toFixed(1)} KB`,
    createdAt: now.toISOString()
  };
};

// Listar respaldos
export const listarBackups = () => {
  ensureBackupsDir();

  const files = fs.readdirSync(BACKUPS_DIR)
    .filter(f => f.endsWith(".sql"))
    .map(f => {
      const filepath = path.join(BACKUPS_DIR, f);
      const stats    = fs.statSync(filepath);
      return {
        filename:  f,
        size:      `${(stats.size / 1024).toFixed(1)} KB`,
        createdAt: stats.mtime.toISOString()
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return files;
};

// Restaurar respaldo
export const restaurarBackup = async (filename) => {
  const filepath = path.join(BACKUPS_DIR, filename);

  if (!fs.existsSync(filepath)) {
    throw new Error("El archivo de respaldo no existe");
  }

  const db  = parseDbUrl(process.env.DATABASE_URL);
  const env = { ...process.env, PGPASSWORD: db.password };

  // Primero eliminar conexiones activas
  const dropCmd = `${PSQL} -h ${db.host} -p ${db.port} -U ${db.user} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='${db.database}' AND pid <> pg_backend_pid();"`;
  await execAsync(dropCmd, { env });

  // Restaurar con psql
  const restoreCmd = `${PSQL} -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -f "${filepath}"`;
  await execAsync(restoreCmd, { env });

  return { message: "Restauración completada", filename };
};

// Eliminar respaldo
export const eliminarBackup = (filename) => {
  const filepath = path.join(BACKUPS_DIR, filename);
  if (!fs.existsSync(filepath)) throw new Error("Archivo no encontrado");
  fs.unlinkSync(filepath);
  return { message: "Respaldo eliminado", filename };
};