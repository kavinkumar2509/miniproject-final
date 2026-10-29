import React, { useEffect, useState } from "react";
import CommunityStatusCard from "../components/CommunityStatusCard";
import HealthCampsCard from "../components/HealthCampsCard";
import { getCommunityWorkers, getHealthCamps, createHealthCamp } from "../services/api";

export default function Community() {
  const [workers, setWorkers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampModal, setShowCampModal] = useState(false);
  const [campForm, setCampForm] = useState({
    title: "",
    village: "Kallimandayam",
    date: "",
    targetBeneficiaries: 250
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [wRes, cRes] = await Promise.all([
        getCommunityWorkers().catch(() => ({ data: [] })),
        getHealthCamps().catch(() => ({ data: [] }))
      ]);
      setWorkers(Array.isArray(wRes.data) ? wRes.data : []);
      setCamps(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (e) {
      console.error("Error loading community live data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCampSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHealthCamp(campForm);
      setShowCampModal(false);
      setCampForm({ title: "", village: "Kallimandayam", date: "", targetBeneficiaries: 250 });
      loadData();
    } catch (err) {
      console.error("Failed to create camp:", err);
    }
  };

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Community Health & Field Records</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Real-time population demographics, healthcare worker deployment, and medical camp registers
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="autofill-btn"
            onClick={() => setShowCampModal(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>➕</span>
            <span>Schedule Health Camp</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            style={{
              background: "var(--item-bg)",
              border: "1px solid var(--item-border)",
              color: "var(--text-dark)",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🔄 Sync Live Data
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        <CommunityStatusCard />
        <HealthCampsCard campsData={camps} onRefresh={loadData} />
      </div>

      <div className="dashboard-card" style={{ padding: "20px" }}>
        <div className="card-header-clean">
          <div>
            <div className="card-title">Frontline Healthcare Worker Deployment</div>
            <div className="card-subtitle">Live activity synced with epidemiological field database</div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>
            ● {workers.length} Units Active in District
          </span>
        </div>

        {loading && workers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
            Loading live healthcare worker telemetry...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--item-border)", textAlign: "left", color: "var(--text-muted)" }}>
                <th style={{ padding: "10px" }}>Worker ID</th>
                <th style={{ padding: "10px" }}>Name</th>
                <th style={{ padding: "10px" }}>Assigned Village</th>
                <th style={{ padding: "10px" }}>Reports Submitted (Live DB)</th>
                <th style={{ padding: "10px" }}>Field Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id} style={{ borderBottom: "1px solid var(--item-border)" }}>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--primary)" }}>{w.id}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 600, color: "var(--text-dark)" }}>{w.name}</td>
                  <td style={{ padding: "12px 10px", color: "var(--text-muted)" }}>📍 {w.assignedZone}</td>
                  <td style={{ padding: "12px 10px", fontWeight: 700, color: "var(--text-dark)" }}>
                    <span style={{ fontSize: "0.95rem" }}>{w.reportsSubmitted || w.reportsToday || 0}</span>
                    {w.liveDbRecords > 0 && (
                      <span style={{
                        fontSize: "0.68rem",
                        color: "#10b981",
                        background: "rgba(16, 185, 129, 0.12)",
                        padding: "1px 6px",
                        borderRadius: "10px",
                        marginLeft: "6px"
                      }}>
                        +{w.liveDbRecords} today
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 10px" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      background: w.status === "Active in Field" ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 189, 248, 0.15)",
                      color: w.status === "Active in Field" ? "#10b981" : "#0284c7"
                    }}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Schedule Health Camp Modal */}
      {showCampModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="dashboard-card" style={{ maxWidth: "460px", width: "100%", padding: "26px" }}>
            <div className="card-header-clean" style={{ marginBottom: "16px" }}>
              <div className="card-title">📅 Register Community Health Camp</div>
              <button
                type="button"
                onClick={() => setShowCampModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-light)", fontSize: "1.1rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCampSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="input-group">
                <label>Program / Camp Title</label>
                <input
                  type="text"
                  placeholder="e.g. Diarrhea Prevention & Chlorine Distribution"
                  value={campForm.title}
                  onChange={(e) => setCampForm({ ...campForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Village</label>
                <select
                  value={campForm.village}
                  onChange={(e) => setCampForm({ ...campForm, village: e.target.value })}
                  required
                >
                  <option value="Kallimandayam">📍 Kallimandayam</option>
                  <option value="Ottanchathiram">📍 Ottanchathiram</option>
                  <option value="Poosaripatti">📍 Poosaripatti</option>
                  <option value="Vellalapatti">📍 Vellalapatti</option>
                  <option value="Soolakkarai">📍 Soolakkarai</option>
                </select>
              </div>

              <div className="input-group">
                <label>Scheduled Date</label>
                <input
                  type="date"
                  value={campForm.date}
                  onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Beneficiaries</label>
                <input
                  type="number"
                  value={campForm.targetBeneficiaries}
                  onChange={(e) => setCampForm({ ...campForm, targetBeneficiaries: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowCampModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "var(--item-bg)",
                    border: "1px solid var(--item-border)",
                    color: "var(--text-dark)",
                    borderRadius: "6px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, margin: 0, padding: "10px" }}
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
