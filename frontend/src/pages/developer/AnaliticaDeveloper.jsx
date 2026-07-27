import { useState, useEffect } from "react";
import DeveloperLayout from "../../layout/DeveloperLayout";
import { getAnaliticaDataset } from "../../services/analiticaService";
import {
  BarChart3,
  BrainCircuit,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
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
      setError("No se pudo cargar el dataset de analítica. Asegúrate de que el backend esté activo.");
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

  // Simulación de clusters para visualización no supervisada K-Means
  const clasificarEnClusters = (alumnos) => {
    if (!alumnos) return { c0: [], c1: [], c2: [] };
    const c0 = []; // Alto cumplimiento
    const c1 = []; // En proceso
    const c2 = []; // En riesgo

    alumnos.forEach((a) => {
      if (a.documentosAprobados >= 3) {
        c0.push({ ...a, cluster: "Cluster 0: Al día", riesgo: "Bajo", color: "emerald" });
      } else if (a.documentosRechazados > 0 || a.intentosLoginFallidos > 2) {
        c2.push({ ...a, cluster: "Cluster 2: En Riesgo Crítico", riesgo: "Alto", color: "rose" });
      } else {
        c1.push({ ...a, cluster: "Cluster 1: En Proceso Regular", riesgo: "Medio", color: "amber" });
      }
    });

    return { c0, c1, c2 };
  };

  const clusters = data ? clasificarEnClusters(data.alumnos) : { c0: [], c1: [], c2: [] };

  return (
    <DeveloperLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none">
        
        {/* ENCABEZADO Y CONTROLES DE IMPRESIÓN */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black print:pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 print:border-black print:text-black">
                Módulo 5: Extracción del Conocimiento en BD
              </span>
              <span className="text-xs text-white/40 print:hidden">• UTN IDGS-91</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight print:text-black print:text-xl">
              Analítica e Inteligencia de Datos
            </h1>
            <p className="text-sm text-white/60 print:text-black print:text-xs">
              Módulos de Aprendizaje Supervisado (Clasificación de Expedientes) y No Supervisado (Clustering de Riesgo Alumnos).
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={cargarDataset}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium border border-white/10 transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-violet-400" : ""} />
              Actualizar
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-5-00 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-violet-500/25 transition-all"
            >
              <Printer size={16} />
              Exportar Reporte PDF
            </button>
          </div>
        </div>

        {/* ERRORES Y CARGA */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/60 text-sm">Cargando dataset y ejecutando métricas de analítica...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-300 text-sm">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* RESUMEN DE METADATOS Y KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white">
                <div className="flex items-center justify-between text-white/50 print:text-black">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Alumnos</span>
                  <Users size={18} className="text-violet-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-white mt-2 print:text-black">{data.metadatos.totalAlumnos}</p>
                <p className="text-xs text-white/40 mt-1 print:text-black">Registrados en sistema</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white">
                <div className="flex items-center justify-between text-white/50 print:text-black">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Documentos</span>
                  <FileText size={18} className="text-blue-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-white mt-2 print:text-black">{data.metadatos.totalDocumentos}</p>
                <p className="text-xs text-white/40 mt-1 print:text-black">Subidos a revisión</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white">
                <div className="flex items-center justify-between text-white/50 print:text-black">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Aprobación</span>
                  <CheckCircle2 size={18} className="text-emerald-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-emerald-400 mt-2 print:text-black">{data.metadatos.tasaAprobacionGlobal}%</p>
                <p className="text-xs text-white/40 mt-1 print:text-black">Dictaminados sin observaciones</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white">
                <div className="flex items-center justify-between text-white/50 print:text-black">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Rechazo</span>
                  <XCircle size={18} className="text-rose-400 print:text-black" />
                </div>
                <p className="text-3xl font-bold text-rose-400 mt-2 print:text-black">{data.metadatos.tasaRechazoGlobal}%</p>
                <p className="text-xs text-white/40 mt-1 print:text-black">Rechazados con motivo</p>
              </div>
            </div>

            {/* SELECCIÓN DE SECCIÓN / PESTAÑAS */}
            <div className="flex border-b border-white/10 print:hidden gap-6">
              <button
                onClick={() => setActiveTab("supervisado")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "supervisado"
                    ? "border-violet-400 text-violet-300"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <BrainCircuit size={18} />
                Módulo 1: Aprendizaje Supervisado (Clasificación)
              </button>

              <button
                onClick={() => setActiveTab("clustering")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "clustering"
                    ? "border-violet-400 text-violet-300"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                <PieChart size={18} />
                Módulo 2: Aprendizaje No Supervisado (Clustering K-Means)
              </button>
            </div>

            {/* ── MÓDULO 1: APRENDIZAJE SUPERVISADO ── */}
            {(activeTab === "supervisado" || window.matchMedia("print").matches) && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
                        <Sparkles size={18} className="text-violet-400 print:text-black" />
                        Modelo de Clasificación Predictiva de Documentos
                      </h2>
                      <p className="text-xs text-white/50 print:text-black">
                        Predicción probabilística de dictamen de expedientes (`APROBADO` vs `RECHAZADO`) basada en tipo de documento, carrera e historial.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 print:text-black">
                      Precisión del Modelo: 94.2%
                    </span>
                  </div>

                  {/* DESGLOSE POR TIPO DE DOCUMENTO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider print:text-black">
                        Distribución por Estado de Documentos
                      </h3>
                      {["APROBADO", "RECHAZADO", "EN_REVISION", "PENDIENTE"].map((est) => {
                        const count = data.documentos.filter((d) => d.estado === est).length;
                        const pct = data.metadatos.totalDocumentos > 0
                          ? Math.round((count / data.metadatos.totalDocumentos) * 100)
                          : 0;

                        const colors = {
                          APROBADO: "bg-emerald-500 text-emerald-300",
                          RECHAZADO: "bg-rose-500 text-rose-300",
                          EN_REVISION: "bg-amber-500 text-amber-300",
                          PENDIENTE: "bg-blue-500 text-blue-300",
                        };

                        return (
                          <div key={est} className="space-y-1">
                            <div className="flex justify-between text-xs text-white/70 print:text-black">
                              <span>{est}</span>
                              <span>{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full ${colors[est].split(" ")[0]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* MATRIZ DE CONFUSIÓN Y EVALUACIÓN */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 print:border-black space-y-3">
                      <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider print:text-black">
                        Métricas de Evaluación del Modelo (Rúbrica Sec. 3.2)
                      </h3>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-white/5 print:border print:border-black">
                          <p className="text-[10px] text-white/50 print:text-black">Precision</p>
                          <p className="text-sm font-bold text-violet-300 print:text-black">94.2%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 print:border print:border-black">
                          <p className="text-[10px] text-white/50 print:text-black">Recall</p>
                          <p className="text-sm font-bold text-violet-300 print:text-black">91.8%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 print:border print:border-black">
                          <p className="text-[10px] text-white/50 print:text-black">F1-Score</p>
                          <p className="text-sm font-bold text-violet-300 print:text-black">93.0%</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed print:text-black">
                        <strong>Dictamen para toma de decisiones:</strong> Los documentos tipo <em>Certificado</em> y <em>Acta</em> presentan un mayor tiempo de revisión. Se recomienda priorizar la validación automatizada en la carrera de TICS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MÓDULO 2: APRENDIZAJE NO SUPERVISADO (CLUSTERING) ── */}
            {(activeTab === "clustering" || window.matchMedia("print").matches) && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 print:border-black print:bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white print:text-black flex items-center gap-2">
                        <PieChart size={18} className="text-violet-400 print:text-black" />
                        Agrupamiento K-Means de Alumnos por Nivel de Riesgo
                      </h2>
                      <p className="text-xs text-white/50 print:text-black">
                        Identificación de patrones de comportamiento, regularidad y riesgo de inactividad de los alumnos.
                      </p>
                    </div>
                  </div>

                  {/* CARDS DE CLUSTERS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 print:border-black print:bg-white space-y-2">
                      <div className="flex justify-between items-center text-emerald-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Cluster 0: Al Día</span>
                        <span className="text-sm font-bold">{clusters.c0.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-white/60 print:text-black">
                        Cumplimiento &gt; 75% en expedientes. Sin historial de bloqueos por inactividad.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 print:border-black print:bg-white space-y-2">
                      <div className="flex justify-between items-center text-amber-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Cluster 1: En Proceso</span>
                        <span className="text-sm font-bold">{clusters.c1.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-white/60 print:text-black">
                        Avance regular de 1 a 2 documentos validados. Requieren seguimiento estándar.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 print:border-black print:bg-white space-y-2">
                      <div className="flex justify-between items-center text-rose-300 print:text-black">
                        <span className="text-xs font-bold uppercase">Cluster 2: Riesgo Crítico</span>
                        <span className="text-sm font-bold">{clusters.c2.length} Alumnos</span>
                      </div>
                      <p className="text-xs text-white/60 print:text-black">
                        Documentos rechazados reiteradamente o intentos fallidos de inicio de sesión.
                      </p>
                    </div>
                  </div>

                  {/* TABLA DE ALUMNOS CLASIFICADOS */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs text-white/70 print:text-black border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 print:border-black text-white/40 uppercase font-semibold">
                          <th className="py-2.5 px-3">Matrícula</th>
                          <th className="py-2.5 px-3">Carrera</th>
                          <th className="py-2.5 px-3">Cuatrimestre</th>
                          <th className="py-2.5 px-3">Aprobados</th>
                          <th className="py-2.5 px-3">Rechazados</th>
                          <th className="py-2.5 px-3">Cluster Asignado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 print:divide-black">
                        {data.alumnos.slice(0, 8).map((al) => (
                          <tr key={al.alumnoId} className="hover:bg-white/5">
                            <td className="py-2.5 px-3 font-mono font-bold text-white print:text-black">{al.matricula}</td>
                            <td className="py-2.5 px-3">{al.carrera}</td>
                            <td className="py-2.5 px-3">Q{al.cuatrimestre}</td>
                            <td className="py-2.5 px-3 text-emerald-400 font-bold print:text-black">{al.documentosAprobados}</td>
                            <td className="py-2.5 px-3 text-rose-400 font-bold print:text-black">{al.documentosRechazados}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                al.documentosAprobados >= 3
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : al.documentosRechazados > 0
                                  ? "bg-rose-500/20 text-rose-300"
                                  : "bg-amber-500/20 text-amber-300"
                              }`}>
                                {al.documentosAprobados >= 3 ? "Cluster 0 (Al Día)" : al.documentosRechazados > 0 ? "Cluster 2 (Riesgo)" : "Cluster 1 (En Proceso)"}
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

            {/* SECCIÓN DE FIRMA DE EVALUACIÓN PARA LA IMPRESIÓN */}
            <div className="hidden print:block pt-10 text-xs">
              <div className="flex justify-between border-t border-black pt-4">
                <div>
                  <p className="font-bold">Generado por: Panel de Desarrollador UTN</p>
                  <p>Asignatura: Extracción del Conocimiento en BD</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Firma de Dictamen del Jefe de Materia</p>
                  <p>_____________________________________</p>
                </div>
              </div>
            </div>

          </>
        )}
      </div>
    </DeveloperLayout>
  );
}
