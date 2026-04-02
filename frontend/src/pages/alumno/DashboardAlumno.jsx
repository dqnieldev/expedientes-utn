import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";

export default function DashboardAlumno() {
  const [alumno, setAlumno] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        // 🔹 Alumno
        const resAlumno = await axios.get(
          "http://localhost:3000/api/alumnos/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setAlumno(resAlumno.data);

        // 🔹 Documentos
        const resDocs = await axios.get(
          `http://localhost:3000/api/documentos/${resAlumno.data.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
    <div className="h-screen flex overflow-hidden bg-[#f8faf6]">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">

        {/* HEADER MOBILE */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h1 className="text-primary font-semibold">
            UTN Nayarit
          </h1>

          <div className="w-10 h-10 bg-black rounded-xl"></div>
        </div>

        {/* TITULO */}
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          ¡Bienvenido, {alumno.nombre}!
        </h2>

        <p className="text-gray-600 mb-6 text-sm md:text-base">
          Gestiona tus documentos académicos y consulta tu estatus escolar desde un solo lugar.
        </p>

        {/* CARD VERDE */}
        <div className="bg-primary text-white p-6 rounded-2xl mb-4">
          <h3 className="text-lg font-semibold">
            {alumno.nombre}
          </h3>
          <p className="opacity-90">{alumno.carrera}</p>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-3 mb-4">

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">MATRÍCULA</p>
            <p className="font-semibold">{alumno.matricula}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-xs text-gray-500">CUATRIMESTRE</p>
            <p className="font-semibold">{alumno.cuatrimestre_actual}</p>
          </div>

        </div>

        {/* EDAD */}
        <div className="bg-gray-100 p-3 rounded-xl mb-6">
          <p className="text-xs text-gray-500">EDAD DEL ALUMNO</p>
          <p className="font-semibold">21 años cumplidos</p>
        </div>

        {/* EXPEDIENTE */}
        <div className="mb-6">

          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Expediente Digital</h3>
            <span className="text-primary text-sm">
              {docs.length} documentos
            </span>
          </div>

          <div className="space-y-3">

            {[
              { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
              { tipo: "CURP", label: "CURP" },
              { tipo: "CERTIFICADO", label: "Certificado de Bachillerato" },
              { tipo: "CONSTANCIA", label: "Constancia de Estudios" }
            ].map((item) => {
              const doc = docs.find(d => d.tipo === item.tipo);

              return (
                <div
                  key={item.tipo}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                >

                  <div>
                    <p className="font-medium">{item.label}</p>

                    <span className={`text-xs px-2 py-1 rounded-full ${
                      doc?.estado === "APROBADO"
                        ? "bg-green-100 text-green-700"
                        : doc?.estado === "RECHAZADO"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {doc ? doc.estado : "Pendiente"}
                    </span>
                  </div>

                  {!doc ? (
                    <button className="bg-primary text-white px-3 py-1 rounded text-sm">
                      Cargar
                    </button>
                  ) : (
                    <span className="text-green-600 text-xl">✔</span>
                  )}

                </div>
              );
            })}

          </div>
        </div>

        {/* AYUDA */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="font-semibold">
            ¿Necesitas ayuda con tus trámites?
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Contacta a Servicios Escolares de la UTN.
          </p>
        </div>

      </div>

      {/* NAV MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 md:hidden">

        <button className="text-primary text-sm font-semibold">
          Dashboard
        </button>

        <button className="text-gray-500 text-sm">
          Documentos
        </button>

        <button className="text-gray-500 text-sm">
          Perfil
        </button>

      </div>

    </div>
  );
}