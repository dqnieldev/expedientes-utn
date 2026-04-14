import { Link, useLocation } from "react-router-dom";
import { DatabaseBackup, ShieldCheck, UserPlus, LogOut, Code2 } from "lucide-react";

const menu = [
  { name: "Respaldos",  path: "/developer/respaldos", icon: DatabaseBackup, desc: "Gestionar respaldos DB"   },
  { name: "Auditoría",  path: "/developer/auditoria", icon: ShieldCheck,    desc: "Logs del sistema"         },
  { name: "Administradores", path: "/developer/admins", icon: UserPlus,     desc: "Crear cuentas de admin"   },
];

export default function DeveloperSidebar() {
  return (
    <>
      {/* ── DESKTOP ── */}
      <aside className="hidden md:flex w-64 flex-col bg-[#1e1b4b] h-full">

        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <img src="/imagenes/logo_admin.png" alt="Logo UTN" className="w-28 h-auto mb-3" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
              <Code2 size={13} className="text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium leading-none">Panel de</p>
              <p className="text-xs font-semibold text-white/70 leading-tight">Desarrollador</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-xs uppercase tracking-widest text-white/20 font-medium px-3 mb-3">
            Herramientas
          </p>
          {menu.map(({ name, path, icon: Icon, desc }) => {
            const isActive = useLocation().pathname === path ||
              useLocation().pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-white/15 text-white" : "text-white/50 hover:bg-white/8 hover:text-white"}`}
              >
                <span className={`w-1 h-6 rounded-full shrink-0 ${isActive ? "bg-violet-400" : "bg-transparent"}`} />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                  ${isActive ? "bg-violet-500/20" : "bg-white/5 group-hover:bg-white/10"}`}>
                  <Icon size={16} className={isActive ? "text-violet-300" : "text-white/50 group-hover:text-white"} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className={`text-[10px] mt-0.5 ${isActive ? "text-white/50" : "text-white/30"}`}>{desc}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 border-t border-white/10" />

        <div className="px-3 py-4">
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/40 hover:bg-white/8 hover:text-white transition-all group"
          >
            <span className="w-1 h-6 rounded-full bg-transparent shrink-0" />
            <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/20 flex items-center justify-center shrink-0 transition-colors">
              <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
            </div>
            <p className="text-sm font-medium">Cerrar Sesión</p>
          </button>
        </div>

      </aside>

      {/* ── MÓVIL ── */}
      <DeveloperBottomNav />
    </>
  );
}

function DeveloperBottomNav() {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#1e1b4b] border-t border-white/10">
      <div className="flex items-center justify-around">
        {menu.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 py-3 flex-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                ${isActive ? "bg-violet-500/20" : "bg-transparent"}`}>
                <Icon size={20} className={isActive ? "text-violet-300" : "text-white/40"} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-violet-300" : "text-white/40"}`}>
                {name}
              </span>
            </Link>
          );
        })}
        <button
          onClick={() => { localStorage.clear(); window.location.href = "/"; }}
          className="flex flex-col items-center gap-0.5 py-3 flex-1"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center">
            <LogOut size={20} className="text-white/40" />
          </div>
          <span className="text-[10px] font-medium text-white/40">Salir</span>
        </button>
      </div>
    </nav>
  );
}