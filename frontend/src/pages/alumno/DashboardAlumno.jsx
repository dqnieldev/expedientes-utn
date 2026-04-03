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
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Bienvenido, {alumno.nombre}
        </h2>
        <p className="text-gray-600 mt-2">
          Gestiona tus documentos académicos y consulta tu estatus escolar.
        </p>
      </div>

      <div className="flex gap-8">

        {/* 🟢 PERFIL */}
        <div className="w-80 bg-white rounded-2xl p-6 shadow">

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl mb-4"></div>

            <h3 className="text-xl font-semibold">
              {alumno.nombre}
            </h3>

            <span className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm mt-2">
              {alumno.carrera}
            </span>
          </div>

          <div className="mt-6 space-y-4 text-sm">

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
            className="w-full mt-6 bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-[#007a46] transition-colors duration-200"
          >
            <Pen size={16} />
            Modificar Perfil
          </button>

        </div>

        {/* 🟡 EXPEDIENTE RESUMEN */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Expediente Digital</h3>
          <ExpedienteResumen docs={docs} />
        </div>

      </div>

    </MainLayout>
  );
}