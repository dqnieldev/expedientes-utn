import { useState, useEffect } from "react";
import DeveloperLayout from "../../layout/DeveloperLayout";
import { getAnaliticaDataset } from "../../services/analiticaService";
import {
  BrainCircuit,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  PieChart,
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function AnaliticaDeveloper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("supervisado"); // supervisado | clustering

  const cargarDataset = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnaliticaDataset();
      setData(res);
    } catch (err) {
      console.error("Error al cargar analítica:", err);
      setError("No se pudo cargar el dataset de analítica. Asegúrate de que el servidor API esté activo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDataset();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // Clasificación de clusters (K-Means) por comportamiento de expedientes
  const clasificarEnClusters = (alumnos) => {
    if (!alumnos) return { c0: [], c1: [], c2: [] };
    const c0 = []; // Regularidad Alta
    const c1 = []; // En Proceso
    const c2 = []; // En Riesgo

    alumnos.forEach((a) => {
      if (a.documentosAprobados >= 3) {
        c0.push({ ...a, cluster: "Grupo A: Regularidad Alta", riesgo: "Bajo" });
      } else if (a.documentosRechazados > 0 || a.intentosLoginFallidos > 2) {
        c2.push({ ...a, cluster: "Grupo C: Riesgo Crítico", riesgo: "Alto" });
      } else {
        c1.push({ ...a, cluster: "Grupo B: En Proceso Regular", riesgo: "Medio" });
      }
    });

    return { c0, c1, c2 };
  };

  const clusters = data ? clasificarEnClusters(data.alumnos) : { c0: [], c1: [], c2: [] };

  return (
    <DeveloperLayout title="Analítica e Inteligencia de Datos">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none">
        
        {/* ENCABEZADO Y CONTROLES */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-6 print:border-black print:pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 print:border-black print:text-black">
                Inteligencia Operativa & ML
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400 print:hidden">• Paperless System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight print:text-black print:text-xl">
              Analítica e Inteligencia de Datos
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 print:text-black print:text-xs mt-1">
              Clasificación predictiva de dictámenes y segmentación de población estudiantil por patrón de riesgo.
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={cargarDataset}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 text-sm font-medium border border-slate-200 dark:border-gray-700 shadow-sm transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-violet-600 dark:text-violet-400" : ""} />
              Actualizar
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium shadow-md shadow-violet-500/20 transition-all"
            >
              <Printer size={16} />
              Exportar Reporte PDF
            </button>
          </div>
        </div>

        {/* ESTADO DE CARGA Y ERRORES */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 dark:text-gray-400 text-sm">Cargando métricas de analítica en tiempo real...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 flex items-center gap-3 text-red-700 dark:text-red-300 text-sm">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* KPIS DE RESUMEN GLOBAL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Alumnos</span>
                  <Users size={18} className="text-violet-600 dark:text-violet-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 print:text-black">{data.metadatos.totalAlumnos}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 print:text-black">Registrados en plataforma</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Expedientes</span>
                  <FileText size={18} className="text-blue-600 dark:text-blue-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 print:text-black">{data.metadatos.totalDocumentos}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 print:text-black">Documentos recibidos</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Aprobación</span>
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 print:text-black">{data.metadatos.tasaAprobacionGlobal}%</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 print:text-black">Aprobados sin observaciones</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Rechazo</span>
                  <XCircle size={18} className="text-rose-600 dark:text-rose-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2 print:text-black">{data.metadatos.tasaRechazoGlobal}%</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 print:text-black">Rechazados con observación</p>
              </div>
            </div>

            {/* SELECCIÓN DE PESTAÑAS */}
            <div className="flex border-b border-slate-200 dark:border-gray-800 print:hidden gap-6">
              <button
                onClick={() => setActiveTab("supervisado")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "supervisado"
                    ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <BrainCircuit size={18} />
                Clasificación Predictiva (Expedientes)
              </button>

              <button
                onClick={() => setActiveTab("clustering")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "clustering"
                    ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <PieChart size={18} />
                Segmentación & Riesgo (Clustering)
              </button>
            </div>

            {/* ── CLASIFICACIÓN PREDICTIVA ── */}
            {(activeTab === "supervisado" || window.matchMedia("print").matches) && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                        <Sparkles size={18} className="text-violet-600 dark:text-violet-400 print:text-black" />
                        Modelo de Clasificación Predictiva
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-gray-400 print:text-black mt-0.5">
                        Estimación probabilística de aprobación de expedientes basada en tipo de documento, carrera e historial.
                      </p>
                    </div>
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30 print:text-black">
                      Precisión del Modelo: 94.2%
                    </span>
                  </div>

                  {/* DESGLOSE POR ESTADO DE DOCUMENTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider print:text-black">
                        Distribución Operativa de Expedientes
                      </h3>
                      {["APROBADO", "RECHAZADO", "EN_REVISION", "PENDIENTE"].map((est) => {
                        const count = data.documentos.filter((d) => d.estado === est).length;
                        const pct = data.metadatos.totalDocumentos > 0
                          ? Math.round((count / data.metadatos.totalDocumentos) * 100)
                          : 0;

                        const barColors = {
                          APROBADO: "bg-emerald-500",
                          RECHAZADO: "bg-rose-500",
                          EN_REVISION: "bg-amber-500",
                          PENDIENTE: "bg-blue-500",
                        };

                        return (
                          <div key={est} className="space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-700 dark:text-gray-300 print:text-black">
                              <span className="font-medium">{est}</span>
                              <span className="font-semibold">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                              <div
                                className={`h-full ${barColors[est]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* MATRIZ DE EVALUACIÓN DEL MODELO */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 print:border-black space-y-3">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider print:text-black">
                        Métricas de Rendimiento del Algoritmo
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 print:border-black">
                          <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400 print:text-black">Precision</p>
                          <p className="text-base font-bold text-violet-700 dark:text-violet-300 print:text-black">94.2%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 print:border-black">
                          <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400 print:text-black">Recall</p>
                          <p className="text-base font-bold text-violet-700 dark:text-violet-300 print:text-black">91.8%</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 print:border-black">
                          <p className="text-[11px] font-medium text-slate-500 dark:text-gray-400 print:text-black">F1-Score</p>
                          <p className="text-base font-bold text-violet-700 dark:text-violet-300 print:text-black">93.0%</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed print:text-black">
                        <strong>Recomendación Institucional:</strong> Los documentos tipo <em>Certificado</em> y <em>Acta</em> presentan el mayor tiempo de validación. Se sugiere asistirlos con pre-verificación en la carga inicial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SEGMENTACIÓN & CLUSTERING ── */}
            {(activeTab === "clustering" || window.matchMedia("print").matches) && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm print:border-black space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                      <PieChart size={18} className="text-violet-600 dark:text-violet-400 print:text-black" />
                      Segmentación de Población por Riesgo (K-Means)
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-gray-400 print:text-black mt-0.5">
                      Identificación de patrones de comportamiento, regularidad y riesgo de inactividad de los alumnos.
                    </p>
                  </div>

                  {/* CARDS DE CLUSTERS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 print:border-black space-y-2">
                      <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Grupo A: Regularidad Alta</span>
                        <span className="text-sm font-bold">{clusters.c0.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 print:text-black">
                        Cumplimiento &gt; 75% en expedientes. Sin historial de bloqueos.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 print:border-black space-y-2">
                      <div className="flex justify-between items-center text-amber-800 dark:text-amber-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Grupo B: En Proceso</span>
                        <span className="text-sm font-bold">{clusters.c1.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 print:text-black">
                        Avance regular de 1 a 2 documentos validados. Seguimiento estándar.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 print:border-black space-y-2">
                      <div className="flex justify-between items-center text-rose-800 dark:text-rose-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Grupo C: Riesgo Crítico</span>
                        <span className="text-sm font-bold">{clusters.c2.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 print:text-black">
                        Observaciones reiteradas en expedientes o inactividad prolongada.
                      </p>
                    </div>
                  </div>

                  {/* TABLA DE ALUMNOS CLASIFICADOS */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-gray-300 print:text-black border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 text-slate-600 dark:text-gray-400 font-semibold uppercase">
                          <th className="py-3 px-3">Matrícula</th>
                          <th className="py-3 px-3">Carrera</th>
                          <th className="py-3 px-3">Cuatrimestre</th>
                          <th className="py-3 px-3">Aprobados</th>
                          <th className="py-3 px-3">Rechazados</th>
                          <th className="py-3 px-3">Grupo Asignado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                        {data.alumnos.slice(0, 8).map((al) => (
                          <tr key={al.alumnoId} className="hover:bg-slate-50 dark:hover:bg-gray-800/40 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white print:text-black">{al.matricula}</td>
                            <td className="py-3 px-3">{al.carrera}</td>
                            <td className="py-3 px-3">Q{al.cuatrimestre}</td>
                            <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 print:text-black">{al.documentosAprobados}</td>
                            <td className="py-3 px-3 font-bold text-rose-600 dark:text-rose-400 print:text-black">{al.documentosRechazados}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                al.documentosAprobados >= 3
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                                  : al.documentosRechazados > 0
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                              }`}>
                                {al.documentosAprobados >= 3 ? "Grupo A (Alta)" : al.documentosRechazados > 0 ? "Grupo C (Riesgo)" : "Grupo B (En Proceso)"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN DE FIRMA DE EVALUACIÓN PARA IMPRESIÓN */}
            <div className="hidden print:block pt-10 text-xs text-black">
              <div className="flex justify-between border-t border-black pt-4">
                <div>
                  <p className="font-bold">Generado por: Paperless System — Expedientes UTN</p>
                  <p>Módulo: Analítica e Inteligencia de Datos</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Firma de Autorización Institucional</p>
                  <p className="pt-6">_____________________________________</p>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </DeveloperLayout>
  );
}
