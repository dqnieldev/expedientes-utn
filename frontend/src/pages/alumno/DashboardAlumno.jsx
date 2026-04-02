import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";

export default function DashboardAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // obtener alumno
        const resAlumno = await axios.get(
          "http://localhost:3000/api/alumnos/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setAlumno(resAlumno.data);

        // obtener documentos
        const resDocs = await axios.get(
          `http://localhost:3000/api/documentos/${resAlumno.data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setDocs(resDocs.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar datos. Verifica que el backend esté corriendo.");
      }
    };

    fetchData();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!alumno) return <p>Cargando...</p>;

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-[#f8faf6] min-h-screen">

        {/* BIENVENIDA */}
        <h1 className="text-2xl font-semibold text-primary">
          Bienvenido, {alumno.nombre}
        </h1>

        <p className="text-gray-600 mt-2 mb-6">
          Este sistema te permite gestionar y consultar tu expediente digital.
        </p>

        {/* CARD INFO */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">

          <h2 className="font-semibold mb-3">Información del alumno</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nombre:</strong> {alumno.nombre}</p>
            <p><strong>Matrícula:</strong> {alumno.matricula}</p>
            <p><strong>Carrera:</strong> {alumno.carrera}</p>
            <p><strong>Cuatrimestre:</strong> {alumno.cuatrimestre_actual}</p>
          </div>

          <button className="mt-4 bg-primary text-white px-4 py-2 rounded">
            Ver perfil
          </button>

        </div>

        {/* EXPEDIENTE */}
        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="font-semibold mb-4">
            Expediente Digital
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {["ACTA", "CURP", "CERTIFICADO", "CONSTANCIA"].map((tipo) => {
              const doc = docs.find(d => d.tipo === tipo);

              return (
                <div
                  key={tipo}
                  className="p-4 bg-gray-100 rounded-lg text-center"
                >
                  <p className="text-sm">{tipo}</p>

                  <p className={`mt-2 font-semibold ${
                    doc?.estado === "APROBADO"
                      ? "text-green-600"
                      : doc?.estado === "RECHAZADO"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}>
                    {doc ? doc.estado : "PENDIENTE"}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </div>
    </div>
  );
}