import React from "react";

export default function PredictedRiskChart() {
  const weeks = [
    {
      label: "Week 1",
      kalli: 0.90,
      ottan: 0.72,
      poosari: 0.58,
      vellala: 0.32
    },
    {
      label: "Week 2",
      kalli: 0.60,
      ottan: 0.55,
      poosari: 0.46,
      vellala: 0.25
    },
    {
      label: "Week 3",
      kalli: 0.58,
      ottan: 0.52,
      poosari: 0.45,
      vellala: 0.20
    },
    {
      label: "Week 4",
      kalli: 0.48,
      ottan: 0.42,
      poosari: 0.35,
      vellala: 0.18
    }
  ];

  const villages = [
    { key: "kalli", name: "Kallimandayam", color: "#ef4444" },
    { key: "ottan", name: "Ottanchathiram", color: "#f59e0b" },
    { key: "poosari", name: "Poosaripatti", color: "#3b82f6" },
    { key: "vellala", name: "Vellalapatti", color: "#10b981" }
  ];

  const chartHeight = 100;
  const yOffset = 15;

  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>🔔</span>
          <div>
            <span className="card-title">Predicted Risk</span>
            <span style={{ fontSize: "0.78rem", color: "#64748b", marginLeft: "6px" }}>(Next 4 Weeks)</span>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "150px" }}>
        <svg viewBox="0 0 280 145" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Y Axis Grid & Labels */}
          {[0.0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
            const y = yOffset + chartHeight - val * chartHeight;
            return (
              <g key={val}>
                <text x="24" y={y + 3} textAnchor="end" fontSize="7" fill="#94a3b8" fontWeight="600">
                  {val.toFixed(1)}
                </text>
                <line x1="28" y1={y} x2="270" y2={y} stroke="#f1f5f9" strokeWidth="1" />
              </g>
            );
          })}

          {/* Y Axis Title */}
          <text 
            transform="rotate(-90)" 
            x="-70" 
            y="9" 
            textAnchor="middle" 
            fontSize="6.5" 
            fill="#94a3b8" 
            fontWeight="600"
          >
            Risk Score
          </text>

          {/* Clustered Bars for 4 Weeks */}
          {weeks.map((w, wIdx) => {
            const groupX = 40 + wIdx * 58;
            const barWidth = 10;
            const barGap = 2;

            return (
              <g key={w.label}>
                {villages.map((v, vIdx) => {
                  const score = w[v.key];
                  const barH = score * chartHeight;
                  const barX = groupX + vIdx * (barWidth + barGap);
                  const barY = yOffset + chartHeight - barH;

                  return (
                    <rect
                      key={v.key}
                      x={barX}
                      y={barY}
                      width={barWidth}
                      height={barH}
                      fill={v.color}
                      rx="2"
                    >
                      <title>{`${v.name} (${w.label}): Risk ${score.toFixed(2)}`}</title>
                    </rect>
                  );
                })}

                {/* X Axis Label */}
                <text
                  x={groupX + 22}
                  y={yOffset + chartHeight + 14}
                  textAnchor="middle"
                  fontSize="7.5"
                  fill="#64748b"
                  fontWeight="700"
                >
                  {w.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Villages Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "10px", fontSize: "0.7rem", fontWeight: 600 }}>
        {villages.map((v) => (
          <div key={v.key} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: v.color }}></span>
            <span style={{ color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {v.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
