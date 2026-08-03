import React, { useState, useEffect } from "react";
import { Clock, Calendar as CalendarIcon, Info, Sparkles } from "lucide-react";

// Categorías de eventos y colores oficiales exactamente según la simbología oficial UTN
const EVENT_TYPES = {
  inicio: {
    label: "INICIO DE CUATRIMESTRE / REINSCRIPCIONES",
    color: "bg-emerald-500 text-white font-bold rounded-full shadow-sm ring-2 ring-emerald-300",
    dot: "bg-emerald-500 rounded-full",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
  },
  fin: {
    label: "FIN DE CUATRIMESTRE",
    color: "bg-red-600 text-white font-bold shadow-sm",
    dot: "bg-red-600",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300"
  },
  asueto: {
    label: "ASUETO",
    color: "bg-pink-400 text-white font-semibold",
    dot: "bg-pink-400",
    badge: "bg-pink-100 text-pink-800 dark:bg-pink-900/60 dark:text-pink-300"
  },
  examenes_ordinarios: {
    label: "EXÁMENES ORDINARIOS",
    color: "bg-blue-600 text-white font-semibold",
    dot: "bg-blue-600",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
  },
  examenes_remediales: {
    label: "EXÁMENES REMEDIALES",
    color: "bg-slate-800 text-white font-semibold",
    dot: "bg-slate-800",
    badge: "bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-200"
  },
  examenes_extraordinarios: {
    label: "EXÁMENES EXTRAORDINARIOS",
    color: "bg-yellow-300 text-gray-900 font-extrabold",
    dot: "bg-yellow-300",
    badge: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/60 dark:text-yellow-300"
  },
  entrega_calificaciones: {
    label: "ENTREGA DE CALIFICACIONES A SER. ESC.",
    color: "bg-lime-600 text-white font-semibold",
    dot: "bg-lime-600",
    badge: "bg-lime-100 text-lime-800 dark:bg-lime-900/60 dark:text-lime-300"
  },
  asesorias: {
    label: "ASESORÍAS",
    color: "bg-amber-500 text-white font-semibold",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
  },
  vacaciones: {
    label: "VACACIONES",
    color: "bg-teal-700 text-white font-semibold",
    dot: "bg-teal-700",
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-300"
  },
  becas: {
    label: "REGISTRO BECAS UT",
    color: "bg-amber-900 text-white font-semibold",
    dot: "bg-amber-900",
    badge: "bg-amber-200 text-amber-950 dark:bg-amber-950 dark:text-amber-200"
  },
  examen_admision: {
    label: "EXAMEN DE ADMISIÓN",
    color: "bg-emerald-600 text-white font-bold border border-emerald-200",
    dot: "bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    icon: "📝"
  },
  dia_tsu: {
    label: "DÍA DEL ESTUDIANTE TSU",
    color: "bg-amber-400 text-gray-900 font-black rounded-full border-2 border-amber-500 shadow-xs",
    dot: "bg-amber-400 rounded-full",
    badge: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    icon: "TSU"
  },
  curso_propedeutico: {
    label: "CURSO PROPEDÉUTICO",
    color: "bg-purple-800 text-white font-semibold",
    dot: "bg-purple-800",
    badge: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200"
  },
  reingreso: {
    label: "TRÁMITE DE REINGRESO",
    color: "bg-emerald-800 text-white font-bold ring-2 ring-emerald-400",
    dot: "bg-emerald-800",
    badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    icon: "⬡"
  }
};

