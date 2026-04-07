import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  Search, FileCheck, FileX, Clock, Eye,
  Filter, CheckCircle, XCircle
} from "lucide-react";

const estadoConfig = {
  APROBADO: {
    badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50",
    icon: <CheckCircle size={11} />,
  },
  RECHAZADO: {
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700/50",
    icon: <XCircle size={11} />,
  },
  EN_REVISION: {
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50",
    icon: <Clock size={11} />,
  },
  PENDIENTE: {
    badge: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600",
    icon: null,
  },
};

const tipoLabel = {
  ACTA_NACIMIENTO: "Acta de Nacimiento",
  CURP:            "CURP",
  CERTIFICADO:     "Certificado de Bachillerato",
  CONSTANCIA:      "Constancia de Estudios",
};

export default function DocumentosAdmin() {
  const [docs, setDocs]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [updating, setUpdating] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchDocs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/documentos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  // Filtro combinado: búsqueda + estado
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      docs.filter(d => {
        const matchSearch =
          d.alumno?.nombre.toLowerCase().includes(q) ||
          d.alumno?.matricula.toLowerCase().includes(q) ||
          tipoLabel[d.tipo]?.toLowerCase().includes(q);
        const matchEstado = filtroEstado === "TODOS" || d.estado === filtroEstado;
        return matchSearch && matchEstado;
      })
    );
  }, [search, filtroEstado, docs]);

  const handleEstado = async (docId, estado) => {
    setUpdating(docId);
    try {
      await axios.put(
        `http://localhost:3000/api/documentos/${docId}`,
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback({ tipo: "success", msg: `Documento ${estado === "APROBADO" ? "aprobado" : "rechazado"} correctamente.` });
      setTimeout(() => setFeedback(null), 3000);
      fetchDocs();
    } catch (err) {
      setFeedback({ tipo: "error", msg: "Error al actualizar el documento." });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  const initials = (nombre) =>
    nombre?.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase() || "";

  const conteo = {
    TODOS:       docs.length,
    EN_REVISION: docs.filter(d => d.estado === "EN_REVISION").length,
    APROBADO:    docs.filter(d => d.estado === "APROBADO").length,
    RECHAZADO:   docs.filter(d => d.estado === "RECHAZADO").length,
  };

  const filtros = [
    { key: "TODOS",       label: "Todos",        color: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"                },
    { key: "EN_REVISION", label: "En Revisión",  color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"         },
    { key: "APROBADO",    label: "Aprobados",    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"  },
    { key: "RECHAZADO",   label: "Rechazados",   color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"                 },
  ];

  return (
    <AdminLayout title="Documentos">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Validación de Documentos</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Revisa y aprueba los expedientes de los alumnos.
        </p>
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

      {/* FILTROS RÁPIDOS */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter size={14} className="text-gray-400 shrink-0" />
        {filtros.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFiltroEstado(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${filtroEstado === key
                ? `${color} ring-2 ring-offset-1 ring-current`
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
              }`}
          >
            {label}
            <span className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-full text-[10px]">
              {conteo[key]}
            </span>
          </button>
        ))}
      </div>

      {/* BUSCADOR */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por alumno, matrícula o tipo de documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:text-white transition"
        />
      </div>

      {/* LISTA */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">

        {loading ? (
          <div className="p-5 space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
              <FileCheck size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              No hay documentos
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {search || filtroEstado !== "TODOS" ? "Intenta con otros filtros" : "No se han subido documentos aún"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map(doc => {
              const cfg = estadoConfig[doc.estado] || estadoConfig.PENDIENTE;
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">

                  {/* AVATAR ALUMNO */}
                  <div
                    className="w-10 h-10 rounded-xl bg-[#1a2744] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/admin/alumnos/${doc.alumno?.id}`)}
                    title="Ver expediente completo"
                  >
                    {doc.alumno?.foto ? (
                      <img src={`http://localhost:3000/uploads/${doc.alumno.foto}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-white text-xs font-semibold">{initials(doc.alumno?.nombre)}</span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                      {doc.alumno?.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-gray-400">{doc.alumno?.matricula}</span>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <span className="text-[11px] text-gray-400">{tipoLabel[doc.tipo] || doc.tipo}</span>
                    </div>
                  </div>

                  {/* ESTADO */}
                  <span className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium shrink-0 ${cfg.badge}`}>
                    {cfg.icon}{doc.estado.replace("_", " ")}
                  </span>

                  {/* ACCIONES */}
                  <div className="flex items-center gap-2 shrink-0">

                    <a
                      href={`http://localhost:3000/uploads/${doc.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <Eye size={12} /> Ver
                    </a>

                    {doc.estado !== "APROBADO" && (
                      <button
                        onClick={() => handleEstado(doc.id, "APROBADO")}
                        disabled={updating === doc.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-xs hover:bg-emerald-100 active:scale-95 transition-all disabled:opacity-60"
                      >
                        {updating === doc.id
                          ? <span className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-500 rounded-full animate-spin" />
                          : <CheckCircle size={12} />
                        }
                        Aprobar
                      </button>
                    )}

                    {doc.estado !== "RECHAZADO" && (
                      <button
                        onClick={() => handleEstado(doc.id, "RECHAZADO")}
                        disabled={updating === doc.id}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-400 text-xs hover:bg-red-100 active:scale-95 transition-all disabled:opacity-60"
                      >
                        {updating === doc.id
                          ? <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-500 rounded-full animate-spin" />
                          : <XCircle size={12} />
                        }
                        Rechazar
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </AdminLayout>
  );
}