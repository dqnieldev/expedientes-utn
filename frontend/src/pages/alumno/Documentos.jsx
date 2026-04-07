import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import DocumentUploadCard from "../../components/DocumentUploadCard";
import ExpedienteResumen from "../../components/ExpedienteResumen";
import { SkeletonDocumentos } from "../../components/Skeleton";
import { FileText, Fingerprint, GraduationCap, FileBadge, Download } from "lucide-react";


export default function Documentos() {
  const [docs, setDocs] = useState([]);
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const documentosBase = [
    { tipo: "ACTA_NACIMIENTO", label: "Acta de Nacimiento" },
    { tipo: "CURP",            label: "CURP" },
    { tipo: "CERTIFICADO",     label: "Certificado de Bachillerato" },
    { tipo: "CONSTANCIA",      label: "Constancia de Estudios" }
  ];

  const iconMap = {
    ACTA_NACIMIENTO: <FileText size={20} />,
    CURP:            <Fingerprint size={20} />,
    CERTIFICADO:     <GraduationCap size={20} />,
    CONSTANCIA:      <FileBadge size={20} />
  };

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file || !alumno) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);
    formData.append("alumnoId", alumno.id);

    try {
      await axios.post(
        "http://localhost:3000/api/documentos",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error(error.response?.data);
    }
  };
// Función para descargar el reporte PDF del expediente del alumno
  const handleDescargarReporte = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/reportes/mio", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-expediente.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <MainLayout title="Mis Documentos">

            <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Documentos
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Sube, consulta y administra tus documentos académicos.
          </p>
        </div>
        <button
          onClick={handleDescargarReporte}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-[#013d31] active:scale-95 transition-all duration-150"
        >
          <Download size={15} />
          Descargar PDF
        </button>
      </div>

      {loading ? <SkeletonDocumentos /> : (
        <div className="grid md:grid-cols-3 gap-6">

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

          <div className="order-first md:order-last bg-white dark:bg-gray-800 rounded-2xl p-5 shadow flex flex-col gap-4 transition-colors duration-200">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Resumen del Expediente
            </h3>
            <ExpedienteResumen docs={docs} showButton={false} />
          </div>

        </div>
      )}

    </MainLayout>
  );
}