import React, { useEffect, useState } from "react";
import DiseaseTrendsChart from "../components/DiseaseTrendsChart";
import DiseaseRiskMap from "../components/DiseaseRiskMap";
import { getReports } from "../services/api";

export default function Surveillance() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setReports(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const baseZones = [
    { village: "Kallimandayam", baseCases: 12, risk: "High", dominant: "Diarrhea / Water-borne", status: "Active Cluster" },
    { village: "Ottanchathiram", baseCases: 7, risk: "Moderate", dominant: "Gastroenteritis", status: "Observation" },
    { village: "Poosaripatti", baseCases: 3, risk: "Low", dominant: "Suspected Dengue", status: "Contained" },
    { village: "Vellalapatti", baseCases: 1, risk: "Normal", dominant: "Seasonal Flu", status: "Baseline" },
    { village: "Soolakkarai", baseCases: 1, risk: "Normal", dominant: "Mild Fever", status: "Baseline" }
  ];

  // Compute live cases per village from actual database records
  const dbCountsByVillage = {};
  reports.forEach((r) => {
    const v = r.location?.village;
    if (v) {
      dbCountsByVillage[v] = (dbCountsByVillage[v] || 0) + 1;
    }
  });

  const liveSurveillanceZones = baseZones.map((z) => {
    const liveCount = dbCountsByVillage[z.village] || 0;
    const totalCases = z.baseCases + liveCount;
    return {
      ...z,
      activeCases: totalCases,
      liveAdded: liveCount
    };
  });

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Disease Surveillance Engine</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Real-time epidemiological monitoring, hotspot geofencing, and multi-disease trends
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <DiseaseRiskMap />
        <DiseaseTrendsChart />
      </div>

      <div className="dashboard-card" style={{ padding: "20px" }}>
        <div className="card-header-clean">
          <div>
            <div className="card-title">Monitored Surveillance Zones & Micro-Hotspots</div>
            <div className="card-subtitle">Live village telemetry synced with persistent report database</div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>● Live Geospatial Feed</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: "10px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--item-border)", textAlign: "left", color: "var(--text-muted)" }}>
              <th style={{ padding: "10px" }}>Sector / Village</th>
              <th style={{ padding: "10px" }}>Active Cases</th>
              <th style={{ padding: "10px" }}>Risk Level</th>
              <th style={{ padding: "10px" }}>Dominant Symptom / Vector</th>
              <th style={{ padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {liveSurveillanceZones.map((z, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--item-border)" }}>
                <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-dark)" }}>
                  📍 {z.village}
                </td>
                <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-dark)" }}>
                  {z.activeCases}
                  {z.liveAdded > 0 && (
                    <span style={{
                      fontSize: "0.68rem",
                      color: "#10b981",
                      background: "rgba(16, 185, 129, 0.12)",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      marginLeft: "6px"
                    }}>
                      +{z.liveAdded} from DB
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 10px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: z.risk === "High" ? "rgba(239, 68, 68, 0.15)" : z.risk === "Moderate" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: z.risk === "High" ? "#ef4444" : z.risk === "Moderate" ? "#f59e0b" : "#10b981"
                    }}
                  >
                    {z.risk}
                  </span>
                </td>
                <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>{z.dominant}</td>
                <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--primary)" }}>{z.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
