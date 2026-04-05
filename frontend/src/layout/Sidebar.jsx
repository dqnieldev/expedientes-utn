import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  UserCircle,
  HelpCircle,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard",      path: "/dashboard",  icon: LayoutDashboard },
    { name: "Mis Documentos", path: "/documentos", icon: FolderOpen       },
    { name: "Perfil",         path: "/perfil",     icon: UserCircle       },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#024E3F] dark:bg-gray-900 h-full transition-colors duration-200 border-r border-transparent dark:border-gray-700">

      {/* LOGO */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10 dark:border-gray-700">
        <img
          src="/imagenes/logo_ut.png"
          alt="Logo UTN"
          className="w-28 h-auto mb-3"
        />
        <p className="text-xs uppercase tracking-widest text-emerald-100/40 dark:text-gray-500 font-medium">
          Paperless System
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-1">

        <p className="text-xs uppercase tracking-widest text-emerald-100/30 dark:text-gray-600 font-medium px-3 mb-2">
          Menú
        </p>

        {menu.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-white/15 dark:bg-gray-700 text-white"
                  : "text-emerald-100/60 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white"
                }`}
            >
              <span className={`w-1 h-5 rounded-full transition-all duration-200 ${isActive ? "bg-[#FCDA59]" : "bg-transparent"}`} />
              <Icon size={18} className={`transition-colors duration-200 ${isActive ? "text-white" : "text-emerald-100/60 dark:text-gray-400 group-hover:text-white"}`} />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          );
        })}

      </nav>

      {/* DIVIDER */}
      <div className="mx-4 border-t border-white/10 dark:border-gray-700" />

      {/* BOTTOM */}
      <div className="px-3 py-4 space-y-1">

        {/* SOPORTE */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FCDA59]/15 dark:bg-yellow-900/20 hover:bg-[#FCDA59]/25 dark:hover:bg-yellow-900/30 transition-all duration-200">
          <span className="w-1 h-5 rounded-full bg-transparent" />
          <HelpCircle size={18} className="text-[#FCDA59] dark:text-yellow-400" />
          <span className="text-sm font-medium text-[#FCDA59] dark:text-yellow-400">
            Contactar Soporte
          </span>
        </button>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-100/50 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700 hover:text-white dark:hover:text-white transition-all duration-200"
        >
          <span className="w-1 h-5 rounded-full bg-transparent" />
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>

      </div>

    </aside>
  );
}