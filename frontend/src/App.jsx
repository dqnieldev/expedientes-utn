import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

// Componente principal de la aplicación que define las rutas
function App() {
  return (
    <BrowserRouter> // Envolvemos la aplicación en BrowserRouter para habilitar el enrutamiento
      <Routes>
        <Route path="/" element={<Login />} /> // Ruta para la página de login
        <Route path="/change-password" element={<ChangePassword />} /> // Ruta para la página de cambio de contraseña
      </Routes>
    </BrowserRouter>
  );
}

export default App;