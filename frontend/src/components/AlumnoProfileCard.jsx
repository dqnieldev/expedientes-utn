import { useNavigate } from "react-router-dom";
import { Pen, GraduationCap, Hash, BookOpen, CheckCircle, Camera } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";

export default function AlumnoProfileCard({ alumno: initialAlumno }) {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [foto, setFoto] = useState(initialAlumno.foto || null);
  const token = localStorage.getItem("token");

  const alumno = { ...initialAlumno, foto };

  const initials = alumno.nombre
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const estadoColor = alumno.estado === "ACTIVO"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-red-100 text-red-700";

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
      alert("Error al actualizar foto");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm">

      {/* BANNER */}
      <div className="h-16 rounded-t-2xl bg-gradient-to-r from-[#024E3F] to-[#037a62]" />

      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">

          {/* AVATAR CON BOTÓN CÁMARA */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm overflow-hidden">
              {foto ? (
                <img
                  src={`http://localhost:3000/uploads/${foto}`}
                  alt="Foto de perfil"
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
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 active:scale-95 transition-all duration-150"
              title="Cambiar foto de perfil"
            >
              <Camera size={11} className="text-gray-500" />
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleFotoChange}
            />
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoColor}`}>
            <span className="flex items-center gap-1">
              <CheckCircle size={11} />
              {alumno.estado}
            </span>
          </span>
        </div>

        {/* NOMBRE Y CARRERA */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight">
          {alumno.nombre}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-4">{alumno.carrera}</p>

        <div className="border-t border-gray-100 mb-4" />

        {/* DATOS */}
        <div className="space-y-3">

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Hash size={13} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Matrícula</p>
              <p className="text-sm font-medium text-gray-800">{alumno.matricula}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <GraduationCap size={13} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Carrera</p>
              <p className="text-sm font-medium text-gray-800">{alumno.carrera}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <BookOpen size={13} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Cuatrimestre</p>
              <p className="text-sm font-medium text-gray-800">{alumno.cuatrimestre_actual}</p>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-4 mb-4" />

        <button
          onClick={() => navigate("/perfil")}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-150"
        >
          <Pen size={13} />
          Modificar Perfil
        </button>

      </div>
    </div>
  );
}