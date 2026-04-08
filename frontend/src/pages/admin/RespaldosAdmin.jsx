import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { backupService } from "../../services/backupService";
import {
  DatabaseBackup,
  Plus,
  Download,
  Trash2,
  RefreshCw,
  HardDrive,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatFecha = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-MX", {
    year:   "numeric",
    month:  "short",
    day:    "2-digit",
    hour:   "2-digit",
    minute: "2-digit",
  });
};

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm mb-5 transition-all
        ${isSuccess
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400"
        }`}
    >
      {isSuccess
        ? <CheckCircle2 size={15} className="shrink-0" />
        : <AlertCircle  size={15} className="shrink-0" />
      }
      <span>{msg}</span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-56 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-2.5 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded hidden sm:block" />
      <div className="flex gap-2">
        <div className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-8 w-8  bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function RespaldosAdmin() {
  const [backups,    setBackups]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [creating,   setCreating]   = useState(false);
  const [deletingFn, setDeletingFn] = useState(null);   // filename en proceso
  const [downloading, setDownloading] = useState(null); // filename en proceso
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const notify     = (msg, type = "success") => setToast({ msg, type });
  const clearToast = useCallback(() => setToast({ msg: "", type: "success" }), []);

  // ── Listar ────────────────────────────────────────────────────────────────
  const fetchBackups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await backupService.listar();
      setBackups(Array.isArray(data) ? data : []);
    } catch {
      notify("No se pudo cargar la lista de respaldos.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBackups(); }, [fetchBackups]);

  // ── Crear ─────────────────────────────────────────────────────────────────
  const handleCrear = async () => {
    setCreating(true);
    try {
      const res = await backupService.crear();
      notify(`Respaldo creado: ${res.backup?.filename ?? "OK"}`);
      await fetchBackups();
    } catch (err) {
      notify(err.response?.data?.message ?? "Error al crear el respaldo.", "error");
    } finally {
      setCreating(false);
    }
  };

  // ── Descargar ─────────────────────────────────────────────────────────────
  const handleDescargar = async (filename) => {
    setDownloading(filename);
    try {
      await backupService.descargar(filename);
    } catch {
      notify("Error al descargar el respaldo.", "error");
    } finally {
      setDownloading(null);
    }
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleEliminar = async (filename) => {
    if (!window.confirm(`¿Eliminar el respaldo "${filename}"?\nEsta acción no se puede deshacer.`))
      return;

    setDeletingFn(filename);
    try {
      await backupService.eliminar(filename);
      notify("Respaldo eliminado correctamente.");
      setBackups(prev => prev.filter(b => b.filename !== filename));
    } catch (err) {
      notify(err.response?.data?.message ?? "Error al eliminar.", "error");
    } finally {
      setDeletingFn(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Respaldos">

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Respaldos del Sistema
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Genera, descarga y elimina respaldos de la base de datos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Refrescar */}
          <button
            onClick={fetchBackups}
            disabled={loading}
            title="Actualizar lista"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-40"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          {/* Crear */}
          <button
            onClick={handleCrear}
            disabled={creating || loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] hover:bg-[#243660] text-white rounded-xl text-sm font-semibold active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {creating
              ? <><RefreshCw size={14} className="animate-spin" />Creando...</>
              : <><Plus      size={14} />Crear respaldo</>
            }
          </button>
        </div>
      </div>

      {/* TOAST */}
      <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />

      {/* TARJETA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Sub-header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Respaldos disponibles
          </h3>
          {!loading && (
            <span className="text-xs bg-slate-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">
              {backups.length} {backups.length === 1 ? "archivo" : "archivos"}
            </span>
          )}
        </div>

        {/* Estado: cargando */}
        {loading && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[1, 2, 3].map(i => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Estado: vacío */}
        {!loading && backups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
            <HardDrive size={42} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay respaldos disponibles</p>
            <p className="text-xs mt-1">
              Presiona "Crear respaldo" para generar el primero
            </p>
          </div>
        )}

        {/* Lista */}
        {!loading && backups.length > 0 && (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {backups.map((backup) => {
              const isDeleting    = deletingFn   === backup.filename;
              const isDownloading = downloading  === backup.filename;

              return (
                <li
                  key={backup.filename}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors"
                >
                  {/* Icono archivo */}
                  <div className="w-9 h-9 rounded-xl bg-[#1a2744]/10 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <DatabaseBackup size={16} className="text-[#1a2744] dark:text-blue-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-800 dark:text-white truncate"
                      title={backup.filename}
                    >
                      {backup.filename}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                      <Clock size={11} />
                      {formatFecha(backup.createdAt)}
                    </div>
                  </div>

                  {/* Tamaño */}
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 shrink-0 hidden sm:block">
                    {backup.size}
                  </span>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 shrink-0">

                    {/* Descargar */}
                    <button
                      onClick={() => handleDescargar(backup.filename)}
                      disabled={isDownloading}
                      title="Descargar respaldo"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors disabled:opacity-50"
                    >
                      {isDownloading
                        ? <RefreshCw size={13} className="animate-spin" />
                        : <Download  size={13} />
                      }
                      {isDownloading ? "Descargando..." : "Descargar"}
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleEliminar(backup.filename)}
                      disabled={isDeleting}
                      title="Eliminar respaldo"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                    >
                      {isDeleting
                        ? <RefreshCw size={13} className="animate-spin" />
                        : <Trash2    size={13} />
                      }
                    </button>

                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </AdminLayout>
  );
}