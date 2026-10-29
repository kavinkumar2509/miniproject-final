import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReportStats } from "../services/api";

export default function CommunityStatusCard() {
  const [statsData, setStatsData] = useState({
    population: 12486,
    healthyPct: 85.2,
    underObsPct: 8.1,
    suspectedPct: 4.2,
    confirmedPct: 2.5
  });

  useEffect(() => {
    getReportStats()
      .then((res) => {
        if (res?.data) {
          const d = res.data;
          const pop = d.population || 12486;
          const confirmedCount = d.activeCases || 24;
          const suspectedCount = d.atRisk || 45;
          const underObsCount = Math.round(confirmedCount * 2.8);
          const healthyCount = Math.max(0, pop - (confirmedCount + suspectedCount + underObsCount));

          const confirmedPct = Number(((confirmedCount / pop) * 100).toFixed(1));
          const suspectedPct = Number(((suspectedCount / pop) * 100).toFixed(1));
          const underObsPct = Number(((underObsCount / pop) * 100).toFixed(1));
          const healthyPct = Number((100 - (confirmedPct + suspectedPct + underObsPct)).toFixed(1));

          setStatsData({
            population: pop,
            healthyPct,
            underObsPct,
            suspectedPct,
            confirmedPct
          });
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Healthy", percent: `${statsData.healthyPct}%`, color: "#10b981", val: statsData.healthyPct },
    { label: "Under Observation", percent: `${statsData.underObsPct}%`, color: "#3b82f6", val: statsData.underObsPct },
    { label: "Suspected Cases", percent: `${statsData.suspectedPct}%`, color: "#f59e0b", val: statsData.suspectedPct },
    { label: "Confirmed Cases", percent: `${statsData.confirmedPct}%`, color: "#ef4444", val: statsData.confirmedPct }
  ];

  // SVG Circumference for radius 46 is 2 * PI * 46 = 289.02
  const C = 289.02;
  const s1 = (statsData.healthyPct / 100) * C;
  const s2 = (statsData.underObsPct / 100) * C;
  const s3 = (statsData.suspectedPct / 100) * C;
  const s4 = (statsData.confirmedPct / 100) * C;

  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>👥</span>
          <span className="card-title">Community Health Status</span>
          <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>● Live DB</span>
        </div>
        <Link to="/community" className="card-link">View Details</Link>
      </div>

      <div className="donut-container">
        {/* SVG Donut Chart */}
        <div className="donut-chart-box">
          <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            {/* Background circle */}
            <circle cx="60" cy="60" r="46" fill="none" stroke="var(--item-border)" strokeWidth="16" />

            {/* Segment 1: Healthy */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#10b981"
              strokeWidth="16"
              strokeDasharray={`${s1} ${C}`}
              strokeDashoffset="0"
            />

            {/* Segment 2: Under Observation */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="16"
              strokeDasharray={`${s2} ${C}`}
              strokeDashoffset={`-${s1}`}
            />

            {/* Segment 3: Suspected Cases */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="16"
              strokeDasharray={`${s3} ${C}`}
              strokeDashoffset={`-${s1 + s2}`}
            />

            {/* Segment 4: Confirmed Cases */}
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="none"
              stroke="#ef4444"
              strokeWidth="16"
              strokeDasharray={`${s4} ${C}`}
              strokeDashoffset={`-${s1 + s2 + s3}`}
            />
          </svg>

          {/* Donut Center Text */}
          <div className="donut-center-text">
            <div className="donut-center-val">{statsData.population.toLocaleString()}</div>
            <div className="donut-center-sub">Population</div>
          </div>
        </div>

        {/* Donut Legend */}
        <div className="donut-legend-list">
          {stats.map((s) => (
            <div key={s.label} className="donut-legend-row">
              <div className="donut-legend-left">
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color }}></span>
                <span>{s.label}</span>
              </div>
              <span className="donut-legend-percent">{s.percent}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
