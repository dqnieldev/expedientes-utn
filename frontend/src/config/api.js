// Configuración centralizada de URLs para la API y archivos estáticos (uploads)
// En desarrollo usa http://localhost:3000, en producción usa la variable VITE_API_URL
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
export const SERVER_URL = API_BASE_URL.replace(/\/api$/, "");

export function getFileUrl(url) {
  if (!url) return "#";
  const clean = String(url).trim();

  // Si ya es una URL HTTP/HTTPS pública remota, usarla directamente
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // Si la base de datos contiene Data URI Base64 o un nombre de archivo local/remoto,
  // consultar siempre al endpoint de streaming del backend /uploads/{url}
  if (clean.startsWith("/uploads/")) {
    return `${SERVER_URL}${clean}`;
  }
  if (clean.startsWith("uploads/")) {
    return `${SERVER_URL}/${clean}`;
  }

  // Si es un hash o nombre de archivo o Data URI, llamar a /uploads/ para que Express haga streaming directo
  const filename = clean.startsWith("data:") ? `doc_${Date.now()}.pdf` : clean;
  return `${SERVER_URL}/uploads/${filename}`;
}
