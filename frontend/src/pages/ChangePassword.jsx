import { useState } from "react";
import axios from "axios";

// Página para que el usuario cambie su contraseña en caso de que sea necesario
export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Función para manejar el envío del formulario de cambio de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:3000/api/auth/change-password", // endpoint para cambiar contraseña
        { newPassword: password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // limpiar flag
      localStorage.setItem("mustChangePassword", "false");

      setMessage("Contraseña actualizada");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);

    } catch (error) {
      setMessage("Error al cambiar contraseña");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8faf6]">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h2 className="text-xl font-semibold text-primary text-center mb-4">
          Cambiar Contraseña
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Debes actualizar tu contraseña para continuar
        </p>

        {message && (
          <div className="text-center text-sm mb-3 text-green-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Nueva contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-primary"
          />

          <button
            className="w-full bg-primary text-white py-3 rounded-md"
          >
            Actualizar
          </button>

        </form>

      </div>
    </div>
  );
}