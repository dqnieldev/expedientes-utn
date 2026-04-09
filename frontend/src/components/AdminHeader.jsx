import { Bell, Sun, Moon, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminHeader({ title }) {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [admin, setAdmin] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setAdmin(user);
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">

      <div>
        <h1 className="text-xl font-semibold text-[#1a2744] dark:text-white">{title}</h1>
        <p className="text-xs text-gray-400 mt-0.5">Panel de Administración</p>
      </div>

      <div className="flex items-center gap-4">


        {/* DARK MODE */}
        <button
          onClick={() => setDark(prev => !prev)}
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex transition-colors duration-200"
        >
          <Sun size={16} className={!dark ? "text-yellow-500" : "text-gray-400"} />
          <Moon size={16} className={dark ? "text-blue-400" : "text-gray-400"} />
        </button>

        {/* ADMIN BADGE */}
        <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 px-3 py-1.5 rounded-xl">
          <div className="w-6 h-6 rounded-lg bg-[#1a2744] flex items-center justify-center">
            <ShieldCheck size={13} className="text-blue-300" />
          </div>
          <div>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide leading-none">
              Administrador
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              {admin?.email || ""}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}