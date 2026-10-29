import React from "react";
import EnvironmentalCard from "../components/EnvironmentalCard";

export default function Environmental() {
  const sensorNodes = [
    { id: "NODE-ENV-1", location: "Kallimandayam Reservoir", type: "Water Quality", turbidity: "18.4 NTU (High)", pH: "6.2", status: "Alert" },
    { id: "NODE-ENV-2", location: "Ottanchathiram Canal", type: "Water Quality", turbidity: "14.1 NTU (Elevated)", pH: "6.8", status: "Warning" },
    { id: "NODE-ENV-3", location: "Poosaripatti Substation", type: "Weather & Rain", rainfall: "24mm (24h)", humidity: "76%", status: "Normal" },
    { id: "NODE-ENV-4", location: "Vellalapatti Basin", type: "Mosquito Larval Index", density: "14.2 / dip (Moderate)", waterStagnation: "Yes", status: "Warning" }
  ];

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Environmental & Ecological Surveillance</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Real-time IoT sensor telemetry, water turbidity monitoring, and vector breeding potential
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <EnvironmentalCard />
      </div>

      <div className="dashboard-card" style={{ padding: "20px" }}>
        <div className="card-header-clean">
          <div className="card-title">IoT Environmental Sensor Grid Nodes</div>
          <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>● 4 Telemetry Feeds Active</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: "10px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left", color: "#64748b" }}>
              <th style={{ padding: "10px" }}>Sensor ID</th>
              <th style={{ padding: "10px" }}>Station Location</th>
              <th style={{ padding: "10px" }}>Telemetry Type</th>
              <th style={{ padding: "10px" }}>Key Metrics</th>
              <th style={{ padding: "10px" }}>Risk State</th>
            </tr>
          </thead>
          <tbody>
            {sensorNodes.map((s) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 10px", fontWeight: 700, color: "#1d68d8" }}>{s.id}</td>
                <td style={{ padding: "12px 10px", fontWeight: 600 }}>{s.location}</td>
                <td style={{ padding: "12px 10px", color: "#475569" }}>{s.type}</td>
                <td style={{ padding: "12px 10px" }}>{s.turbidity || s.rainfall || s.density}</td>
                <td style={{ padding: "12px 10px" }}>
                  <span
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: s.status === "Alert" ? "#fee2e2" : s.status === "Warning" ? "#fef3c7" : "#ecfdf5",
                      color: s.status === "Alert" ? "#ef4444" : s.status === "Warning" ? "#f59e0b" : "#10b981"
                    }}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
