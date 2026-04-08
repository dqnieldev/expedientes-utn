import { Clock, LogOut, RefreshCw } from "lucide-react";

export default function SessionWarningModal({ countdown, onExtend, onLogout }) {
  const minutes = Math.floor(countdown / 60);
  const seconds = String(countdown % 60).padStart(2, "0");
  const isUrgent = countdown <= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header */}
        <div className={`px-6 pt-6 pb-4 flex flex-col items-center text-center`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors
            ${isUrgent
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-amber-100 dark:bg-amber-900/30"
            }`}>
            <Clock size={26} className={isUrgent
              ? "text-red-500 dark:text-red-400"
              : "text-amber-500 dark:text-amber-400"
            } />
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            ¿Sigues ahí?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu sesión cerrará por inactividad en
          </p>

          {/* Countdown */}
          <div className={`mt-4 text-5xl font-bold tabular-nums tracking-tight transition-colors
            ${isUrgent
              ? "text-red-500 dark:text-red-400"
              : "text-amber-500 dark:text-amber-400"
            }`}>
            {minutes}:{seconds}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-100 dark:border-gray-700" />

        {/* Acciones */}
        <div className="px-6 py-5 flex flex-col gap-2">
          <button
            onClick={onExtend}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a2744] hover:bg-[#243660] text-white rounded-xl text-sm font-semibold active:scale-95 transition-all"
          >
            <RefreshCw size={15} />
            Continuar sesión
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold active:scale-95 transition-all"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>

      </div>
    </div>
  );
}