import { Upload, FileCheck, FileX, Clock, Eye, RefreshCw } from "lucide-react";

export default function DocumentUploadCard({ item, doc, icon, onUpload }) {

  const getEstado = () => {
    if (!doc) return "PENDIENTE";
    return doc.estado;
  };

  const estado = getEstado();

  const estadoConfig = {
    APROBADO: {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/50",
      card:  "border-l-4 border-l-emerald-400",
      icon:  "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      indicator: <FileCheck size={14} />,
    },
    RECHAZADO: {
      badge: "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",
      card:  "border-l-4 border-l-red-400",
      icon:  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      indicator: <FileX size={14} />,
    },
    EN_REVISION: {
      badge: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50",
      card:  "border-l-4 border-l-amber-400",
      icon:  "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      indicator: <Clock size={14} />,
    },
    PENDIENTE: {
      badge: "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600",
      card:  "border-l-4 border-l-gray-300 dark:border-l-gray-600",
      icon:  "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400",
      indicator: null,
    },
  };

  const config = estadoConfig[estado];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${config.card}`}>
      <div className="p-5">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">

          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.icon}`}>
            {icon}
          </div>

          <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${config.badge}`}>
            {config.indicator}
            {estado.replace("_", " ")}
          </span>

        </div>

        {/* INFO */}
        <div className="mb-4">
          <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.label}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {doc ? "Documento cargado" : "Sin documento"}
          </p>
        </div>

        {/* ACTIONS */}
        {doc ? (
          <div className="flex gap-2">

            <a
              href={`http://localhost:3000/uploads/${doc.url}`}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 active:scale-95 transition-all duration-150"
            >
              <Eye size={13} />
              Ver
            </a>

            <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 active:scale-95 transition-all duration-150 cursor-pointer">
              <RefreshCw size={13} />
              Reemplazar
              <input type="file" hidden onChange={(e) => onUpload(e, item.tipo)} />
            </label>

          </div>
        ) : (
          <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#024E3F] text-white text-xs font-semibold hover:bg-[#013d31] active:scale-95 transition-all duration-150 cursor-pointer">
            <Upload size={13} />
            Subir Documento
            <input type="file" hidden onChange={(e) => onUpload(e, item.tipo)} />
          </label>
        )}

      </div>
    </div>
  );
}