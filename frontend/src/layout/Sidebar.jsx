import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-primary text-white flex flex-col p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-xl font-bold">Paperless</h1>
        <p className="text-sm opacity-80">UTN Nayarit</p>
      </div>

      {/* MENU */}
      <nav className="flex flex-col gap-4">

        <Link to="/dashboard" className="hover:bg-white/10 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/documentos" className="hover:bg-white/10 p-2 rounded">
          Mis documentos
        </Link>

        <Link to="/perfil" className="hover:bg-white/10 p-2 rounded">
          Perfil
        </Link>

      </nav>

      <button onClick={() => {localStorage.clear();window.location.href = "/";}}>Cerrar sesión
        
      </button>

    </div>
  );
}