// Días destacados por mes según la imagen oficial (Año 2026)
const CALENDAR_EVENTS = {
  // MAYO 2026
  4: {
    1: { type: "asueto", label: "Asueto" },
    4: { type: "asueto", label: "Asueto" },
    5: { type: "inicio", label: "Inicio de Cuatrimestre / Reinscripciones" },
    11: { type: "asueto", label: "Asueto" },
    15: { type: "asueto", label: "Asueto" }
  },
  // JUNIO 2026
  5: {
    1: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    2: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    3: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    4: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    8: { type: "asesorias", label: "Asesorías" },
    9: { type: "asesorias", label: "Asesorías" },
    10: { type: "asesorias", label: "Asesorías" },
    12: { type: "dia_tsu", label: "Día del Estudiante TSU" },
    15: { type: "examenes_remediales", label: "Exámenes Remediales" },
    16: { type: "examenes_remediales", label: "Exámenes Remediales" },
    18: { type: "examen_admision", label: "Examen de Admisión / Reingreso" },
    22: { type: "examenes_extraordinarios", label: "Exámenes Extraordinarios" },
    29: { type: "entrega_calificaciones", label: "Entrega de Calificaciones a Ser. Esc." },
    30: { type: "entrega_calificaciones", label: "Entrega de Calificaciones a Ser. Esc." }
  },
  // JULIO 2026
  6: {
    1: { type: "becas", label: "Registro Becas UT" },
    2: { type: "becas", label: "Registro Becas UT" },
    3: { type: "becas", label: "Registro Becas UT" },
    6: { type: "becas", label: "Registro Becas UT" },
    7: { type: "becas", label: "Registro Becas UT" },
    8: { type: "becas", label: "Registro Becas UT" },
    9: { type: "becas", label: "Registro Becas UT" },
    10: { type: "becas", label: "Registro Becas UT" },
    13: { type: "vacaciones", label: "Vacaciones" },
    14: { type: "vacaciones", label: "Vacaciones" },
    15: { type: "vacaciones", label: "Vacaciones" },
    16: { type: "vacaciones", label: "Vacaciones" },
    17: { type: "vacaciones", label: "Vacaciones" },
    20: { type: "vacaciones", label: "Vacaciones" },
    21: { type: "vacaciones", label: "Vacaciones" },
    22: { type: "vacaciones", label: "Vacaciones" },
    23: { type: "vacaciones", label: "Vacaciones" },
    24: { type: "vacaciones", label: "Vacaciones" },
    27: { type: "vacaciones", label: "Vacaciones" },
    28: { type: "vacaciones", label: "Vacaciones" },
    29: { type: "vacaciones", label: "Vacaciones" },
    30: { type: "vacaciones", label: "Vacaciones" },
    31: { type: "vacaciones", label: "Vacaciones" }
  },
  // AGOSTO 2026
  7: {
    3: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    4: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    5: { type: "examenes_ordinarios", label: "Exámenes Ordinarios" },
    10: { type: "reingreso", label: "Trámite de Reingreso" },
    11: { type: "asesorias", label: "Asesorías" },
    12: { type: "asesorias", label: "Asesorías" },
    13: { type: "examen_admision", label: "Examen de Admisión" },
    17: { type: "examenes_remediales", label: "Exámenes Remediales" },
    18: { type: "examenes_remediales", label: "Exámenes Remediales" },
    20: { type: "examenes_extraordinarios", label: "Exámenes Extraordinarios" },
    21: { type: "examenes_extraordinarios", label: "Exámenes Extraordinarios" },
    24: { type: "curso_propedeutico", label: "Curso Propedéutico" },
    25: { type: "curso_propedeutico", label: "Curso Propedéutico" },
    26: { type: "entrega_calificaciones", label: "Entrega de Calificaciones a Ser. Esc." },
    27: { type: "fin", label: "Fin de Cuatrimestre" }
  }
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function CuatrimestreCalendar() {
  const [now, setNow] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (date) => {
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  const formatDateLong = (date) => {
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getMonthGrid = (year, monthIndex) => {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDay.getDate();
    const cells = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push(null);
    }

    for (let d = 1; d <= totalDays; d++) {
      cells.push(d);
    }

    return cells;
  };

  const isToday = (year, monthIndex, day) => {
    return (
      now.getFullYear() === year &&
      now.getMonth() === monthIndex &&
      now.getDate() === day
    );
  };

  const renderMonthCard = (monthIndex) => {
    const year = 2026;
    const cells = getMonthGrid(year, monthIndex);
    const eventsInMonth = CALENDAR_EVENTS[monthIndex] || {};

    return (
      <div
        key={monthIndex}
        className="bg-gray-50 dark:bg-gray-900/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700/60 shadow-sm flex flex-col justify-between"
      >
        {/* Cabecera del Mes */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 dark:border-gray-700/60 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
              {MONTH_NAMES[monthIndex]} {year}
            </h4>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Cuatrimestre Mayo-Ago
          </span>
        </div>

        {/* Encabezado Días de Semana */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((day, idx) => (
            <span
              key={idx}
              className={`text-xs font-bold ${
                idx >= 5 ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Rejilla de Días */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-8" />;
            }

            const event = eventsInMonth[day];
            const eventConfig = event ? EVENT_TYPES[event.type] : null;
            const today = isToday(year, monthIndex, day);

            let dayStyle = "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200";
            if (eventConfig) {
              dayStyle = `${eventConfig.color}`;
            }

            return (
              <button
                key={day}
                onClick={() =>
                  event
                    ? setSelectedDay({ day, month: MONTH_NAMES[monthIndex], year, ...event })
                    : setSelectedDay({ day, month: MONTH_NAMES[monthIndex], year, label: "Día Laboral / Regular" })
                }
                className={`relative h-8 w-full transition-all duration-150 flex items-center justify-center ${
                  eventConfig?.shape === "circle" ? "rounded-full" : "rounded-lg"
                } ${dayStyle} ${
                  today ? "ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-900 font-bold scale-105" : ""
                }`}
                title={event ? `${day} de ${MONTH_NAMES[monthIndex]}: ${event.label}` : `${day} de ${MONTH_NAMES[monthIndex]}`}
              >
                <span>{day}</span>
                {eventConfig?.icon && (
                  <span className="absolute -top-1 -right-1 text-[8px] font-black leading-none bg-black/40 text-white px-0.5 rounded">
                    {eventConfig.icon}
                  </span>
                )}
                {today && (
                  <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const activeMonths = [4, 5, 6, 7];

  return (
    <div className="flex flex-col space-y-6">
      
      {/* CABECERA: RELOJ EN VIVO Y TITULO */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
              <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                Calendario Institucional
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">
              Cuatrimestre Mayo - Agosto 2026
            </h3>
            <p className="text-xs md:text-sm text-emerald-100 mt-1 capitalize">
              {formatDateLong(now)}
            </p>
          </div>

          {/* Widget de Reloj en Vivo */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl flex items-center space-x-3 shrink-0 shadow-inner">
            <Clock className="w-6 h-6 text-emerald-300 animate-spin-slow" />
            <div>
              <div className="text-xs text-emerald-200 font-medium">Hora Local Actual</div>
              <div className="text-xl md:text-2xl font-mono font-bold tracking-widest text-white">
                {formatClock(now)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLES DE VISTA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-bold text-gray-900 dark:text-white text-base">
            Periodo Escolar y Operativo
          </span>
        </div>

        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setViewMode("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              viewMode === "all"
                ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Vista Cuatrimestral (4 Meses)
          </button>

          {activeMonths.map((mIdx) => (
            <button
              key={mIdx}
              onClick={() => {
                setViewMode("single");
                setCurrentMonthIndex(mIdx);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "single" && currentMonthIndex === mIdx
                  ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {MONTH_NAMES[mIdx]}
            </button>
          ))}
        </div>
      </div>

      {/* EVENTO SELECCIONADO (SI EXISTE CLICK) */}
      {selectedDay && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center justify-between transition-all">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                {selectedDay.day} de {selectedDay.month} de {selectedDay.year}
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {selectedDay.label}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedDay(null)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white underline font-medium ml-4"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* VISTA DE MESES */}
      {viewMode === "all" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {activeMonths.map((mIdx) => renderMonthCard(mIdx))}
        </div>
      ) : (
        <div className="max-w-md mx-auto w-full">
          {renderMonthCard(currentMonthIndex)}
        </div>
      )}

      {/* SIMBOLOGÍA / LEYENDA DE COLORES OFICIAL */}
      <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Simbología Oficial de Eventos</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          {Object.entries(EVENT_TYPES).map(([key, config]) => (
            <div
              key={key}
              className="flex items-center space-x-2.5 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-2xs"
            >
              <span className={`w-3.5 h-3.5 shrink-0 ${config.dot}`} />
              <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
