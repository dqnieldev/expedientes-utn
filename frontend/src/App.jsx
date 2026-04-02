import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import DashboardAlumno from "./pages/alumno/DashboardAlumno";

// Componente principal de la aplicación que define las rutas
function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/change-password" element={<ChangePassword />} /> 
        <Route path="/dashboard" element={<DashboardAlumno />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;