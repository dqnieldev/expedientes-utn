import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DeveloperLayout from "../../layout/DeveloperLayout";
import { ShieldCheck, RefreshCw, AlertCircle, Search, Filter } from "lucide-react";

const ACCION_CONFIG = {
  LOGIN:                { label: "Login",              color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"        },
  LOGIN_FALLIDO:        { label: "Login fallido",      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"           },
  CREAR_ALUMNO:         { label: "Crear alumno",       color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  ELIMINAR_ALUMNO:      { label: "Eliminar alumno",    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"           },
  CAMBIAR_ESTADO_ALUMNO:{ label: "Cambiar estado",     color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"   },
  APROBAR_DOCUMENTO:    { label: "Aprobar documento",  color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  RECHAZAR_DOCUMENTO:   { label: "Rechazar documento", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"           },
  ACTUALIZAR_DOCUMENTO: { label: "Actualizar doc.",    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"   },
  CREAR_BACKUP:         { label: "Crear backup",       color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"       },
  CREAR_ADMIN: { label: "Crear admin", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" },
};

const formatFecha = (iso) =>
  new Date(iso).toLocaleString("es-MX", {
    year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export default function AuditLogs() {
  const [logs,    setLogs]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [accion,  setAccion]  = useState("");
  const token = localStorage.getItem("token");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 50 });
      if (accion) params.append("accion", accion);

      const res = await axios.get(`http://localhost:3000/api/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, accion]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <DeveloperLayout title="Auditoría">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Logs de Auditoría
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Registro de todas las acciones críticas del sistema.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-40"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter size={14} className="text-gray-400 shrink-0" />
        {[
          { key: "",                   label: "Todos"            },
          { key: "LOGIN",              label: "Logins"           },
          { key: "LOGIN_FALLIDO",      label: "Fallidos"         },
          { key: "APROBAR_DOCUMENTO",  label: "Aprobaciones"     },
          { key: "RECHAZAR_DOCUMENTO", label: "Rechazos"         },
          { key: "CAMBIAR_ESTADO_ALUMNO", label: "Cambios estado"},
          { key: "CREAR_ALUMNO",       label: "Alumnos creados"  },
          { key: "ELIMINAR_ALUMNO",    label: "Eliminaciones"    },
          { key: "CREAR_BACKUP",       label: "Backups"          },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setAccion(key); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${accion === key
                ? "bg-[#1a2744] text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TABLA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Sub-header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#1a2744] dark:text-blue-400" />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Eventos registrados
            </h3>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">
            {total} eventos
          </span>
        </div>

        {/* Cargando */}
        {loading && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Vacío */}
        {!loading && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <AlertCircle size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay eventos registrados</p>
          </div>
        )}

        {/* Lista */}
        {!loading && logs.length > 0 && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700 overflow-x-auto">
            {logs.map(log => {
              const cfg = ACCION_CONFIG[log.accion] ?? { label: log.accion, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors min-w-0">
                  {/* Acción */}
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {/* Detalle */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 flex-1 truncate" title={log.detalle}>
                    {log.detalle ?? "—"}
                  </p>
                  {/* IP */}
                  <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">
                    {log.ip ?? "—"}
                  </span>
                  {/* Fecha */}
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">
                    {formatFecha(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {!loading && pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-400">
              Página {page} de {pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

    </DeveloperLayout>
  );
}