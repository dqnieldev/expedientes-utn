import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import DocumentUploadCard from "../../components/DocumentUploadCard";
import ExpedienteResumen from "../../components/ExpedienteResumen";

import {
  FileText,
  Fingerprint,
  GraduationCap,
  FileBadge
} from "lucide-react";

export default function Documentos() {
  const [docs, setDocs] = useState([]);
  const [alumno, setAlumno] = useState(null);

  const token = localStorage.getItem("token");

  // 📌 DOCUMENTOS BASE
  const documentosBase = [
    { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
    { tipo: "CURP", label: "CURP" },
    { tipo: "CERTIFICADO", label: "Certificado de Bachillerato" },
    { tipo: "CONSTANCIA", label: "Constancia de Estudios" }
  ];

  // 📌 ICONOS
  const iconMap = {
    ACTA_NACIMIENTO: <FileText size={20} />,
    CURP: <Fingerprint size={20} />,
    CERTIFICADO: <GraduationCap size={20} />,
    CONSTANCIA: <FileBadge size={20} />
  };

  // 📌 FETCH DATA
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

  // 📌 UPLOAD
  const handleUpload = async (e, tipo) => {
  const file = e.target.files[0];
  if (!file || !alumno) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo", tipo);
  formData.append("alumnoId", alumno.id); // Asegúrate de enviar el ID del alumno para asociar el documento correctamente

  try {
    console.log("ALUMNO ID:", alumno?.id);
    await axios.post(
      "http://localhost:3000/api/documentos",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchData();
  } catch (error) {
    console.error(error.response?.data);
    alert("Error al subir archivo");
  }
};

  // 📌 PROGRESO
  const aprobados = docs.filter(d => d.estado === "APROBADO").length;

  return (
    <MainLayout title="Mis Documentos">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Gestión de Documentos
        </h2>
        <p className="text-gray-600">
          Sube, consulta y administra tus documentos académicos.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* 🟡 DOCUMENTOS */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">

          {documentosBase.map((item) => {
            const doc = docs.find(d => d.tipo === item.tipo);
            

            return (
              <DocumentUploadCard
                key={item.tipo}
                item={item}
                doc={doc}
                icon={iconMap[item.tipo]}
                onUpload={handleUpload}
              />
            );
          })}

        </div>

        {/* 🟢 RESUMEN */}
<div className="bg-white rounded-2xl p-5 shadow flex flex-col gap-4">
  <h3 className="text-base font-semibold">Resumen del Expediente</h3>
  <ExpedienteResumen docs={docs} showButton={false} />
</div>

        </div>

      

    </MainLayout>
  );
}