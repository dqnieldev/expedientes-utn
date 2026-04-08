import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

export default function RecuperarPassword() {
  const [matricula, setMatricula]   = useState("");
  const [status,    setStatus]      = useState("idle"); // idle | loading | success | error
  const [message,   setMessage]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricula.trim()) return setMessage("Ingresa tu matrícula");

    setStatus("loading");
    setMessage("");

    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { matricula });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Error al enviar el correo");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f8faf6]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">

        <Link to="/" className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-6 transition-colors">
          <ArrowLeft size={13} /> Volver al login
        </Link>

        {status === "success" ? (
          // ── Estado: correo enviado ──
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Mail size={22} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Revisa tu correo</h2>
            <p className="text-sm text-gray-500">
              Te enviamos un enlace para restablecer tu contraseña. Expira en <strong>1 hora</strong>.
            </p>
          </div>
        ) : (
          // ── Estado: formulario ──
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Recuperar contraseña</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ingresa tu matrícula y te enviaremos un enlace a tu correo registrado.
            </p>

            {message && (
              <p className="text-sm text-red-600 mb-4 bg-red-50 px-3 py-2 rounded-lg">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#1a2744] hover:bg-[#243660] text-white py-3 rounded-md text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}