import React from "react";

export default function SymptomsChart({ symptomsData = [] }) {
  const defaultSymptoms = [
    { name: "Fever", count: 142, color: "#ef4444" },
    { name: "Diarrhea", count: 96, color: "#3b82f6" },
    { name: "Cough", count: 78, color: "#10b981" },
    { name: "Body Pain", count: 64, color: "#f59e0b" },
    { name: "Skin Rash", count: 41, color: "#8b5cf6" }
  ];

  const items = symptomsData.length > 0 ? symptomsData : defaultSymptoms;
  const maxCount = 160;

  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>⭐</span>
          <span className="card-title">Top Reported Symptoms</span>
        </div>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            background: "#eff6ff",
            color: "#2563eb",
            padding: "2px 8px",
            borderRadius: "4px"
          }}
        >
          Last 30 Days
        </span>
      </div>

      <div className="symptoms-bars-list" style={{ marginTop: "12px" }}>
        {items.map((s) => {
          const percent = Math.min(100, Math.round((s.count / maxCount) * 100));
          return (
            <div key={s.name} className="symptom-row">
              <span className="symptom-label">{s.name}</span>
              <div className="symptom-bar-track">
                <div
                  className="symptom-bar-fill"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: s.color
                  }}
                />
              </div>
              <span className="symptom-count">{s.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
