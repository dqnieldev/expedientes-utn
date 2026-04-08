import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword)
    return setMessage("Las contraseñas no coinciden");

  if (form.password.length < 6)
    return setMessage("Mínimo 6 caracteres");

  try {
    const token = localStorage.getItem("token");
    const matricula = localStorage.getItem("tempPass"); // ← su contraseña actual

    await axios.put(
      "http://localhost:3000/api/auth/change-password",
      {
        currentPassword: matricula,  // ← esto faltaba
        newPassword: form.password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    localStorage.removeItem("tempPass"); // Limpiamos la contraseña temporal
    localStorage.setItem("mustChangePassword", "false");
    setMessage("Contraseña actualizada correctamente");
    setTimeout(() => { window.location.href = "/dashboard"; }, 1500);

  } catch (error) {
    setMessage(error.response?.data?.message || "Error al actualizar contraseña");
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8faf6]">

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <h2 className="text-xl font-semibold text-primary text-center mb-4">
          Cambiar contraseña
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          Por seguridad, debes actualizar tu contraseña inicial
        </p>

        {message && (
          <div className="text-center text-sm mb-3 text-red-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-primary"
          />

          <button className="w-full bg-primary text-white py-3 rounded-md">
            Guardar contraseña
          </button>

        </form>

      </div>
    </div>
  );
}