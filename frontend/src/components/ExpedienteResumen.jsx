import { useNavigate } from "react-router-dom";
import { ExternalLink, HelpCircle } from "lucide-react";


const TOTAL = 4;
const C = 289;

export default function ExpedienteResumen({ docs = [], showButton = true }) {
  const navigate = useNavigate();

  const aprobados  = docs.filter(d => d.estado === "APROBADO").length;
  const enRevision = docs.filter(d => d.estado === "EN_REVISION").length;
  const rechazados = docs.filter(d => d.estado === "RECHAZADO").length;
  const pendientes = TOTAL - aprobados - enRevision - rechazados;
  const subidos    = aprobados + enRevision + rechazados;

  const seg = (n) => Math.round((n / TOTAL) * C);

  const aprobadosArc  = seg(aprobados);
  const enRevisionArc = seg(enRevision);
  const rechazadosArc = seg(rechazados);

  const offsetAprobados  = 0;
  const offsetEnRevision = aprobadosArc;
  const offsetRechazados = aprobadosArc + enRevisionArc;

  const arc = (length, offset) => ({
    strokeDasharray: `${length} ${C}`,
    strokeDashoffset: -offset,
  });

  const porcentaje = Math.round((aprobados/ TOTAL) * 100);

  return (
    <div className="flex flex-col gap-4">

      {/* DONUT + STATS */}
      <div className="flex items-center gap-5">

        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 90, height: 90 }}>
          <svg width="90" height="90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="#F3F4F6" strokeWidth="10" />
            {aprobados > 0 && (
              <circle cx="60" cy="60" r="46" fill="none"
                stroke="#1D9E75" strokeWidth="10" strokeLinecap="butt"
                {...arc(aprobadosArc, offsetAprobados)}
                transform="rotate(-90 60 60)" />
            )}
            {enRevision > 0 && (
              <circle cx="60" cy="60" r="46" fill="none"
                stroke="#EF9F27" strokeWidth="10" strokeLinecap="butt"
                {...arc(enRevisionArc, offsetEnRevision)}
                transform="rotate(-90 60 60)" />
            )}
            {rechazados > 0 && (
              <circle cx="60" cy="60" r="46" fill="none"
                stroke="#E24B4A" strokeWidth="10" strokeLinecap="butt"
                {...arc(rechazadosArc, offsetRechazados)}
                transform="rotate(-90 60 60)" />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-semibold text-gray-800 leading-none">{subidos}/{TOTAL}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">docs</span>
          </div>
        </div>

        {/* RESUMEN RÁPIDO */}
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Progreso</span>
              <span className="text-[10px] font-semibold text-gray-600">{porcentaje}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className="bg-emerald-50 rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-emerald-600 font-medium">Aprobados</p>
              <p className="text-sm font-semibold text-emerald-700">{aprobados}</p>
            </div>
            <div className="bg-amber-50 rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-amber-600 font-medium">En revisión</p>
              <p className="text-sm font-semibold text-amber-700">{enRevision}</p>
            </div>
            <div className="bg-red-50 rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-red-500 font-medium">Rechazados</p>
              <p className="text-sm font-semibold text-red-600">{rechazados}</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-2 py-1.5">
              <p className="text-[10px] text-gray-400 font-medium">Pendientes</p>
              <p className="text-sm font-semibold text-gray-500">{pendientes}</p>
            </div>
          </div>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-100" />

      {/* BOTÓN */}
      {showButton && (
        <button
          onClick={() => navigate("/documentos")}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-150"
        >
          Gestionar documentos
          <ExternalLink size={13} />
        </button>
      )}

      {/* SOPORTE */}
<div className="mt-auto pt-2">
  <div className="border border-dashed border-gray-200 rounded-xl p-3 flex flex-col gap-2">
    <p className="text-[11px] text-gray-400 leading-relaxed">
      ¿Tienes dudas sobre el estado de tus documentos o necesitas aclarar un rechazo?
    </p>
    <button
      onClick={() => navigate("/soporte")}
      className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-medium hover:bg-amber-100 active:scale-95 transition-all duration-150"
    >
      <HelpCircle size={12} />
      Contactar a Servicios Escolares
    </button>
  </div>
</div>
    </div>
  );
}