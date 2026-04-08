import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token");

  const [form,    setForm]    = useState({ password: "", confirm: "" });
  const [status,  setStatus]  = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm)
      return setMessage("Las contraseñas no coinciden");

    if (form.password.length < 6)
      return setMessage("Mínimo 6 caracteres");

    setStatus("loading");

    try {
      await axios.post("http://localhost:3000/api/auth/reset-password", {
        token,
        newPassword: form.password,
      });
      setStatus("success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "El enlace es inválido o expiró");
    }
  };

  if (!token) return (
    <div className="h-screen flex items-center justify-center bg-[#f8faf6]">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <p className="text-red-600 text-sm">Enlace inválido.</p>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8faf6]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        {status === "success" ? (
          <div className="text-center">
            <p className="text-emerald-600 font-semibold text-sm">
              ✓ Contraseña actualizada. Redirigiendo...
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Nueva contraseña</h2>
            <p className="text-sm text-gray-500 mb-6">Elige una contraseña segura.</p>

            {message && (
              <p className="text-sm text-red-600 mb-4 bg-red-50 px-3 py-2 rounded-lg">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full p-3 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#1a2744] hover:bg-[#243660] text-white py-3 rounded-md text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}