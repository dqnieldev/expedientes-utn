import { useState } from "react";
import { Upload, FileCheck, FileX, Clock, Eye, RefreshCw, AlertCircle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// ── Configuración de validación ───────────────────────────────────────────────
const FORMATOS_PERMITIDOS = ["application/pdf", "application/x-pdf"];
const TAMANO_MAX_MB = 5;
const TAMANO_MAX_BYTES = TAMANO_MAX_MB * 1024 * 1024;

export default function DocumentUploadCard({ item, doc, icon, onUpload }) {
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation();

  const getEstado = () => (!doc ? "PENDIENTE" : doc.estado);
  const estado = getEstado();

  const estadoConfig = {
    APROBADO: {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/50",
      card: "border-l-4 border-l-emerald-400",
      icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      indicator: <FileCheck size={14} />,
    },
    RECHAZADO: {
      badge: "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",
      card: "border-l-4 border-l-red-400",
      icon: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      indicator: <FileX size={14} />,
    },
    EN_REVISION: {
      badge: "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50",
      card: "border-l-4 border-l-amber-400",
      icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      indicator: <Clock size={14} />,
    },
    PENDIENTE: {
      badge: "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600",
      card: "border-l-4 border-l-gray-300 dark:border-l-gray-600",
      icon: "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-400",
      indicator: null,
    },
  };

  const config = estadoConfig[estado];

  const handleFileChange = (e, tipo) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!FORMATOS_PERMITIDOS.includes(file.type)) {
      setErrorMsg(t("errors.invalidFormat", { format: "PDF" }));
      e.target.value = "";
      return;
    }

    if (file.size > TAMANO_MAX_BYTES) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setErrorMsg(t("errors.maxSize", { size: sizeMB, max: TAMANO_MAX_MB }));
      e.target.value = "";
      return;
    }

    setErrorMsg("");
    onUpload(e, tipo);
  };

  return (
    <div className="flex flex-col gap-2">

      {/* ERROR */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
          <AlertCircle size={14} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400 flex-1 leading-relaxed">{errorMsg}</p>
          <button
            onClick={() => setErrorMsg("")}
            className="text-red-400 hover:text-red-600 transition-colors shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${config.card}`}>
        <div className="p-5">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${config.icon}`}>
              {icon}
            </div>
            <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${config.badge}`}>
              {config.indicator}
              {t(`status.${estado}`)}
            </span>
          </div>

          {/* INFO */}
          <div className="mb-4">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {doc ? t("documents.docUploaded") : t("documents.noDoc")}
            </p>
            <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">
              PDF · {t("documents.maxSize", { size: TAMANO_MAX_MB })}
            </p>
          </div>

          {/* ACTIONS */}
          {doc ? (
            <div className="flex gap-2">
              <a
                href={`http://localhost:3000/uploads/${doc.url}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150"
              >
                <Eye size={13} />
                {t("documents.view")}
              </a>

              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all duration-150 cursor-pointer">
                <RefreshCw size={13} />
                {t("documents.replace")}
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => handleFileChange(e, item.tipo)}
                />
              </label>
            </div>
          ) : (
            <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#024E3F] text-white text-xs font-semibold hover:bg-[#013d31] active:scale-95 transition-all duration-150 cursor-pointer">
              <Upload size={13} />
              {t("documents.upload")}
              <input
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => handleFileChange(e, item.tipo)}
              />
            </label>
          )}

        </div>
      </div>

    </div>
  );
}