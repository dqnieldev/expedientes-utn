import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Mis Documentos", path: "/documentos", icon: "📁" },
    { name: "Perfil", path: "/perfil", icon: "👤" }
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#024E3F] border-r border-[#013d31] h-screen">

      {/* LOGO */}
      <div className="pt-10 px-8 pb-8">
        <img
          src="/imagenes/logo_ut.png"
          alt="Logo UTN"
          className="w-32 h-auto mb-2"
        />
        <p className="text-S uppercase tracking-widest mt-1 text-emerald-100/60">
          PAPERLESS SYSTEM
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 space-y-1">

        {menu.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-[#013d31] text-white"
                    : "text-emerald-100/70 hover:bg-[#013d31] hover:text-white"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-base font-medium">{item.name}</span>
            </Link>
          );
        })}

      </nav>

      {/* BOTTOM */}
      <div className="p-4 space-y-2 mb-4">

        {/* SOPORTE */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#FCDA59] hover:bg-[#f7d140] transition text-slate-900">
          ❓ Contactar a Soporte
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100/70 hover:text-white hover:bg-[#013d31] transition"
        >
          ⏻ Salir
        </button>

      </div>

    </aside>
  );
}