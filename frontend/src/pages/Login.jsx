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

      if (data.mustChangePassword) {
        window.location.href = "/change-password";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2 bg-white">

      {/* IZQUIERDA */}
      <div className="flex flex-col justify-between px-10 py-10 bg-white">

        {/* LOGO TOP */}
        <div className="flex items-center gap-3">
          <img src="/imagenes/logo_ut.png" alt="Logo UTN" className="w-10 h-10 object-contain" />
          <div>
            <p className="text-xs font-semibold text-primary tracking-widest uppercase leading-none">
              Paperless System
            </p>
            <p className="text-[10px] text-gray-400 tracking-wide">
              Universidad Tecnológica de Nayarit
            </p>
          </div>
        </div>

        {/* FORM CENTER */}
        <div className="w-full max-w-sm mx-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido de nuevo
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Ingresa tus credenciales institucionales para continuar
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                Correo institucional
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="usuario@utnayarit.edu.mx"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Contraseña
                </label>
                <span
                  onClick={() => navigate("/recuperar")}
                  className="text-xs text-primary cursor-pointer hover:underline"
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
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#013d31] active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
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

        {/* AVISO BOTTOM */}
        <div className="text-[10px] text-gray-400 text-center">
          El manejo de datos personales está protegido conforme a la Ley General de Protección de Datos Personales.
        </div>

      </div>

      {/* DERECHA */}
      <div className="hidden md:flex flex-col relative overflow-hidden bg-[#024E3F]">

        <img
          src="/imagenes/login_img.webp"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        {/* CONTENIDO */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">

          {/* TOP BADGE */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs px-4 py-2 rounded-full w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Sistema Digital Institucional
          </div>

          {/* CENTER */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Gestión de expedientes
              <span className="block text-emerald-300">sin papel.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Sube, consulta y administra tus documentos académicos desde cualquier lugar, en cualquier momento.
            </p>

            {/* FEATURES */}
            <div className="mt-8 space-y-3">
              {[
                "Documentos siempre disponibles",
                "Validación en tiempo real",
                "100% seguro y confidencial"
              ].map(f => (
                <div key={f} className="flex items-center gap-3 text-white/70 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM */}
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Universidad Tecnológica de Nayarit
          </p>

        </div>

      </div>

    </div>
  );
}