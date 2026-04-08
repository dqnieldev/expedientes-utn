import axios from "axios";
import { logout } from "./authService";

axios.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      logout(); // token inválido o expirado → cierra sesión
    }
    return Promise.reject(err);
  }
);