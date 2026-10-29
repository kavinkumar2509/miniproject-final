import React from "react";

export default function KpiCards({ data = {} }) {
  const population = data.population || "12,489";
  const activeCases = data.activeCases || "13";
  const atRisk = data.atRisk || "45";
  const highRiskZones = data.highRiskZones || "2";

  return (
    <div className="kpi-grid">
      {/* 1. Total Population */}
      <div className="kpi-card kpi-card-population" title="Total population across monitored community sectors">
        <div className="kpi-icon-box kpi-icon-sky">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Total Population</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{population}</span>
            <span className="kpi-badge kpi-badge-green">
              <span className="kpi-pulse-dot dot-green" />
              ↑ 2.3%
            </span>
          </div>
          <span className="kpi-desc">in monitored areas</span>
        </div>
      </div>

      {/* 2. Active Cases */}
      <div className="kpi-card kpi-card-cases" title="Confirmed and symptomatic clinical reports under surveillance">
        <div className="kpi-icon-box kpi-icon-rose">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="4" />
            <path d="M12 7v10M7 12h10" strokeWidth="2.6" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-title">Active Cases</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{activeCases}</span>
            <span className="kpi-badge kpi-badge-red">
              <span className="kpi-pulse-dot dot-red" />
              ↑ 33%
            </span>
          </div>
          <span className="kpi-desc">last 7 days</span>
        </div>
      </div>

      {/* 3. At Risk Individuals */}
      <div className="kpi-card kpi-card-risk" title="Vulnerable population at elevated risk based on water & environmental ML models">
        <div className="kpi-icon-box kpi-icon-amber">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4M12 16h.01" strokeWidth="2.6" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-title">At Risk Individuals</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{atRisk}</span>
            <span className="kpi-badge kpi-badge-amber">
              <span className="kpi-pulse-dot dot-amber" />
              ↑ 12%
            </span>
          </div>
          <span className="kpi-desc">based on prediction</span>
        </div>
      </div>

      {/* 4. High Risk Zones */}
      <div className="kpi-card kpi-card-zones" title="Sectors requiring urgent environmental & containment response">
        <div className="kpi-icon-box kpi-icon-purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="m4.93 4.93 4.24 4.24" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>
        <div className="kpi-info">
          <span className="kpi-title">High Risk Zones</span>
          <div className="kpi-value-row">
            <span className="kpi-value">{highRiskZones}</span>
            <span className="kpi-badge kpi-badge-purple">
              <span className="kpi-pulse-dot dot-purple" />
              ⭐ New: 1
            </span>
          </div>
          <span className="kpi-desc">requires attention</span>
        </div>
      </div>
    </div>
  );
}
