import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import { Users, FileCheck, ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardAdmin() {
  const { t } = useTranslation();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/api/alumnos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAlumnos(res.data))
      .finally(() => setLoading(false));
  }, []);

  // ── MÉTRICAS ─────────────────────────────
  const totalAlumnos = alumnos.length;
  const totalActivos = alumnos.filter(a => a.estado === "ACTIVO").length;

  const stats = [
    {
      label: t("dashboard.totalStudents"),
      value: totalAlumnos,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      label: t("dashboard.activeStudents"),
      value: totalActivos,
      icon: FileCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
  ];

  // ── ACCESOS ─────────────────────────────
  const accesos = [
    {
      title: t("dashboard.manageStudents"),
      desc: t("dashboard.manageStudentsSub"),
      icon: Users,
      path: "/admin/alumnos",
      color: "border-blue-200 dark:border-blue-700/50 hover:border-blue-400",
      iconColor: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: t("dashboard.validateDocs"),
      desc: t("dashboard.validateDocsSub"),
      icon: FileCheck,
      path: "/admin/documentos",
      color: "border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400",
      iconColor: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    },
  ];

  // ── REPORTE PDF ─────────────────────────
  const handleReporteGeneral = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/reportes/general", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte-general-expedientes.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout title={t("dashboard.title")}>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>

        <button
          onClick={handleReporteGeneral}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#243660] active:scale-95 transition-all duration-150"
        >
          <Download size={15} />
          {t("dashboard.generalPDF")}
        </button>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {loading ? (
          [1,2].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))
        ) : (
          stats.map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {label}
                </p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <Icon size={15} className={color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ACCESOS */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
          {t("dashboard.manageStudents")}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {accesos.map(({ title, desc, icon: Icon, path, color, iconColor }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-2 border-transparent ${color} transition-all text-left group`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconColor}`}>
                  <Icon size={18} />
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500" />
              </div>

              <p className="font-semibold text-gray-800 dark:text-white text-sm">
                {title}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* LISTA */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {t("dashboard.recentStudents")}
          </h3>

          <button
            onClick={() => navigate("/admin/alumnos")}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            {t("dashboard.viewAll")} <ArrowRight size={12} />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : alumnos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {t("dashboard.noStudents")}
            </div>
          ) : (
            <div className="divide-y">
              {alumnos.slice(0, 5).map(alumno => (
                <div
                  key={alumno.id}
                  onClick={() => navigate(`/admin/alumnos/${alumno.id}`)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1a2744] flex items-center justify-center text-white text-xs">
                    {alumno.nombre?.[0]}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {alumno.nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      {alumno.matricula}
                    </p>
                  </div>

                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    {t(`status.${alumno.estado}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </AdminLayout>
  );
}