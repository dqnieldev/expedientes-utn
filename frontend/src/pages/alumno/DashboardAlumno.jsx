import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import ExpedienteResumen from "../../components/ExpedienteResumen";
import AlumnoProfileCard from "../../components/AlumnoProfileCard";
import { SkeletonDashboard } from "../../components/Skeleton";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const resAlumno = await axios.get(
          "http://localhost:3000/api/alumnos/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlumno(resAlumno.data);

        const resDocs = await axios.get(
          `http://localhost:3000/api/documentos/${resAlumno.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDocs(resDocs.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout title={t("nav.dashboard")}>

      {/* BIENVENIDA */}
      <div className="mb-6">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-4 w-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("dashboard.welcome", { name: alumno.nombre })}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t("dashboard.subtitleAlumno")}
            </p>
          </>
        )}
      </div>

      {loading ? <SkeletonDashboard /> : (
        <div className="flex flex-col md:flex-row gap-6 md:items-stretch">

          <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">
            <AlumnoProfileCard alumno={alumno} />
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow flex flex-col transition-colors duration-200">
              <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
                {t("dashboard.digitalRecord")}
              </h3>
              <ExpedienteResumen docs={docs} />
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow transition-colors duration-200">
            {/* aquí va el calendario */}
          </div>

        </div>
      )}

    </MainLayout>
  );
}