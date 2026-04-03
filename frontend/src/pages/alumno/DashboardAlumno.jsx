import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import ExpedienteResumen from "../../components/ExpedienteResumen";
import { useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";

export default function DashboardAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [docs, setDocs] = useState([]);

  const navigate = useNavigate();

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
      }
    };
    fetchData();
  }, []);

  if (!alumno) return <p className="p-4">Cargando...</p>;

  return (
    <MainLayout title="Dashboard">

      {/* BIENVENIDA */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Bienvenido, {alumno.nombre}
        </h2>
        <p className="text-gray-600 mt-1">
          Gestiona tus documentos académicos y consulta tu estatus escolar.
        </p>
      </div>

            {/* CONTENIDO */}
        <div className="flex flex-col md:flex-row gap-6 md:h-[calc(100%-5rem)]">

        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-6 w-full md:w-72 shrink-0 md:overflow-y-auto">

          {/* 🟢 PERFIL */}
          <div className="bg-white rounded-2xl p-5 shadow">

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-3"></div>

              <h3 className="text-lg font-semibold">
                {alumno.nombre}
              </h3>

              <span className="bg-green-100 text-primary px-3 py-0.5 rounded-full text-xs mt-2 text-center">
                {alumno.carrera}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Matrícula</span>
                <span className="font-medium">{alumno.matricula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cuatrimestre</span>
                <span className="font-medium">{alumno.cuatrimestre_actual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estado</span>
                <span className="font-medium">{alumno.estado}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/perfil")}
              className="w-full mt-4 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-[#007a46] transition-colors duration-200"
            >
              <Pen size={14} />
              Modificar Perfil
            </button>

          </div>

          {/* 🟡 EXPEDIENTE RESUMEN */}
          <div className="bg-white rounded-2xl p-5 shadow flex flex-col">
            <h3 className="text-base font-semibold mb-4">Expediente Digital</h3>
            <ExpedienteResumen docs={docs} />
          </div>

        </div>

        {/* COLUMNA DERECHA — espacio para el calendario u otro contenido futuro */}
        <div className="flex-1 md:overflow-y-hidden bg-white rounded-2xl p-5 shadow">
          {/* aquí va el calendario */}
        </div>

      </div>

    </MainLayout>
  );
}