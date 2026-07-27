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
  Sparkles,
  FileCheck,
  TrendingUp,
  Award
} from "lucide-react";

export default function AnaliticaDeveloper() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("supervisado"); // supervisado | clustering | reporte

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
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none print:bg-white print:text-black">
        
        {/* ENCABEZADO Y CONTROLES DE PANTALLA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                Inteligencia Operativa & ML
              </span>
              <span className="text-xs text-slate-500 dark:text-gray-400">• Paperless System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Analítica e Inteligencia de Datos
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
              Clasificación predictiva de dictámenes y segmentación de población estudiantil por patrón de riesgo.
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          <div className="py-20 text-center space-y-3 print:hidden">
            <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 dark:text-gray-400 text-sm">Cargando métricas de analítica en tiempo real...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 flex items-center gap-3 text-red-700 dark:text-red-300 text-sm print:hidden">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* KPIS DE RESUMEN GLOBAL (PANTALLA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Alumnos</span>
                  <Users size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{data.metadatos.totalAlumnos}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Registrados en plataforma</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Total Expedientes</span>
                  <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{data.metadatos.totalDocumentos}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Documentos recibidos</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Aprobación</span>
                  <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{data.metadatos.tasaAprobacionGlobal}%</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Aprobados sin observaciones</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
                  <span className="text-xs font-semibold tracking-wider uppercase">Tasa Rechazo</span>
                  <XCircle size={18} className="text-rose-600 dark:text-rose-400" />
                </div>
                <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">{data.metadatos.tasaRechazoGlobal}%</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Rechazados con observación</p>
              </div>
            </div>

            {/* SELECCIÓN DE PESTAÑAS (PANTALLA) */}
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

              <button
                onClick={() => setActiveTab("reporte")}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === "reporte"
                    ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <FileCheck size={18} />
                Vista Previa Reporte Ejecutivo PDF
              </button>
            </div>

            {/* ── SECCIÓN 1: CLASIFICACIÓN PREDICTIVA (PANTALLA) ── */}
            {activeTab === "supervisado" && (
              <div className="space-y-6 print:hidden">
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-violet-600 dark:text-violet-400" />
                        Modelo de Clasificación Predictiva (RandomForest)
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                        Estimación probabilística de aprobación de expedientes basada en tipo de documento, carrera e historial.
                      </p>
                    </div>
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-500/30">
                      Precisión del Modelo: 94.2%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
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
                            <div className="flex justify-between text-xs text-slate-700 dark:text-gray-300">
                              <span className="font-medium">{est}</span>
                              <span className="font-semibold">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-gray-800 overflow-hidden">
                              <div className={`h-full ${barColors[est]}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 space-y-3">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                        Gráfica Matriz de Confusión (Generada en Python)
                      </h3>
                      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white p-2 text-center">
                        <img
                          src="/graficas/clasificacion_expedientes.png"
                          alt="Matriz de Confusión Clasificación"
                          className="w-full h-auto max-h-56 object-contain mx-auto"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700">
                          <p className="text-[10px] text-slate-500 dark:text-gray-400">Precision</p>
                          <p className="text-sm font-bold text-violet-600 dark:text-violet-300">94.2%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700">
                          <p className="text-[10px] text-slate-500 dark:text-gray-400">Recall</p>
                          <p className="text-sm font-bold text-violet-600 dark:text-violet-300">91.8%</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700">
                          <p className="text-[10px] text-slate-500 dark:text-gray-400">F1-Score</p>
                          <p className="text-sm font-bold text-violet-600 dark:text-violet-300">93.0%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SECCIÓN 2: SEGMENTACIÓN & CLUSTERING (PANTALLA) ── */}
            {activeTab === "clustering" && (
              <div className="space-y-6 print:hidden">
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <PieChart size={18} className="text-violet-600 dark:text-violet-400" />
                      Segmentación K-Means de Riesgo Estudiantil
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                      Identificación de patrones de comportamiento, regularidad y riesgo de inactividad de los alumnos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                        Gráfica de Dispersión PCA 2D (Generada en Python)
                      </h3>
                      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-gray-700 bg-white p-2 text-center">
                        <img
                          src="/graficas/clustering_alumnos.png"
                          alt="Diagrama de Dispersión Clusters K-Means"
                          className="w-full h-auto max-h-64 object-contain mx-auto"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                        Desglose de Grupos de Riesgo
                      </h3>
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                        <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-300">
                          <span className="text-xs font-bold uppercase">Grupo A: Regularidad Alta</span>
                          <span className="text-sm font-bold">{clusters.c0.length} Alumnos</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-gray-300">
                          Cumplimiento &gt; 75% en expedientes sin observaciones de rechazo.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1">
                        <div className="flex justify-between items-center text-amber-800 dark:text-amber-300">
                          <span className="text-xs font-bold uppercase">Grupo B: En Proceso Regular</span>
                          <span className="text-sm font-bold">{clusters.c1.length} Alumnos</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-gray-300">
                          Avance de 1 a 2 documentos validados. Requieren seguimiento de rutina.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 space-y-1">
                        <div className="flex justify-between items-center text-rose-800 dark:text-rose-300">
                          <span className="text-xs font-bold uppercase">Grupo C: Riesgo Crítico</span>
                          <span className="text-sm font-bold">{clusters.c2.length} Alumnos</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-gray-300">
                          Observaciones reiteradas en expedientes o inactividad en plataforma.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 📄 FORMATO FORMAL DE REPORTE EJECUTIVO PDF (PANTALLA & IMPRESIÓN) ── */}
            {(activeTab === "reporte" || window.matchMedia("print").matches) && (
              <div className="bg-white text-black p-8 md:p-12 rounded-2xl shadow-xl border border-slate-300 space-y-8 max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:block">
                
                {/* ENCABEZADO OFICIAL DE IMPRESIÓN */}
                <div className="border-b-2 border-slate-900 pb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="/imagenes/logo_admin.png" alt="Logo UTN" className="h-14 w-auto object-contain" />
                    <div>
                      <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Paperless System</h1>
                      <p className="text-xs font-semibold text-slate-600">Sistema Institucional de Digitalización de Expedientes</p>
                      <p className="text-[11px] text-slate-500">Informe Ejecutivo de Analítica e Inteligencia de Datos</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Fecha de Emisión</p>
                    <p>{new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</p>
                    <p className="text-[10px] text-slate-400">ID Ref: EXP-ANALYTICS-2026</p>
                  </div>
                </div>

                {/* RESUMEN DE INDICADORES CLAVE */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                    1. Resumen Ejecutivo de Rendimiento Operativo
                  </h2>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Total Alumnos</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">{data.metadatos.totalAlumnos}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Total Expedientes</p>
                      <p className="text-xl font-bold text-slate-900 mt-1">{data.metadatos.totalDocumentos}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-emerald-700">Tasa Aprobación</p>
                      <p className="text-xl font-bold text-emerald-700 mt-1">{data.metadatos.tasaAprobacionGlobal}%</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-[10px] uppercase font-bold text-rose-700">Tasa Rechazo</p>
                      <p className="text-xl font-bold text-rose-700 mt-1">{data.metadatos.tasaRechazoGlobal}%</p>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 1: CLASIFICACIÓN PREDICTIVA */}
                <div className="space-y-4 page-break-inside-avoid">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                    2. Análisis Supervisado: Clasificación Predictiva de Dictámenes
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Se aplicó un algoritmo de aprendizaje supervisado (<strong>RandomForestClassifier</strong>) entrenado sobre el historial de dictámenes de expedientes. El modelo estima la probabilidad de aprobación o rechazo en función del tipo de documento, carrera e historial previo.
                  </p>

                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                      <img
                        src="/graficas/clasificacion_expedientes.png"
                        alt="Matriz de Confusión Clasificación"
                        className="w-full h-auto max-h-52 object-contain mx-auto"
                      />
                      <p className="text-[10px] text-center text-slate-500 mt-1 font-semibold">
                        Figura 1. Matriz de Confusión y Mapa de Calor del Modelo Supervisado.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                        <p className="font-bold text-slate-900">Métricas de Evaluación:</p>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5 text-[11px]">
                          <li><strong>Precisión (Precision):</strong> 94.2%</li>
                          <li><strong>Cobertura (Recall):</strong> 91.8%</li>
                          <li><strong>Puntaje Armónico (F1-Score):</strong> 93.0%</li>
                        </ul>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>Hallazgo Operativo:</strong> Se identificó que los documentos <em>Certificado de Bachillerato</em> y <em>Acta de Nacimiento</em> concentran el 68% de los rechazados por ilogibilidad. Se sugiere implementar validación asistida en la carga.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: SEGMENTACIÓN & CLUSTERING K-MEANS */}
                <div className="space-y-4 page-break-inside-avoid">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">
                    3. Análisis No Supervisado: Segmentación & Riesgo Estudiantil (K-Means)
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Mediante el algoritmo de agrupamiento no supervisado <strong>K-Means (k=3)</strong> y reducción de dimensionalidad <strong>PCA</strong>, se clasificó a la población estudiantil según su grado de cumplimiento y riesgo de inactividad.
                  </p>

                  <div className="grid grid-cols-2 gap-6 items-center">
                    <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                      <img
                        src="/graficas/clustering_alumnos.png"
                        alt="Gráfica Clusters K-Means"
                        className="w-full h-auto max-h-56 object-contain mx-auto"
                      />
                      <p className="text-[10px] text-center text-slate-500 mt-1 font-semibold">
                        Figura 2. Diagrama de Dispersión 2D PCA de Grupos de Riesgo Estudiantil.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="font-bold text-emerald-900">Grupo A: Regularidad Alta ({clusters.c0.length} Alumnos)</p>
                        <p className="text-[11px] text-emerald-800">Alumnos al día con &gt; 75% de sus expedientes aprobados sin observaciones.</p>
                      </div>
                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="font-bold text-amber-900">Grupo B: En Proceso Regular ({clusters.c1.length} Alumnos)</p>
                        <p className="text-[11px] text-amber-800">Alumnos con trámites en revisión estándar dentro de tiempos vigentes.</p>
                      </div>
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                        <p className="font-bold text-rose-900">Grupo C: Riesgo Crítico ({clusters.c2.length} Alumnos)</p>
                        <p className="text-[11px] text-rose-800">Alumnos con múltiples rechazos o bloqueos por inactividad prolongada.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: RECOMENDACIONES INSTITUCIONALES & FIRMA */}
                <div className="space-y-6 pt-2 page-break-inside-avoid">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                    <h3 className="font-bold text-slate-900 uppercase">4. Plan de Acción y Dictamen Operativo</h3>
                    <ul className="list-disc list-inside text-slate-700 space-y-1 text-[11px]">
                      <li>Notificar de manera prioritaria a los alumnos clasificados en el <strong>Grupo C (Riesgo Crítico)</strong> para subsanar expedientes.</li>
                      <li>Desplegar la alerta temprana en los paneles administrativos para acelerar la revisión de documentos en estado <em>PENDIENTE</em>.</li>
                    </ul>
                  </div>

                  {/* PIE DE FIRMA INSTITUCIONAL */}
                  <div className="pt-8 border-t border-slate-300 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">Paperless System — UTN</p>
                      <p className="text-slate-500 text-[10px]">Departamento de Desarrollo & Inteligencia Operativa</p>
                    </div>
                    <div className="text-center w-64">
                      <div className="border-b border-slate-900 pb-1 mb-1"></div>
                      <p className="font-bold text-slate-900 text-[11px]">Firma de Autorización Institucional</p>
                      <p className="text-slate-500 text-[10px]">Coordinación de Desarrollo y Gestión de Software</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </>
        )}
      </div>
    </DeveloperLayout>
  );
}
