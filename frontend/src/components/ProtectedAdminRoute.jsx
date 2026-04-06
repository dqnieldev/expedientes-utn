import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;

  return children;
}