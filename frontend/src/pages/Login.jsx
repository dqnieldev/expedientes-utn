import { useState } from "react";
import { login } from "../services/authService";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);

      //  luego redireccionamos
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2">

      {/* IZQUIERDA */}
      <div className="flex items-center justify-center bg-[#f8faf6] px-6">

        <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md">

          {/* LOGO */}
          <div className="flex justify-center mb-4">
            <img
              src="/imagenes/logo_ut.png"
              alt="Logo UTN"
              className="w-40 h-40 object-contain"
            />
          </div>

          {/* TITULO */}
          <h1 className="text-xl font-semibold text-center text-primary">
            PAPERLESS SYSTEM
          </h1>

          <p className="text-center text-gray-500 text-sm mb-6 tracking-wide">
            Universidad Tecnológica de Nayarit
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Usuario</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Ingrese su correo"
                className="w-full mt-1 p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600">Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full mt-1 p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>

            {/* FORGOT */}
            <div className="text-right text-sm text-yellow-700 cursor-pointer hover:underline">
              ¿Olvidaste tu contraseña?
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-md hover:opacity-90 transition"
            >
              Iniciar Sesión →
            </button>

          </form>

          {/* AVISO */}
          <div className="mt-6 bg-gray-100 p-3 rounded-md text-xs text-gray-600">
            <strong>Aviso de Privacidad Institucional</strong>
            <p className="mt-1">
              El manejo de datos personales está protegido conforme a la ley.
            </p>
          </div>

        </div>
      </div>

      {/* DERECHA */}
      <div className="hidden md:block relative">
        <img
          src="/imagenes/login_img.webp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* OVERLAY TEXTO */}
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h2 className="text-2xl font-semibold">
            Innovación y Excelencia
          </h2>
          <p className="text-sm opacity-90">
            Forjando el futuro de Nayarit
          </p>
        </div>
      </div>

    </div>
  );
}