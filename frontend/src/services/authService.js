import axios from "axios";

const API = "http://localhost:3000/api/auth";

export const login = async (data) => {
  const res = await axios.post(`${API}/login`, data);
  return res.data;
};

// ── Helpers de sesión ─────────────────────────────────────────────────────────

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutos en ms

// Guarda el timestamp de última actividad
export const updateActivity = () => {
  localStorage.setItem("lastActivity", Date.now().toString());
};

// Devuelve ms desde la última actividad
export const getInactivityTime = () => {
  const last = localStorage.getItem("lastActivity");
  if (!last) return Infinity;
  return Date.now() - parseInt(last);
};

// Verifica si el token JWT ha expirado
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

// Tiempo restante del token en ms
export const getTokenTimeLeft = () => {
  const token = localStorage.getItem("token");
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Math.max(0, payload.exp * 1000 - Date.now());
  } catch {
    return 0;
  }
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/";
};

export { INACTIVITY_LIMIT };