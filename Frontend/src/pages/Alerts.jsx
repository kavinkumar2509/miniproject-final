import React, { useState } from "react";
import AlertsCard from "../components/AlertsCard";

export default function Alerts() {
  const [filter, setFilter] = useState("All");
  const [actionNotice, setActionNotice] = useState(null);

  const handleAction = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Early Warning & Rapid Response Center</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Automated anomaly detection, SMS broadcasts, and containment interventions
          </p>
        </div>
      </div>

      {actionNotice && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "12px 18px", borderRadius: "8px", marginBottom: "16px", fontWeight: 700, fontSize: "0.85rem" }}>
          {actionNotice}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
        <AlertsCard />

        <div className="dashboard-card" style={{ padding: "20px" }}>
          <div className="card-header-clean">
            <div className="card-title">🚨 Emergency Containment Actions</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "14px", border: "1px solid #fee2e2", borderRadius: "8px", background: "#fef2f2" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#ef4444", marginBottom: "4px" }}>
                Kallimandayam Diarrhea Cluster
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "10px" }}>
                Water reservoir turbidity exceeds safety thresholds. Recommended chlorine distribution.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleAction("📢 SMS Broadcast dispatched to 1,420 registered residents in Kallimandayam!")}
                  style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Broadcast SMS Warning
                </button>
                <button
                  onClick={() => handleAction("💊 Rapid Water Chlorination Kit dispatched to Kallimandayam Health Post!")}
                  style={{ background: "white", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                >
                  Deploy Testing Kit
                </button>
              </div>
            </div>

            <div style={{ padding: "14px", border: "1px solid #fef3c7", borderRadius: "8px", background: "#fffbeb" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#d97706", marginBottom: "4px" }}>
                Poosaripatti Vector Fogging
              </div>
              <p style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "10px" }}>
                Elevated larval indices detected. Fogging team dispatch recommended.
              </p>
              <button
                onClick={() => handleAction("🦟 Vector Control & Fogging Unit scheduled for Poosaripatti tomorrow 07:00 AM!")}
                style={{ background: "#f59e0b", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
              >
                Schedule Fogging Unit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
