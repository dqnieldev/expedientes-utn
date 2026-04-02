import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";

export default function DashboardAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

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
    };

    fetchData();
  }, []);

  if (!alumno) return <p>Cargando...</p>;

  const getEstadoColor = (estado) => {
    if (estado === "APROBADO") return "bg-green-100 text-green-700";
    if (estado === "RECHAZADO") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="flex bg-[#f8faf6] min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* HEADER */}
        <h1 className="text-lg text-primary font-semibold mb-2">
          Dashboard
        </h1>

        {/* BIENVENIDA */}
        <h2 className="text-3xl font-bold mb-2">
          Bienvenido, {alumno.nombre}
        </h2>

        <p className="text-gray-600 mb-6">
          Accede a tu historial académico y gestiona tu expediente digital.
        </p>

        {/* GRID PRINCIPAL */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* PERFIL CARD */}
          <div className="bg-white p-6 rounded-xl shadow-md">

            <div className="flex flex-col items-center">

              <img
                src="/imagenes/avatar.png"
                className="w-20 h-20 mb-3"
              />

              <h3 className="font-semibold text-lg">
                {alumno.nombre}
              </h3>

              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm mt-1">
                {alumno.carrera}
              </span>

            </div>

            <div className="mt-6 text-sm space-y-2">

              <p><strong>Matrícula:</strong> {alumno.matricula}</p>
              <p><strong>Cuatrimestre:</strong> {alumno.cuatrimestre_actual}</p>

            </div>

            <button className="w-full mt-4 bg-primary text-white py-2 rounded">
              Actualizar Perfil
            </button>

          </div>

          {/* EXPEDIENTE */}
          <div className="md:col-span-2">

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">
                Expediente Digital
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {[
                { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
                { tipo: "CURP", label: "CURP" },
                { tipo: "CERTIFICADO", label: "Certificado" },
                { tipo: "CONSTANCIA", label: "Constancia" }
              ].map((item) => {
                const doc = docs.find(d => d.tipo === item.tipo);

                return (
                  <div key={item.tipo} className="bg-white p-4 rounded-xl shadow">

                    {/* HEADER CARD */}
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-medium">{item.label}</p>

                      <span className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(doc?.estado)}`}>
                        {doc ? doc.estado : "PENDIENTE"}
                      </span>
                    </div>

                    {/* ACCIONES */}
                    <div className="flex gap-2">

                      <button className="flex-1 border py-2 rounded text-sm">
                        Previsualizar
                      </button>

                      {!doc && (
                        <button className="flex-1 bg-primary text-white py-2 rounded text-sm">
                          Subir
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

        {/* BANNER */}
        <div className="mt-8 bg-primary text-white p-6 rounded-xl">

          <h3 className="text-xl font-semibold">
            Trámites 100% Digitales
          </h3>

          <p className="mt-2 text-sm opacity-90">
            Tu expediente digital tiene validez oficial dentro de la universidad.
          </p>

          <div className="mt-4 flex gap-3">
            <button className="bg-yellow-400 text-black px-4 py-2 rounded">
              Iniciar trámite
            </button>

            <button className="border px-4 py-2 rounded">
              Saber más
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}