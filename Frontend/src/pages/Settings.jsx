import React, { useState } from "react";

export default function Settings() {
  const [threshold, setThreshold] = useState(0.70);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>System Configuration & Early Warning Thresholds</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Adjust outbreak sensitivity thresholds, SMS notification rules, and geospatial cluster bounds
          </p>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: "24px", maxWidth: "600px" }}>
        {saved && (
          <div style={{ background: "#ecfdf5", color: "#065f46", padding: "10px", borderRadius: "6px", marginBottom: "16px", fontWeight: 700, fontSize: "0.85rem" }}>
            ✓ Configuration saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", display: "block", marginBottom: "6px" }}>
              Outbreak Risk Probability Trigger Threshold ({Math.round(threshold * 100)}%)
            </label>
            <input
              type="range"
              min="0.4"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
              Alerts trigger when ML prediction exceeds this probability.
            </span>
          </div>

          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", display: "block", marginBottom: "6px" }}>
              Automated SMS Dispatch to Field Healthcare Workers
            </label>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            <span style={{ fontSize: "0.85rem", color: "#475569" }}>Enable automated alerts on severe water contamination</span>
          </div>

          <button
            type="submit"
            style={{
              background: "#1d68d8",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              alignSelf: "flex-start"
            }}
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
