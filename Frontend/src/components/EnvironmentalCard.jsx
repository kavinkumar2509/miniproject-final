import React from "react";

export default function EnvironmentalCard() {
  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>🌐</span>
          <span className="card-title">Environmental Indicators</span>
        </div>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            background: "#ecfdf5",
            color: "#10b981",
            padding: "2px 8px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
          Live Data
        </span>
      </div>

      <div className="env-indicators-row">
        {/* Temperature */}
        <div className="env-stat-box">
          <div className="env-stat-label">Temperature</div>
          <div className="env-stat-main">
            <span className="env-stat-icon" style={{ color: "#ef4444" }}>🌡️</span>
            <span className="env-stat-value">31.2 <span style={{ fontSize: "0.8rem" }}>°C</span></span>
          </div>
          <span className="env-stat-badge kpi-badge-red">↑ +1.5°C</span>
        </div>

        {/* Humidity */}
        <div className="env-stat-box">
          <div className="env-stat-label">Humidity</div>
          <div className="env-stat-main">
            <span className="env-stat-icon" style={{ color: "#3b82f6" }}>💧</span>
            <span className="env-stat-value">72 <span style={{ fontSize: "0.8rem" }}>%</span></span>
          </div>
          <span className="env-stat-badge kpi-badge-green">Normal</span>
        </div>

        {/* Rainfall (24h) */}
        <div className="env-stat-box">
          <div className="env-stat-label">Rainfall (24h)</div>
          <div className="env-stat-main">
            <span className="env-stat-icon" style={{ color: "#2563eb" }}>🌧️</span>
            <span className="env-stat-value">12 <span style={{ fontSize: "0.8rem" }}>mm</span></span>
          </div>
          <span className="env-stat-badge kpi-badge-red">↑ +8 mm</span>
        </div>

        {/* Water Quality */}
        <div className="env-stat-box">
          <div className="env-stat-label">Water Quality</div>
          <div className="env-stat-main">
            <span className="env-stat-icon" style={{ color: "#f59e0b" }}>🚰</span>
            <span className="env-stat-value" style={{ fontSize: "0.95rem", color: "#d97706" }}>Caution</span>
          </div>
          <span className="env-stat-badge kpi-badge-amber">High Turbidity</span>
        </div>
      </div>
    </div>
  );
}
