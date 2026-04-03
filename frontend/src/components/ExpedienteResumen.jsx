import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const TOTAL = 4;
const C = 289; // 2π * 46

export default function ExpedienteResumen({ docs = [] }) {
  const navigate = useNavigate();

  const aprobados  = docs.filter(d => d.estado === "APROBADO").length;
  const enRevision = docs.filter(d => d.estado === "EN_REVISION").length;
  const rechazados = docs.filter(d => d.estado === "RECHAZADO").length;
  const pendientes = TOTAL - aprobados - enRevision - rechazados;
  const subidos    = aprobados + enRevision + rechazados;

  // Cada segmento ocupa su proporción de la circunferencia
  const seg = (n) => Math.round((n / TOTAL) * C);

  const aprobadosArc  = seg(aprobados);
  const enRevisionArc = seg(enRevision);
  const rechazadosArc = seg(rechazados);

  // Cada arco empieza donde termina el anterior (en grados, rotando desde -90)
  const offsetAprobados  = 0;
  const offsetEnRevision = aprobadosArc;
  const offsetRechazados = aprobadosArc + enRevisionArc;

  // strokeDasharray: "longitud_arco circunferencia_total"
  // strokeDashoffset: desplaza el inicio del arco (negativo para avanzar)
  const arc = (length, offset) => ({
    strokeDasharray: `${length} ${C}`,
    strokeDashoffset: -offset,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>

      {/* Donut */}
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">

          {/* Track gris */}
          <circle cx="60" cy="60" r="46" fill="none"
            stroke="#D1D5DB" strokeWidth="10" />

          {/* Aprobados — verde */}
          {aprobados > 0 && (
            <circle cx="60" cy="60" r="46" fill="none"
              stroke="#1D9E75" strokeWidth="10" strokeLinecap="butt"
              {...arc(aprobadosArc, offsetAprobados)}
              transform="rotate(-90 60 60)" />
          )}

          {/* En revisión — amarillo */}
          {enRevision > 0 && (
            <circle cx="60" cy="60" r="46" fill="none"
              stroke="#EF9F27" strokeWidth="10" strokeLinecap="butt"
              {...arc(enRevisionArc, offsetEnRevision)}
              transform="rotate(-90 60 60)" />
          )}

          {/* Rechazados — rojo */}
          {rechazados > 0 && (
            <circle cx="60" cy="60" r="46" fill="none"
              stroke="#E24B4A" strokeWidth="10" strokeLinecap="butt"
              {...arc(rechazadosArc, offsetRechazados)}
              transform="rotate(-90 60 60)" />
          )}

        </svg>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>
            {subidos}/{TOTAL}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>docs</span>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
        {[
          { label: "Aprobados",   color: "#1D9E75", count: aprobados  },
          { label: "En revisión", color: "#EF9F27", count: enRevision },
          { label: "Rechazados",  color: "#E24B4A", count: rechazados },
          { label: "Pendientes",  color: "#D1D5DB", count: pendientes },
        ].map(({ label, color, count }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
              {label}
            </span>
            <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Botón */}
      <button
        onClick={() => navigate("/documentos")}
        className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-[#007a46] transition-colors flex items-center justify-center gap-2"
      >
        <ExternalLink size={20} />

        Gestionar documentos
        
      </button>

    </div>
  );
}