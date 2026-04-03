import {
  FileText,
  Fingerprint,
  GraduationCap,
  FileBadge,
  Upload
} from "lucide-react";

export default function DocumentCard({ item, doc, onUpload, onView }) {

  const iconMap = {
    ACTA_NACIMIENTO: FileText,
    CURP: Fingerprint,
    CERTIFICADO: GraduationCap,
    CONSTANCIA: FileBadge
  };

  const Icon = iconMap[item.tipo] || FileText;

  const statusStyles = {
    APROBADO: "bg-green-100 text-green-700",
    RECHAZADO: "bg-red-100 text-red-700",
    PENDIENTE: "bg-gray-300 text-gray-600",
    EN_REVISION: "bg-yellow-100 text-yellow-700"
  };

  const estado = doc?.estado || "PENDIENTE";

  return (
    <div className="bg-white p-5 rounded-2xl shadow flex flex-col justify-between">

      {/* HEADER */}
      <div className="flex justify-between mb-3">

        <div className={`w-10 h-10 rounded-lg flex items-center justify-center
          ${estado === "APROBADO"
            ? "bg-green-100 text-green-600"
            : estado === "RECHAZADO"
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-500"}
        `}>
          <Icon size={18} />
        </div>

        <span className={`text-xs px-2 py-2 rounded-full items-center  ${statusStyles[estado]}`}>
          {estado}
        </span>

      </div>

      {/* BODY */}
      <div>
        <p className="font-semibold">{item.label}</p>
      </div>

      {/* ACTION */}
      <div className="mt-4">

        {!doc ? (
          <button
            onClick={onUpload}
            className="w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-[#007a46] transition-colors duration-200"
          >
            <Upload size={16} />
            Cargar Documento
          </button>
        ) : estado === "APROBADO" ? (
          <button
            onClick={onView}
            className="w-full border py-2 rounded-lg"
          >
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
}