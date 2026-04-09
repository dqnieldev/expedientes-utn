import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, UserCircle,
  HelpCircle, LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard",      path: "/dashboard",  icon: LayoutDashboard },
  { name: "Mis Documentos", path: "/documentos", icon: FolderOpen       },
  { name: "Perfil",         path: "/perfil",     icon: UserCircle       },
];

export default function Sidebar() {
  return (
    <>
      {/* ── DESKTOP ── */}
      <aside className="hidden md:flex w-64 flex-col h-full bg-[#024E3F] dark:bg-gray-900 transition-colors duration-200">

        <div className="px-6 pt-8 pb-6 border-b border-white/10 dark:border-gray-700">
          <img src="/imagenes/logo_ut.png" alt="Logo UTN" className="w-28 h-auto mb-3" />
          <p className="text-xs uppercase tracking-widest text-emerald-100/40 dark:text-gray-500 font-medium">
            Paperless System
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs uppercase tracking-widest text-emerald-100/30 dark:text-gray-600 font-medium px-3 mb-2">
            Menú
          </p>
          {menu.map(({ name, path, icon: Icon }) => {
            const isActive = useLocation().pathname === path;
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-white/15 text-white" : "text-emerald-100/60 hover:bg-white/10 hover:text-white"}`}
              >
                <span className={`w-1 h-5 rounded-full ${isActive ? "bg-[#FCDA59]" : "bg-transparent"}`} />
                <Icon size={18} className={isActive ? "text-white" : "text-emerald-100/60 group-hover:text-white"} />
                <span className="text-sm font-medium">{name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-white/10 dark:border-gray-700" />

        <div className="px-3 py-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#FCDA59]/15 hover:bg-[#FCDA59]/25 transition-all">
            <span className="w-1 h-5 rounded-full bg-transparent" />
            <HelpCircle size={18} className="text-[#FCDA59]" />
            <span className="text-sm font-medium text-[#FCDA59]">Contactar Soporte</span>
          </button>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-100/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <span className="w-1 h-5 rounded-full bg-transparent" />
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* ── MÓVIL: bottom nav ── */}
      <BottomNav />
    </>
  );
}

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#024E3F] dark:bg-gray-900 border-t border-white/10">
      <div className="flex items-center justify-around">
        {menu.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path}
              className="flex flex-col items-center gap-0.5 py-3 flex-1"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                ${isActive ? "bg-white/15" : "bg-transparent"}`}>
                <Icon size={20} className={isActive ? "text-[#FCDA59]" : "text-white/40"} />
              </div>
              <span className={`text-[10px] font-medium transition-colors
                ${isActive ? "text-[#FCDA59]" : "text-white/40"}`}>
                {name}
              </span>
            </Link>
          );
        })}

        {/* Cerrar sesión en bottom nav */}
        <button
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          className="flex flex-col items-center gap-0.5 py-3 flex-1"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-transparent">
            <LogOut size={20} className="text-white/40" />
          </div>
          <span className="text-[10px] font-medium text-white/40">Salir</span>
        </button>
      </div>
    </nav>
  );
}