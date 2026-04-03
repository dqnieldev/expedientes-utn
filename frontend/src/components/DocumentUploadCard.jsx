import { Upload } from "lucide-react";

export default function DocumentUploadCard({
  item,
  doc,
  icon,
  onUpload
}) {

  const getEstado = () => {
    if (!doc) return "PENDIENTE";
    return doc.estado;
  };

  const estado = getEstado();

  const estadoColor = {
    APROBADO: "bg-green-100 text-green-700",
    RECHAZADO: "bg-red-100 text-red-700",
    EN_REVISION: "bg-yellow-100 text-yellow-700",
    PENDIENTE: "bg-gray-200 text-gray-600"
  };

  const iconColor = {
    APROBADO: "bg-green-100 text-green-600",
    RECHAZADO: "bg-red-100 text-red-600",
    EN_REVISION: "bg-yellow-100 text-yellow-700",
    PENDIENTE: "bg-gray-100 text-gray-500"
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow flex flex-col justify-between hover:shadow-lg transition">

      {/* HEADER */}
      <div className="flex justify-between mb-4">

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor[estado]}`}>
          {icon}
        </div>

        <span className={`text-xs px-2 py-1 rounded-full ${estadoColor[estado]}`}>
          {estado}
        </span>

      </div>

      {/* INFO */}
      <div>
        <p className="font-semibold text-lg">{item.label}</p>

        <p className="text-sm text-gray-500">
          {doc ? "Documento cargado" : "Pendiente de subir"}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="mt-4">

        {doc ? (
          <div className="flex gap-2">

            <a
              href={`http://localhost:3000/${doc.url}`}
              target="_blank"
              className="flex-1 border py-2 rounded-lg text-center text-sm hover:bg-gray-50"
            >
              Ver
            </a>

            <label className="flex-1 bg-gray-100 py-2 rounded-lg text-center text-sm cursor-pointer">
              Reemplazar
              <input
                type="file"
                hidden
                onChange={(e) => onUpload(e, item.tipo)}
              />
            </label>

          </div>
        ) : (
          <label className="w-full bg-primary text-white py-2 rounded-lg cursor-pointer flex items-center justify-center gap-2">
            <Upload size={16} />
            Subir Documento
            <input
              type="file"
              hidden
              onChange={(e) => onUpload(e, item.tipo)}
            />
          </label>
        )}

      </div>

    </div>
  );
}