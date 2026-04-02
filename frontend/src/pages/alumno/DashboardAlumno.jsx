import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";

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

  const documentosBase = [
    { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
    { tipo: "CURP", label: "CURP" },
    { tipo: "CERTIFICADO", label: "Certificado de Bachillerato" },
    { tipo: "CONSTANCIA", label: "Constancia de Estudios" }
  ];

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
            className="w-full mt-6 bg-primary text-white py-2 rounded-lg"
          >
            Ver perfil
          </button>

        </div>

        {/* 🟡 DOCUMENTOS */}
        <div className="flex-1">

          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold">
              Expediente Digital
            </h3>
            <span className="text-primary">
              {docs.length} documentos
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">

            {documentosBase.map((item) => {
              const doc = docs.find(d => d.tipo === item.tipo);

              const estadoColor =
                doc?.estado === "APROBADO"
                  ? "bg-green-100 text-green-700"
                  : doc?.estado === "RECHAZADO"
                  ? "bg-red-100 text-red-700"
                  : doc
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-600";

              return (
                <div
                  key={item.tipo}
                  className="bg-white p-5 rounded-2xl shadow flex flex-col justify-between"
                >

                  <div className="flex justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg"></div>

                    <span className={`text-xs px-2 py-1 rounded-full ${estadoColor}`}>
                      {doc ? doc.estado : "PENDIENTE"}
                    </span>
                  </div>

                  <div>
                    <p className="font-semibold">{item.label}</p>
                  </div>

                  <div className="mt-4">

                    {!doc ? (
                      <button
                        onClick={() => navigate("/documentos")}
                        className="w-full bg-primary text-white py-2 rounded-lg"
                      >
                        Cargar Documento
                      </button>
                    ) : doc.estado === "APROBADO" ? (
                      <button className="w-full border py-2 rounded-lg">
                        Ver Documento
                      </button>
                    ) : (
                      <button className="w-full bg-gray-100 py-2 rounded-lg text-gray-500">
                        En revisión
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

    </MainLayout>
  );
}