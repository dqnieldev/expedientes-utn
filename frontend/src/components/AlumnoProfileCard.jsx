import { useNavigate } from "react-router-dom";
import { Pen, GraduationCap, Hash, BookOpen, CheckCircle, Camera } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function AlumnoProfileCard({ alumno: initialAlumno }) {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [foto, setFoto] = useState(initialAlumno.foto || null);
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  const alumno = { ...initialAlumno, foto };

  const initials = alumno.nombre
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const estadoColor = alumno.estado === "ACTIVO"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);
    try {
      const res = await axios.put(
        "http://localhost:3000/api/alumnos/foto",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoto(res.data.foto);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm transition-colors duration-200">

      {/* BANNER */}
      <div className="h-16 rounded-t-2xl bg-gradient-to-r from-[#024E3F] to-[#037a62]" />

      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">

          {/* AVATAR */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-200">
              {foto ? (
                <img
                  src={`http://localhost:3000/uploads/${foto}`}
                  alt={t("header.changePhoto")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#024E3F] flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">{initials}</span>
                </div>
              )}
            </div>

            {/* BOTÓN CÁMARA */}
            <button
              onClick={() => inputRef.current.click()}
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 active:scale-95 transition-all duration-150"
              title={t("header.changePhoto")}
            >
              <Camera size={11} className="text-gray-500 dark:text-gray-300" />
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFotoChange}
            />
          </div>

          {/* BADGE ESTADO */}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoColor}`}>
            <span className="flex items-center gap-1">
              <CheckCircle size={11} />
              {t(`status.${alumno.estado}`)}
            </span>
          </span>
        </div>

        {/* NOMBRE Y CARRERA */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
          {alumno.nombre}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 mb-4">
          {alumno.carrera}
        </p>

        <div className="border-t border-gray-100 dark:border-gray-700 mb-4" />

        {/* DATOS */}
        <div className="space-y-3">
          {[
            { icon: Hash,          label: t("students.matricula"), value: alumno.matricula          },
            { icon: GraduationCap, label: t("students.career"),    value: alumno.carrera            },
            { icon: BookOpen,      label: t("students.quarter"),   value: alumno.cuatrimestre_actual },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Icon size={13} className="text-gray-400 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  {label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 mt-4 mb-4" />

        <button
          onClick={() => navigate("/perfil")}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 active:scale-95 transition-all duration-150"
        >
          <Pen size={13} />
          {t("nav.profile")} {/* o agrega una key "editProfile": "Modificar Perfil" */}
        </button>

      </div>
    </div>
  );
}