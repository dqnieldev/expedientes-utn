import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import ExpedienteResumen from "../../components/ExpedienteResumen";
import { useNavigate } from "react-router-dom";
import AlumnoProfileCard from "../../components/AlumnoProfileCard";

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

  if (!alumno) return null; // o un spinner de carga

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
<div className="flex flex-col md:flex-row gap-6 md:items-stretch">

  {/* COLUMNA IZQUIERDA */}
  <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">
    <AlumnoProfileCard alumno={alumno} />
    <div className="bg-white rounded-2xl p-5 shadow flex flex-col">
      <h3 className="text-base font-semibold mb-4">Expediente Digital</h3>
      <ExpedienteResumen docs={docs} />
    </div>
  </div>

  {/* COLUMNA DERECHA */}
  <div className="flex-1 bg-white rounded-2xl p-5 shadow">
    {/* aquí va el calendario */}
  </div>

</div>

    </MainLayout>
  );
}