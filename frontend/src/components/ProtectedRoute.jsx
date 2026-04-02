import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) { // Verificar si el usuario tiene un token de autenticación
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}