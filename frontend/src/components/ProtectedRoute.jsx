import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token             = localStorage.getItem("token");
  const user              = JSON.parse(localStorage.getItem("user") || "{}");
  const mustChange        = localStorage.getItem("mustChangePassword") === "true";

  if (!token)              return <Navigate to="/" replace />;
  if (mustChange)          return <Navigate to="/change-password" replace />;
  if (user.role !== "ALUMNO") return <Navigate to="/" replace />;

  return children;
}