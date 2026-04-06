import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Users, ChevronRight,
  GraduationCap, Hash
} from "lucide-react";

export default function Alumnos() {
  const [alumnos, setAlumnos]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ nombre: "", matricula: "", carrera: "", cuatrimestre_actual: "", email: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving]       = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const carreras = [
    "Ingeniería en Desarrollo y Gestión de Software",
    "Ingeniería en Tecnologías de la Información",
    "Ingeniería en Mantenimiento Industrial",
    "Ingeniería en Procesos Alimentarios",
    "Ingeniería en Biotecnología",
    "Administración de Empresas",
    "Contaduría",
    "Turismo Alternativo",
  ];

  const fetchAlumnos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/alumnos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlumnos(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlumnos(); }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      alumnos.filter(a =>
        a.nombre.toLowerCase().includes(q) ||
        a.matricula.toLowerCase().includes(q) ||
        a.carrera.toLowerCase().includes(q)
      )
    );
  }, [search, alumnos]);

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleCreate = async () => {
    const { nombre, matricula, carrera, cuatrimestre_actual, email } = form;
    if (!nombre || !matricula || !carrera || !cuatrimestre_actual || !email) {
      return setFormError("Todos los campos son obligatorios.");
    }

    setSaving(true);
    try {
      await axios.post(
        "http://localhost:3000/api/alumnos",
        { ...form, cuatrimestre_actual: Number(cuatrimestre_actual) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      setForm({ nombre: "", matricula: "", carrera: "", cuatrimestre_actual: "", email: "" });
      fetchAlumnos();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error al registrar alumno.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (nombre) =>
    nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

  return (
    <AdminLayout title="Alumnos">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alumnos</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Cargando..." : `${alumnos.length} alumnos registrados`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#243660] active:scale-95 transition-all duration-150"
        >
          <Plus size={16} />
          Nuevo Alumno
        </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, matrícula o carrera..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:text-white transition"
        />
      </div>

      {/* LISTA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <Users size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {search ? "No se encontraron resultados" : "No hay alumnos registrados"}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {search ? "Intenta con otro término de búsqueda" : "Registra el primer alumno con el botón de arriba"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(alumno => (
              <div
                key={alumno.id}
                onClick={() => navigate(`/admin/alumnos/${alumno.id}`)}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
              >
                {/* AVATAR */}
                <div className="w-11 h-11 rounded-xl bg-[#1a2744] flex items-center justify-center shrink-0 overflow-hidden">
                  {alumno.foto ? (
                    <img
                      src={`http://localhost:3000/uploads/${alumno.foto}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">{initials(alumno.nombre)}</span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {alumno.nombre}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Hash size={10} /> {alumno.matricula}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
                      <GraduationCap size={10} /> {alumno.carrera}
                    </span>
                  </div>
                </div>

                {/* ESTADO */}
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0
                  ${alumno.estado === "ACTIVO"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}>
                  {alumno.estado}
                </span>

                <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 shrink-0 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL NUEVO ALUMNO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Plus size={15} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Registrar Nuevo Alumno
                </h3>
              </div>
              <button
                onClick={() => { setShowModal(false); setFormError(""); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="px-6 py-4 space-y-3">

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-xs px-3 py-2.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {formError}
                </div>
              )}

              {[
                { label: "Nombre completo",  name: "nombre",              placeholder: "Nombre Apellido Apellido", type: "text"   },
                { label: "Matrícula",        name: "matricula",           placeholder: "UTN001",                  type: "text"   },
                { label: "Correo electrónico",name: "email",             placeholder: "alumno@utnayarit.edu.mx", type: "email"  },
                { label: "Cuatrimestre",     name: "cuatrimestre_actual", placeholder: "1",                       type: "number" },
              ].map(({ label, name, placeholder, type }) => (
                <div key={name}>
                  <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
                    {label} <span className="text-red-400">*</span>
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    placeholder={placeholder}
                    min={type === "number" ? 1 : undefined}
                    max={type === "number" ? 11 : undefined}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                  />
                </div>
              ))}

              {/* CARRERA SELECT */}
              <div>
                <label className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide block mb-1">
                  Carrera <span className="text-red-400">*</span>
                </label>
                <select
                  name="carrera"
                  value={form.carrera}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                >
                  <option value="">Seleccionar carrera</option>
                  {carreras.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <p className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2">
                La contraseña inicial será la matrícula del alumno. Se le pedirá cambiarla en su primer inicio de sesión.
              </p>

            </div>

            {/* MODAL FOOTER */}
            <div className="flex gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => { setShowModal(false); setFormError(""); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-[#1a2744] text-white text-sm font-semibold hover:bg-[#243660] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus size={14} />
                    Registrar
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminLayout>
  );
}