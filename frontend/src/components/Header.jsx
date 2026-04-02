import { Bell, Sun, Moon, Settings } from "lucide-react";
import { useState } from "react";

export default function Header({ title }) {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b">

      {/* TITLE */}
      <h1 className="text-xl font-semibold text-primary">
        {title}
      </h1>

      {/* ACTIONS */}
      <div className="flex items-center gap-4">

        {/* NOTIFICACIONES */}
        <button className="relative text-gray-500 hover:text-black">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>

        {/* DARK MODE */}
        <button
          onClick={toggleDark}
          className="bg-gray-200 rounded-full p-1 flex"
        >
          <Sun size={16} className={!dark ? "text-black" : "text-gray-400"} />
          <Moon size={16} className={dark ? "text-black" : "text-gray-400"} />
        </button>

        {/* SETTINGS */}
        <button className="text-gray-500 hover:text-black">
          <Settings size={20} />
        </button>

        {/* AVATAR */}
        <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

      </div>

    </header>
  );
}