// Configuración centralizada de URLs para la API y archivos estáticos (uploads)
// En desarrollo usa http://localhost:3000, en producción usa la variable VITE_API_URL
const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_BASE_URL = rawApiUrl.replace(/\/$/, "");
export const SERVER_URL = API_BASE_URL.replace(/\/api$/, "");

export function getFileUrl(url) {
  if (!url) return "#";
  const clean = String(url).trim();
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:")) {
    return clean;
  }
  if (clean.startsWith("/uploads/") || clean.startsWith("uploads/")) {
    const filename = clean.replace(/^\/?uploads\//, "");
    return `${SERVER_URL}/uploads/${filename}`;
  }
  return `${SERVER_URL}/uploads/${clean}`;
}
