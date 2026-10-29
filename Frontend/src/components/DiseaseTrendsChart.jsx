import React, { useState } from "react";

export default function DiseaseTrendsChart() {
  const [selectedDisease, setSelectedDisease] = useState("All");

  const diseases = [
    { name: "Dengue", color: "#ef4444", points: [6, 9, 12, 18, 23, 20, 29, 38, 42, 33, 29] },
    { name: "Chikungunya", color: "#3b82f6", points: [2, 4, 3, 7, 8, 8, 11, 14, 15, 12, 15] },
    { name: "Diarrhea", color: "#10b981", points: [3, 4, 6, 8, 8, 10, 15, 23, 23, 22, 27] },
    { name: "Typhoid", color: "#f59e0b", points: [1, 2, 3, 4, 5, 4, 6, 8, 7, 7, 6] }
  ];

  // SVG grid sizing: width 340, height 130
  const maxCases = 50;
  const chartHeight = 110;
  const chartWidth = 300;
  const xOffset = 35;
  const yOffset = 15;

  const getCoordinates = (points) => {
    return points.map((val, idx) => {
      const x = xOffset + (idx / (points.length - 1)) * (chartWidth - xOffset);
      const y = yOffset + chartHeight - (val / maxCases) * chartHeight;
      return { x, y, val };
    });
  };

  const filteredDiseases = selectedDisease === "All" 
    ? diseases 
    : diseases.filter(d => d.name === selectedDisease);

  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>🕸️</span>
          <div>
            <span className="card-title">Disease Trends</span>
            <span style={{ fontSize: "0.78rem", color: "#64748b", marginLeft: "6px" }}>(Last 12 Weeks)</span>
          </div>
        </div>
        <select
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          style={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#0f172a",
            fontWeight: 600,
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="All">All Diseases</option>
          <option value="Dengue">Dengue</option>
          <option value="Chikungunya">Chikungunya</option>
          <option value="Diarrhea">Diarrhea</option>
          <option value="Typhoid">Typhoid</option>
        </select>
      </div>

      <div style={{ position: "relative", width: "100%", height: "150px" }}>
        <svg viewBox="0 0 320 145" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Y-Axis Labels & Grid Lines */}
          {[0, 10, 20, 30, 40, 50].map((val) => {
            const y = yOffset + chartHeight - (val / maxCases) * chartHeight;
            return (
              <g key={val}>
                <text x="26" y={y + 3} textAnchor="end" fontSize="7.5" fill="#94a3b8" fontWeight="600">
                  {val}
                </text>
                <line x1="32" y1={y} x2={chartWidth + 8} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              </g>
            );
          })}

          {/* Y Axis Title */}
          <text 
            transform="rotate(-90)" 
            x="-75" 
            y="9" 
            textAnchor="middle" 
            fontSize="6.5" 
            fill="#94a3b8" 
            fontWeight="600"
          >
            Number of Cases
          </text>

          {/* Disease Lines */}
          {filteredDiseases.map((d) => {
            const coords = getCoordinates(d.points);
            const pathData = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`, "");

            return (
              <g key={d.name}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {coords.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i % 2 === 0 ? "2.5" : "1.8"}
                    fill={d.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                  >
                    <title>{`${d.name}: ${pt.val} cases`}</title>
                  </circle>
                ))}
              </g>
            );
          })}

          {/* X Axis Month Labels */}
          <text x="75" y={yOffset + chartHeight + 14} textAnchor="middle" fontSize="7.5" fill="#64748b" fontWeight="700">
            Aug
          </text>
          <text x="175" y={yOffset + chartHeight + 14} textAnchor="middle" fontSize="7.5" fill="#64748b" fontWeight="700">
            Sep
          </text>
          <text x="275" y={yOffset + chartHeight + 14} textAnchor="middle" fontSize="7.5" fill="#64748b" fontWeight="700">
            Oct
          </text>
        </svg>
      </div>

      {/* Disease Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "10px", fontSize: "0.72rem", fontWeight: 600 }}>
        {diseases.map((d) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color }}></span>
            <span style={{ color: "#475569" }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
