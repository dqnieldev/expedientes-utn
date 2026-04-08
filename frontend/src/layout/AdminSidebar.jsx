import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  LogOut,
  ShieldCheck,
  DatabaseBackup
} from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard",  path: "/admin/dashboard", icon: LayoutDashboard, desc: "Resumen general" },
    { name: "Alumnos",    path: "/admin/alumnos",   icon: Users,            desc: "Gestionar alumnos" },
    { name: "Documentos", path: "/admin/documentos",icon: FileCheck,        desc: "Validar expedientes" },
    { name: "Respaldos",  path: "/admin/respaldos",   icon: DatabaseBackup,  desc: "Gestionar respaldos DB"},
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#1a2744] h-full transition-colors duration-200">

      {/* LOGO + ROL */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <img
          src="/imagenes/logo_admin.png"
          alt="Logo UTN"
          className="w-28 h-auto mb-3"
        />
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <ShieldCheck size={13} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium leading-none">
              Panel de
            </p>
            <p className="text-xs font-semibold text-white/70 leading-tight">
              Administrador
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-1">

        <p className="text-xs uppercase tracking-widest text-white/20 font-medium px-3 mb-3">
          Navegación
        </p>

        {menu.map(({ name, path, icon: Icon, desc }) => {
          const isActive = location.pathname === path ||
            (path !== "/admin/dashboard" && location.pathname.startsWith(path));

          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:bg-white/8 hover:text-white"
                }`}
            >
              <span className={`w-1 h-6 rounded-full transition-all duration-200 shrink-0 ${isActive ? "bg-blue-400" : "bg-transparent"}`} />

              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
                ${isActive ? "bg-blue-500/20" : "bg-white/5 group-hover:bg-white/10"}`}>
                <Icon size={16} className={isActive ? "text-blue-300" : "text-white/50 group-hover:text-white"} />
              </div>

              <div>
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className={`text-[10px] mt-0.5 transition-colors duration-200 ${isActive ? "text-white/50" : "text-white/30 group-hover:text-white/40"}`}>
                  {desc}
                </p>
              </div>
            </Link>
          );
        })}

      </nav>

      {/* DIVIDER */}
      <div className="mx-4 border-t border-white/10" />

      {/* BOTTOM */}
      <div className="px-3 py-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:bg-white/8 hover:text-white transition-all duration-200 group"
        >
          <span className="w-1 h-6 rounded-full bg-transparent shrink-0" />
          <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center shrink-0 transition-colors duration-200">
            <LogOut size={16} className="group-hover:text-red-400 transition-colors duration-200" />
          </div>
          <p className="text-sm font-medium">Cerrar Sesión</p>
        </button>
      </div>

    </aside>
  );
}