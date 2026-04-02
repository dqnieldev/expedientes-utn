import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../layout/Sidebar";

export default function Documentos() {
  const [docs, setDocs] = useState([]);
  const [alumno, setAlumno] = useState(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);

    try {
      await axios.post(
        "http://localhost:3000/api/documentos",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Error al subir archivo");
    }
  };

  const getEstadoColor = (estado) => {
    if (estado === "APROBADO") return "bg-green-100 text-green-700";
    if (estado === "RECHAZADO") return "bg-red-100 text-red-700";
    if (estado === "EN_REVISION") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-600";
  };

  const documentosBase = [
    { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
    { tipo: "CURP", label: "CURP" },
    { tipo: "CERTIFICADO", label: "Certificado de Bachillerato" },
    { tipo: "CONSTANCIA", label: "Constancia de Estudios" }
  ];

  const aprobados = docs.filter(d => d.estado === "APROBADO").length;

  return (
    <div className="flex bg-[#f8faf6] min-h-screen">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 md:p-8 pb-24">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-2">
          Mi Expediente Digital
        </h1>

        <p className="text-gray-600 mb-6">
          Gestiona tus documentos oficiales.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* DOCUMENTOS */}
          <div className="md:col-span-2 space-y-4">

            {documentosBase.map((item) => {
              const doc = docs.find(d => d.tipo === item.tipo);

              return (
                <div key={item.tipo} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

                  <div>
                    <p className="font-medium">{item.label}</p>

                    <span className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(doc?.estado)}`}>
                      {doc ? doc.estado : "PENDIENTE"}
                    </span>
                  </div>

                  <div className="flex gap-2">

                    {doc && (
                      <a
                        href={`http://localhost:3000/${doc.url}`}
                        target="_blank"
                        className="text-sm border px-3 py-1 rounded"
                      >
                        Ver
                      </a>
                    )}

                    {!doc && (
                      <label className="bg-primary text-white px-3 py-1 rounded text-sm cursor-pointer">
                        Subir
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleUpload(e, item.tipo)}
                        />
                      </label>
                    )}

                  </div>

                </div>
              );
            })}

          </div>

          {/* RESUMEN */}
          <div className="bg-primary text-white p-6 rounded-xl">

            <h3 className="font-semibold mb-4">
              Resumen del Expediente
            </h3>

            <p>Documentos totales: {documentosBase.length}</p>
            <p>Aprobados: {aprobados}</p>

            <div className="w-full bg-white/30 h-2 rounded mt-3">
              <div
                className="bg-yellow-400 h-2 rounded"
                style={{
                  width: `${(aprobados / documentosBase.length) * 100}%`
                }}
              ></div>
            </div>

          </div>

        </div>

      </div>

      {/* NAV MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 md:hidden">

        <button className="text-gray-500 text-sm">
          Dashboard
        </button>

        <button className="text-primary text-sm font-semibold">
          Documentos
        </button>

        <button className="text-gray-500 text-sm">
          Perfil
        </button>

      </div>

    </div>
  );
}