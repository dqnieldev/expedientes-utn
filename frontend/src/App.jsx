import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import DashboardAlumno from "./pages/alumno/DashboardAlumno";
import Documentos from "./pages/alumno/Documentos";
import Perfil from "./pages/alumno/Perfil";
import ProtectedRoute from "./components/ProtectedRoute";
import RecuperarPassword from "./pages/RecuperarPassword";

// Componente principal de la aplicación que define las rutas
function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/change-password" element={<ChangePassword />} /> 
        <Route path="/dashboard" element={ <ProtectedRoute><DashboardAlumno /></ProtectedRoute> } />
        <Route path="/documentos" element={ <ProtectedRoute><Documentos /></ProtectedRoute> } />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/recuperar" element={<RecuperarPassword/>  }/>
        
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;