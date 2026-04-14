import { Sun, Moon, Camera, Languages } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function Header({ title }) {
  const { t, i18n } = useTranslation();
  const isEN = i18n.language === "en";

  const [dark,  setDark]  = useState(() => localStorage.getItem("theme") === "dark");
  const [foto,  setFoto]  = useState(null);
  const [hover, setHover] = useState(false);
  const inputRef = useRef();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/alumnos/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (res.data.foto)
        setFoto(`http://localhost:3000/uploads/${res.data.foto}`);
    }).catch(() => {});
  }, []);

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("foto", file);
    try {
      const res = await axios.put(
        "http://localhost:3000/api/alumnos/foto",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFoto(`http://localhost:3000/uploads/${res.data.foto}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">

      <h1 className="text-xl font-semibold text-primary">{title}</h1>

      <div className="flex items-center gap-3">

        {/* SWITCH IDIOMA */}
        <button
          onClick={() => i18n.changeLanguage(isEN ? "es" : "en")}
          title={t("header.switchLang")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Languages size={14} className="text-gray-500 dark:text-gray-400" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
            {isEN ? "ES" : "EN"}
          </span>
        </button>

        {/* DARK MODE */}
        <button
          onClick={() => setDark(prev => !prev)}
          className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex transition-colors duration-200"
        >
          <Sun  size={16} className={!dark ? "text-yellow-500" : "text-gray-400"} />
          <Moon size={16} className={dark  ? "text-blue-400"   : "text-gray-400"} />
        </button>

        {/* AVATAR */}
        <div
          className="relative w-9 h-9 rounded-full cursor-pointer overflow-hidden"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => inputRef.current.click()}
          title={t("header.changePhoto")}
        >
          {foto ? (
            <img src={foto} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full" />
          )}
          {hover && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full">
              <Camera size={12} className="text-white" />
              <span className="text-white text-[8px] font-medium leading-tight text-center px-1">
                {t("header.changePhoto")}
              </span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFotoChange}
        />
      </div>
    </header>
  );
}