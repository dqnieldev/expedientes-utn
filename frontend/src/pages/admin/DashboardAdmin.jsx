import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import { Users, FileCheck, FileClock, FileX, ArrowRight, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
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

  // Métricas calculadas desde los alumnos y sus documentos
  const totalAlumnos   = alumnos.length;
  const totalActivos   = alumnos.filter(a => a.estado === "ACTIVO").length;

  const stats = [
    {
      label: "Total Alumnos",
      value: totalAlumnos,
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
    },
    {
      label: "Alumnos Activos",
      value: totalActivos,
      icon: FileCheck,
      color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    },
  ];

  const accesos = [
    {
      title: "Gestionar Alumnos",
      desc: "Ver, registrar y administrar alumnos del sistema",
      icon: Users,
      path: "/admin/alumnos",
      color: "border-blue-200 dark:border-blue-700/50 hover:border-blue-400",
      iconColor: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Validar Documentos",
      desc: "Revisar y aprobar expedientes de alumnos",
      icon: FileCheck,
      path: "/admin/documentos",
      color: "border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400",
      iconColor: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    },
  ];
//Función para descargar el reporte general de expedientes en PDF
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
    <AdminLayout title="Dashboard">

      {/* BIENVENIDA */}
      <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Panel de Administración
    </h2>
    <p className="text-gray-500 dark:text-gray-400 mt-1">
      Resumen general del sistema de expedientes.
    </p>
  </div>
  <button
    onClick={handleReporteGeneral}
    className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2744] text-white rounded-xl text-sm font-semibold hover:bg-[#243660] active:scale-95 transition-all duration-150"
  >
    <Download size={15} />
    Reporte General PDF
  </button>
</div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
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
                  <Icon size={15} className={color.split(" ")[2]} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          ))
        )}
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
          Accesos Rápidos
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {accesos.map(({ title, desc, icon: Icon, path, color, iconColor }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border-2 border-transparent ${color} transition-all duration-200 text-left group active:scale-95`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${iconColor}`}>
                  <Icon size={18} />
                </div>
                <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors mt-1" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-white text-sm">{title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* LISTA RÁPIDA DE ÚLTIMOS ALUMNOS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Alumnos Recientes
          </h3>
          <button
            onClick={() => navigate("/admin/alumnos")}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight size={12} />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : alumnos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No hay alumnos registrados
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {alumnos.slice(0, 5).map(alumno => {
                const initials = alumno.nombre
                  .split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

                return (
                  <div
                    key={alumno.id}
                    onClick={() => navigate(`/admin/alumnos/${alumno.id}`)}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1a2744] flex items-center justify-center shrink-0">
                      {alumno.foto ? (
                        <img
                          src={`http://localhost:3000/uploads/${alumno.foto}`}
                          className="w-full h-full object-cover rounded-xl"
                          alt=""
                        />
                      ) : (
                        <span className="text-white text-xs font-semibold">{initials}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {alumno.nombre}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{alumno.matricula}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium shrink-0
                      ${alumno.estado === "ACTIVO"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}>
                      {alumno.estado}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </AdminLayout>
  );
}