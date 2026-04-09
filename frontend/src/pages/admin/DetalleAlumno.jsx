// src/pages/admin/DetalleAlumno.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileText, Fingerprint, GraduationCap, FileBadge,
  CheckCircle, XCircle, Clock, Eye, Hash, BookOpen, User,
  MapPin, Phone, Calendar, Download, ChevronDown,
} from "lucide-react";

const DOCUMENTOS_BASE = [
  { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento",          icon: FileText      },
  { tipo: "CURP",            label: "CURP",                        icon: Fingerprint   },
  { tipo: "CERTIFICADO",     label: "Certificado de Bachillerato", icon: GraduationCap },
  { tipo: "CONSTANCIA",      label: "Constancia de Estudios",      icon: FileBadge     },
];

const estadoConfig = {
  APROBADO: {
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50",
    icon: <CheckCircle size={12} />,
  },
  RECHAZADO: {
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50",
    icon: <XCircle size={12} />,
  },
  EN_REVISION: {
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50",
    icon: <Clock size={12} />,
  },
  PENDIENTE: {
    badge: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600",
    icon: null,
  },
};

export default function DetalleAlumno() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");

  const [alumno,          setAlumno]          = useState(null);
  const [docs,            setDocs]            = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [updating,        setUpdating]        = useState(null);
  const [feedback,        setFeedback]        = useState(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [modalRechazo, setModalRechazo] = useState(null); // { docId } | null
  const [razonRechazo, setRazonRechazo] = useState("");
  const [enviandoRechazo, setEnviandoRechazo] = useState(false);

  const showFeedback = (tipo, msg) => {
    setFeedback({ tipo, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchData = async () => {
    try {
      const [resAlumno, resDocs] = await Promise.all([
        axios.get(`http://localhost:3000/api/alumnos/${id}`,    { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`http://localhost:3000/api/documentos/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setAlumno(resAlumno.data);
      setDocs(resDocs.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // ── Aprobar / Rechazar documento ──────────────────────────────────────────
  const handleEstado = async (docId, estado, razon = null) => {
  setUpdating(docId);
  try {
    await axios.put(
      `http://localhost:3000/api/documentos/${docId}`,
      { estado, razonRechazo: razon },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showFeedback("success",
      estado === "APROBADO"
        ? "Documento aprobado. Se notificó al alumno."
        : estado === "RECHAZADO"
        ? "Documento rechazado. Se notificó al alumno."
        : "Estado actualizado correctamente."
    );
    fetchData();
  } catch {
    showFeedback("error", "Error al actualizar el documento.");
  } finally {
    setUpdating(null);
  }
};

const handleConfirmarRechazo = async () => {
  setEnviandoRechazo(true);
  await handleEstado(modalRechazo.docId, "RECHAZADO", razonRechazo);
  setModalRechazo(null);
  setRazonRechazo("");
  setEnviandoRechazo(false);
};

  // ── Cambiar estado del alumno ─────────────────────────────────────────────
  const handleCambiarEstado = async (nuevoEstado) => {
    if (nuevoEstado === alumno.estado) return;
    if (!window.confirm(`¿Cambiar estado a "${nuevoEstado}"?\nSe notificará al alumno por correo.`)) return;

    setCambiandoEstado(true);
    try {
      await axios.patch(
        `http://localhost:3000/api/alumnos/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showFeedback("success", `Estado cambiado a ${nuevoEstado}. Se notificó al alumno por correo.`);
      fetchData();
    } catch (err) {
      showFeedback("error", err.response?.data?.message ?? "Error al cambiar el estado.");
    } finally {
      setCambiandoEstado(false);
    }
  };

  // ── Descargar reporte PDF ─────────────────────────────────────────────────
  const handleDescargarReporte = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/reportes/alumno/${id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `expediente-${alumno?.matricula || id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const initials = (nombre) =>
    nombre?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "";

  // ── Color del estado del alumno ───────────────────────────────────────────
  const estadoAlumnoColor = {
    ACTIVO:        "text-emerald-600 dark:text-emerald-400",
    BAJA:          "text-red-600 dark:text-red-400",
    BAJA_TEMPORAL: "text-amber-600 dark:text-amber-400",
  };

  return (
    <AdminLayout title="Detalle de Alumno">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin/alumnos")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Volver a Alumnos
        </button>

        {!loading && alumno && (
          <button
            onClick={handleDescargarReporte}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#243660] active:scale-95 transition-all duration-150"
          >
            <Download size={15} />
            Descargar Expediente PDF
          </button>
        )}
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl mb-5 border
          ${feedback.tipo === "success"
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400"
          }`}>
          {feedback.tipo === "success" ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {feedback.msg}
        </div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm animate-pulse space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 mx-auto" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          </div>
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm animate-pulse space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 items-start">

          {/* ── COLUMNA IZQUIERDA ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="h-16 rounded-t-2xl bg-gradient-to-r from-[#1a2744] to-[#243660]" />
              <div className="px-5 pb-5">

                {/* Avatar */}
                <div className="flex justify-center -mt-8 mb-4">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden bg-[#1a2744] flex items-center justify-center">
                    {alumno?.foto ? (
                      <img src={`http://localhost:3000/uploads/${alumno.foto}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-white text-lg font-semibold">{initials(alumno?.nombre)}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-base text-center leading-tight">
                  {alumno?.nombre}
                </h3>
                <p className="text-xs text-gray-400 text-center mt-0.5 mb-4">{alumno?.carrera}</p>

                <div className="border-t border-gray-100 dark:border-gray-700 mb-4" />

                {/* Info fields */}
                <div className="space-y-3">

                  {/* Matrícula */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Hash size={13} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Matrícula</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alumno?.matricula}</p>
                    </div>
                  </div>

                  {/* Cuatrimestre */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <BookOpen size={13} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Cuatrimestre</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alumno?.cuatrimestre_actual}</p>
                    </div>
                  </div>

                  {/* ── ESTADO (selector) ── */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <User size={13} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Estado</p>
                      <div className="relative flex items-center gap-1.5">
                        <select
                          value={alumno?.estado ?? "ACTIVO"}
                          onChange={e => handleCambiarEstado(e.target.value)}
                          disabled={cambiandoEstado}
                          className={`appearance-none text-sm font-medium pr-5 bg-transparent border-none focus:outline-none cursor-pointer disabled:opacity-60 transition-colors
                            ${estadoAlumnoColor[alumno?.estado] ?? "text-gray-800 dark:text-gray-200"}`}
                        >
                          <option value="ACTIVO">ACTIVO</option>
                          <option value="BAJA">BAJA</option>
                          <option value="BAJA_TEMPORAL">BAJA TEMPORAL</option>
                        </select>
                        <ChevronDown size={11} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        {cambiandoEstado && (
                          <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin ml-1" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registrado */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                      <Calendar size={13} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Registrado</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {alumno?.createdAt ? new Date(alumno.createdAt).toLocaleDateString("es-MX") : "—"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Teléfono / Ciudad */}
                {(alumno?.telefono || alumno?.ciudad) && (
                  <>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-4" />
                    <div className="space-y-3">
                      {alumno?.telefono && (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                            <Phone size={13} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Teléfono</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alumno.telefono}</p>
                          </div>
                        </div>
                      )}
                      {alumno?.ciudad && (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                            <MapPin size={13} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Ciudad</p>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alumno.ciudad}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Resumen expediente */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Resumen Expediente
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Aprobados",   color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400", count: docs.filter(d => d.estado === "APROBADO").length    },
                  { label: "En Revisión", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",         count: docs.filter(d => d.estado === "EN_REVISION").length  },
                  { label: "Rechazados",  color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",                 count: docs.filter(d => d.estado === "RECHAZADO").length    },
                  { label: "Pendientes",  color: "bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400",             count: DOCUMENTOS_BASE.length - docs.length                 },
                ].map(({ label, color, count }) => (
                  <div key={label} className={`rounded-xl px-3 py-2 ${color}`}>
                    <p className="text-[10px] font-medium opacity-70">{label}</p>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── COLUMNA DERECHA ───────────────────────────────────────────── */}
          <div className="md:col-span-2 flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Expediente Digital
              </h3>
              <span className="text-xs text-gray-400">
                {docs.length}/{DOCUMENTOS_BASE.length} documentos subidos
              </span>
            </div>

            {DOCUMENTOS_BASE.map(({ tipo, label, icon: Icon }) => {
              const doc    = docs.find(d => d.tipo === tipo);
              const estado = doc?.estado || "PENDIENTE";
              const cfg    = estadoConfig[estado];

              return (
                <div
                  key={tipo}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border-l-4"
                  style={{ borderLeftColor: estado === "APROBADO" ? "#1D9E75" : estado === "RECHAZADO" ? "#E24B4A" : estado === "EN_REVISION" ? "#EF9F27" : "#D1D5DB" }}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white text-sm">{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {doc ? "Documento subido" : "Sin documento"}
                          </p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}>
                        {cfg.icon}{estado.replace("_", " ")}
                      </span>
                    </div>

                    {doc ? (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        
                        <a
                          href={`http://localhost:3000/uploads/${doc.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <Eye size={13} /> Ver documento
                        </a>

                        {estado !== "APROBADO" && (
                          <button
                            onClick={() => handleEstado(doc.id, "APROBADO")}
                            disabled={updating === doc.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 active:scale-95 transition-all disabled:opacity-60"
                          >
                            {updating === doc.id
                              ? <span className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-500 rounded-full animate-spin" />
                              : <CheckCircle size={13} />
                            }
                            Aprobar
                          </button>
                        )}

                        {estado !== "RECHAZADO" && (
                          <button
                            onClick={() => setModalRechazo({ docId: doc.id })}
                            disabled={updating === doc.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all disabled:opacity-60"
                          >
                            {updating === doc.id
                              ? <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-500 rounded-full animate-spin" />
                              : <XCircle size={13} />
                            }
                            Rechazar
                          </button>
                        )}

                        {estado !== "EN_REVISION" && (
                          <button
                            onClick={() => handleEstado(doc.id, "EN_REVISION")}
                            disabled={updating === doc.id}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 active:scale-95 transition-all disabled:opacity-60"
                          >
                            <Clock size={13} />
                            En Revisión
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          El alumno aún no ha subido este documento.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL RECHAZO ─────────────────────────────────────────────────── */}
{modalRechazo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <XCircle size={18} className="text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">
              Rechazar documento
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              El alumno recibirá un correo con el motivo.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2 block">
          Motivo del rechazo <span className="text-gray-400 normal-case font-normal">(opcional)</span>
        </label>
        <textarea
          value={razonRechazo}
          onChange={e => setRazonRechazo(e.target.value)}
          placeholder="Ej: El documento está ilegible, falta la firma oficial..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400/30 resize-none"
        />
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={() => { setModalRechazo(null); setRazonRechazo(""); }}
          disabled={enviandoRechazo}
          className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirmarRechazo}
          disabled={enviandoRechazo}
          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {enviandoRechazo
            ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
            : <><XCircle size={14} />Confirmar rechazo</>
          }
        </button>
      </div>

    </div>
  </div>
)}
    </AdminLayout>
  );
}