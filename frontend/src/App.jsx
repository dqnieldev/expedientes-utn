import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import DashboardAlumno from "./pages/alumno/DashboardAlumno";
import Documentos from "./pages/alumno/Documentos";
import Perfil from "./pages/alumno/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Admin pages
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Alumnos from "./pages/admin/Alumnos";
import DetalleAlumno from "./pages/admin/DetalleAlumno";
import DocumentosAdmin from "./pages/admin/Documentos";
import RespaldosAdmin from "./pages/admin/RespaldosAdmin";

// Páginas públicas: Login, Cambio de contraseña, Recuperar contraseña
import ResetPassword from "./pages/ResetPassword";
import RecuperarPassword from "./pages/RecuperarPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/recuperar" element={<RecuperarPassword />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/reset-password"     element={<ResetPassword />} />    

        {/* ALUMNO */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardAlumno /></ProtectedRoute>} />
        <Route path="/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><DashboardAdmin /></ProtectedAdminRoute>} />
        <Route path="/admin/alumnos" element={<ProtectedAdminRoute><Alumnos /></ProtectedAdminRoute>} />
        <Route path="/admin/alumnos/:id" element={<ProtectedAdminRoute><DetalleAlumno /></ProtectedAdminRoute>} />
        <Route path="/admin/documentos" element={<ProtectedAdminRoute><DocumentosAdmin /></ProtectedAdminRoute>} />
        <Route path="/admin/respaldos" element={<ProtectedAdminRoute><RespaldosAdmin /></ProtectedAdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;