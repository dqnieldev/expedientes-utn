import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DeveloperLayout from "../../layout/DeveloperLayout";
import {
  UserPlus, RefreshCw, CheckCircle2, AlertCircle,
  Mail, Lock, Eye, EyeOff, Users, ShieldCheck, Trash2,
} from "lucide-react";

const API = "http://localhost:3000";

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  const ok = type === "success";
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm mb-5
      ${ok
        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400"
        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400"
      }`}>
      {ok ? <CheckCircle2 size={15} className="shrink-0" /> : <AlertCircle size={15} className="shrink-0" />}
      <span>{msg}</span>
    </div>
  );
}

export default function GestionAdmins() {
  const [admins,   setAdmins]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(null);   // id del admin que se está eliminando
  const [showPass, setShowPass] = useState(false);
  const [toast,    setToast]    = useState({ msg: "", type: "success" });
  const [form,     setForm]     = useState({ email: "", password: "" });

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const notify     = (msg, type = "success") => setToast({ msg, type });
  const clearToast = useCallback(() => setToast({ msg: "", type: "success" }), []);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/user/admins`, { headers });
      setAdmins(res.data);
    } catch {
      notify("No se pudo cargar la lista de administradores.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleSubmit = async () => {
    if (!form.email || !form.password)
      return notify("Completa todos los campos.", "error");
    if (form.password.length < 8)
      return notify("La contraseña debe tener al menos 8 caracteres.", "error");

    setSaving(true);
    try {
      await axios.post(`${API}/api/user/admins`, form, { headers });
      notify("Administrador creado correctamente.");
      setForm({ email: "", password: "" });
      await fetchAdmins();
    } catch (err) {
      notify(err.response?.data?.message ?? "Error al crear el administrador.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (admin) => {
    if (!window.confirm(`¿Eliminar al administrador "${admin.email}"?\nEsta acción no se puede deshacer.`))
      return;
    setDeleting(admin.id);
    try {
      await axios.delete(`${API}/api/user/admins/${admin.id}`, { headers });
      notify("Administrador eliminado correctamente.");
      setAdmins(prev => prev.filter(a => a.id !== admin.id));
    } catch (err) {
      notify(err.response?.data?.message ?? "Error al eliminar el administrador.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const formatFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });

  return (
    <DeveloperLayout title="Administradores">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Administradores
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Crea y elimina cuentas de acceso para el panel escolar.
          </p>
        </div>
        <button
          onClick={fetchAdmins}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all disabled:opacity-40"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />

      {/* ── FORMULARIO CREAR ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-5">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <UserPlus size={15} className="text-violet-600 dark:text-violet-400" />
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Nuevo administrador
          </h3>
        </div>

        <div className="px-5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@utn.edu.mx"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
              Contraseña temporal
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Mín. 8 caracteres"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            El administrador deberá cambiar su contraseña en el primer inicio de sesión.
          </p>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1b4b] hover:bg-[#2d2a6e] text-white rounded-xl text-sm font-semibold active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving
              ? <><RefreshCw size={14} className="animate-spin" />Creando...</>
              : <><UserPlus size={14} />Crear administrador</>
            }
          </button>
        </div>
      </div>

      {/* ── LISTA DE ADMINS ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-violet-600 dark:text-violet-400" />
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Administradores existentes
            </h3>
          </div>
          {!loading && (
            <span className="text-xs bg-slate-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">
              {admins.length} {admins.length === 1 ? "cuenta" : "cuentas"}
            </span>
          )}
        </div>

        {loading && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-2.5 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && admins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <Users size={36} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay administradores creados</p>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {admins.map(admin => {
              const isDeleting = deleting === admin.id;
              return (
                <li key={admin.id} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-gray-700/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} className="text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{admin.email}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Creado el {formatFecha(admin.createdAt)}
                      {admin.mustChangePassword && (
                        <span className="ml-2 text-amber-500 dark:text-amber-400">· Pendiente cambio de contraseña</span>
                      )}
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shrink-0">
                    ADMIN
                  </span>
                  <button
                    onClick={() => handleEliminar(admin)}
                    disabled={isDeleting}
                    title="Eliminar administrador"
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 shrink-0"
                  >
                    {isDeleting
                      ? <RefreshCw size={13} className="animate-spin" />
                      : <Trash2 size={13} />
                    }
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </DeveloperLayout>
  );
}