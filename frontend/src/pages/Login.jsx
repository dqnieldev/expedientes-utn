import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const data = await login(form);
    localStorage.clear();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("mustChangePassword", data.mustChangePassword);
    localStorage.setItem("tempPass", form.password); // Guardamos la contraseña actual para el cambio de contraseña

    if (data.mustChangePassword) {
  window.location.href = "/change-password";
} else if (data.user.role === "DEVELOPER") {
  window.location.href = "/developer/respaldos";
} else if (data.user.role === "ADMIN") {
  window.location.href = "/admin/dashboard";
} else {
  window.location.href = "/dashboard";
}
  } catch (err) {
  if (err.response?.status === 429) {
    setError("Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.");
  } else if (err.response?.status === 401 || err.response?.status === 400) {
    setError("Correo o contraseña incorrectos.");
  } else {
    setError("Error al iniciar sesión. Intenta más tarde.");
  }
  setLoading(false);
}
};

  return (
    <div className="h-screen flex bg-[#024E3F] p-4">

      {/* IZQUIERDA — formulario 35% */}
      <div
        className="w-full md:w-[35%] flex flex-col justify-between px-10 py-10 shadow-2xl z-10 rounded-3xl"
        style={{
          background: "linear-gradient(160deg, #f8f9fb 0%, #eaedf2 50%, #dde1e9 100%)"
        }}
      >

        {/* LOGO */}
  <div className="flex flex-col items-center text-center gap-3">
    <img src="/imagenes/logo_ut.png" alt="Logo UTN" className="w-40 h-40 object-contain" />
    <div>
      <p className="text-lg font-bold text-[#024E3F] tracking-widest uppercase leading-tight">
        Paperless System
      </p>
      <p className="text-xs text-gray-400 tracking-wide mt-1">
        Universidad Tecnológica de Nayarit
      </p>
    </div>
  </div>

        {/* FORM */}
        <div className="w-full">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Iniciar sesión
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Ingresa tus credenciales institucionales
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                Correo institucional
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="usuario@utnayarit.edu.mx"
                  className="w-full pl-10 pr-4 py-3 bg-white/80 border-2 border-white rounded-xl text-sm focus:outline-none focus:border-[#024E3F] focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Contraseña
                </label>
                <span
                  onClick={() => navigate("/recuperar")}
                  className="text-xs text-[#024E3F] font-medium cursor-pointer hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white/80 border-2 border-white rounded-xl text-sm focus:outline-none focus:border-[#024E3F] focus:bg-white transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#024E3F] text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#013d31] active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-lg shadow-[#024E3F]/20"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

        </div>

        {/* AVISO */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          El manejo de datos personales está protegido conforme a la<br />
          Ley General de Protección de Datos Personales.
        </p>

      </div>

      {/* DERECHA — verde institucional */}
      <div className="hidden md:flex flex-1 flex-col relative overflow-hidden">

        <img
          src="/imagenes/login_img.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />

        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full border-2 border-white" />
          <div className="absolute top-32 right-32 w-72 h-72 rounded-full border-2 border-white" />
          <div className="absolute top-44 right-44 w-48 h-48 rounded-full border-2 border-white" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full border border-white" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-16">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs px-4 py-2 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sistema Digital Institucional · UTN
          </div>

          {/* COPY */}
          <div>
            <p className="text-emerald-300/70 text-sm font-medium tracking-widest uppercase mb-4">
              Bienvenido al
            </p>
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Sistema de<br />
              Gestión de<br />
              <span className="text-emerald-300">Expedientes.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Administra, consulta y valida tus documentos académicos desde cualquier lugar, de forma segura y sin papel.
            </p>

            {/* FEATURES */}
            <div className="mt-10 space-y-4">
              {[
                { title: "Documentos siempre disponibles", desc: "Accede desde cualquier dispositivo"       },
                { title: "Validación en tiempo real",      desc: "Seguimiento del estado de cada documento" },
                { title: "100% seguro y confidencial",     desc: "Tus datos protegidos en todo momento"     },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-white/40 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM */}
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Universidad Tecnológica de Nayarit — Todos los derechos reservados
          </p>

        </div>

      </div>

    </div>
  );
}