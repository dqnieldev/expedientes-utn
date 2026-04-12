import { useNavigate } from "react-router-dom";
import { FileX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin   = user?.role === "ADMIN";
  const homeRoute = isAdmin ? "/admin/dashboard" : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">

        {/* Icono */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
            <FileX size={40} className="text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        {/* Número */}
        <h1 className="text-8xl font-bold text-gray-200 dark:text-gray-700 leading-none mb-2">
          404
        </h1>

        {/* Mensaje */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Página no encontrada
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          La ruta que buscas no existe o no tienes permiso para acceder a ella.
        </p>

        {/* Botones */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-white dark:hover:bg-gray-800 transition-all active:scale-95"
          >
            <ArrowLeft size={15} />
            Volver
          </button>

          <button
            onClick={() => navigate(homeRoute)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a2744] hover:bg-[#243660] text-white text-sm font-semibold transition-all active:scale-95"
          >
            <Home size={15} />
            Ir al inicio
          </button>
        </div>

        {/* Logo UTN */}
        <p className="text-[11px] text-gray-300 dark:text-gray-700 mt-10">
          Paperless System — Universidad Tecnológica de Nayarit
        </p>

      </div>
    </div>
  );
}