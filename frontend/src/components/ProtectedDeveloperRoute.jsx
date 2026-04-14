import { Navigate } from "react-router-dom";

export default function ProtectedDeveloperRoute({ children }) {
  const token      = localStorage.getItem("token");
  const user       = JSON.parse(localStorage.getItem("user") || "{}");
  const mustChange = localStorage.getItem("mustChangePassword") === "true";

  if (!token)                    return <Navigate to="/" replace />;
  if (mustChange)                return <Navigate to="/change-password" replace />;
  if (user.role !== "DEVELOPER") return <Navigate to="/" replace />;

  return children;
}