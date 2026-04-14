import { Navigate } from "react-router-dom";

export default function ProtectedDeveloperRoute({ children }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token)               return <Navigate to="/" replace />;
  if (user.role !== "DEVELOPER") return <Navigate to="/" replace />;

  return children;
}