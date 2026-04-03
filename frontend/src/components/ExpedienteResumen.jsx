import { useNavigate } from "react-router-dom";

const TOTAL = 4;

export default function ExpedienteResumen({ docs = [] }) {
  const navigate = useNavigate();

  const aprobados   = docs.filter(d => d.estado === "APROBADO").length;
  const enRevision  = docs.filter(d => d.estado === "EN_REVISION").length;
  const pendientes  = TOTAL - aprobados - enRevision;

  // Donut: circunferencia = 2π * 46 ≈ 289
  const C = 289;
  const subidos = aprobados + enRevision;
  const filled  = Math.round((subidos / TOTAL) * C);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>

      {/* Donut */}
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="46" fill="none"
            stroke="var(--color-border-tertiary)" strokeWidth="10" />
          <circle cx="60" cy="60" r="46" fill="none"
            stroke="#1D9E75" strokeWidth="10"
            strokeDasharray={`${filled} ${C - filled}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)" />
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
          { label: "Pendientes",  color: "var(--color-border-secondary)", count: pendientes },
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
        className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-[#007a46] transition-colors"
      >
        Gestionar documentos
      </button>

    </div>
  );
}