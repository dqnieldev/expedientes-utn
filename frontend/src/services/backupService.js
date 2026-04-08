import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const backupService = {
  listar: () =>
    axios.get(`${API_URL}/backups`, { headers: getHeaders() })
      .then(r => r.data),

  crear: () =>
    axios.post(`${API_URL}/backups/crear`, {}, { headers: getHeaders() })
      .then(r => r.data),

  eliminar: (filename) =>
    axios.delete(`${API_URL}/backups/${filename}`, { headers: getHeaders() })
      .then(r => r.data),

  // Descarga directa via anchor — no necesita abrir nueva pestaña
  descargar: async (filename) => {
    const res = await axios.get(`${API_URL}/backups/descargar/${filename}`, {
      headers:      getHeaders(),
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a   = document.createElement("a");
    a.href     = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};