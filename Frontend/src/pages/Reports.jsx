import React, { useEffect, useState, useRef } from "react";
import ReportForm from "../components/ReportForm";
import { getReports, deleteReport, createReport } from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveConnected, setLiveConnected] = useState(true);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchReports = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await getReports();
      setReports(Array.isArray(res.data) ? res.data : []);
      setLiveConnected(true);
    } catch (err) {
      console.warn("Could not fetch reports:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(true);

    // 1. Live background SSE listener
    let eventSource = null;
    try {
      eventSource = new EventSource("/api/reports/stream");

      eventSource.addEventListener("new_report", (e) => {
        try {
          const newRep = JSON.parse(e.data);
          setReports((prev) => {
            const exists = prev.some((r) => r._id === newRep._id);
            if (exists) return prev;
            return [newRep, ...prev];
          });
          setNewlyAddedId(newRep._id);
          setTimeout(() => setNewlyAddedId(null), 3000);
          showToast(`⚡ Live record received from ${newRep.location?.village || 'field'}`);
        } catch (parseErr) {
          console.error(parseErr);
        }
      });

      eventSource.addEventListener("delete_report", (e) => {
        try {
          const { id } = JSON.parse(e.data);
          setReports((prev) => prev.filter((r) => r._id !== id && r.id !== id));
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.onopen = () => setLiveConnected(true);
      eventSource.onerror = () => {
        // SSE error, fallback will poll
        setLiveConnected(false);
      };
    } catch (sseErr) {
      console.warn("SSE init error:", sseErr);
    }

    // 2. Auto-polling interval (every 4 seconds) to guarantee real-time synchronization
    const pollInterval = setInterval(() => {
      fetchReports(false);
    }, 4000);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      showToast("🗑️ Record deleted from live database");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleQuickIngest = async () => {
    const sampleVillages = ["Kallimandayam", "Ottanchathiram", "Poosaripatti", "Vellalapatti"];
    const randomVillage = sampleVillages[Math.floor(Math.random() * sampleVillages.length)];
    const sampleSymptoms = [
      ["Acute Watery Diarrhea", "Dehydration"],
      ["High Fever", "Joint Pain", "Chills"],
      ["Turbid Water Ingestion", "Nausea", "Vomiting"],
      ["Suspected Dengue", "Petechial Rash", "Severe Headache"]
    ];
    const syms = sampleSymptoms[Math.floor(Math.random() * sampleSymptoms.length)];
    const risk = (0.55 + Math.random() * 0.4).toFixed(2);

    const testPayload = {
      reporterId: `HCW-00${Math.floor(Math.random() * 4) + 1}`,
      patientAge: Math.floor(Math.random() * 55) + 12,
      patientGender: Math.random() > 0.5 ? "Female" : "Male",
      symptoms: syms,
      location: {
        village: randomVillage,
        lat: 10.51 + Math.random() * 0.05,
        lng: 77.72 + Math.random() * 0.08
      },
      riskScore: Number(risk),
      riskZone: Number(risk) >= 0.7 ? "High Risk" : "Moderate Risk"
    };

    try {
      const res = await createReport(testPayload);
      const saved = res.data;
      setReports((prev) => [saved, ...prev]);
      setNewlyAddedId(saved._id);
      setTimeout(() => setNewlyAddedId(null), 3000);
      showToast(`✨ Generated live test ingestion in ${randomVillage}!`);
    } catch (err) {
      console.error("Quick ingest error:", err);
    }
  };

  return (
    <div>
      {notification && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "24px",
          background: "#0f172a",
          border: "1px solid #38bdf8",
          color: "#38bdf8",
          padding: "10px 18px",
          borderRadius: "8px",
          fontSize: "0.85rem",
          fontWeight: 700,
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          zIndex: 9999,
          animation: "toastSlideUp 0.25s ease"
        }}>
          {notification}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "24px", alignItems: "start" }}>
        {/* Left: Input Form */}
        <div>
          <ReportForm onReportSubmitted={(newR) => {
            setReports((prev) => [newR, ...prev.filter(r => r._id !== newR._id)]);
            setNewlyAddedId(newR._id);
            setTimeout(() => setNewlyAddedId(null), 3000);
          }} />
        </div>

        {/* Right: Live Database Feed */}
        <div className="dashboard-card" style={{ padding: "24px" }}>
          <div className="card-header-clean" style={{ flexWrap: "wrap", gap: "8px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="card-title">Live Database Feed</span>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background: liveConnected ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: liveConnected ? "#10b981" : "#f59e0b"
                }}>
                  <span style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: liveConnected ? "#10b981" : "#f59e0b",
                    boxShadow: liveConnected ? "0 0 8px #10b981" : "none"
                  }} />
                  {liveConnected ? "LIVE STREAM" : "POLLING"}
                </span>
              </div>
              <div className="card-subtitle">
                {reports.length} permanent records synced in real-time from disk DB
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={handleQuickIngest}
                style={{
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px dashed #38bdf8",
                  color: "#38bdf8",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
                title="Inject a live test surveillance record to observe instant real-time sync"
              >
                ⚡ Test Ingestion
              </button>
              <button
                type="button"
                onClick={() => fetchReports(true)}
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
                🔄 Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              Loading stored surveillance records...
            </div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No reports stored yet. Fill the form on the left to submit the first record!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "680px", overflowY: "auto", paddingRight: "4px" }}>
              {reports.map((r, i) => {
                const symptomsList = Array.isArray(r.symptoms)
                  ? r.symptoms
                  : r.symptoms ? [r.symptoms] : [];
                const village = r.location?.village || "Unknown";
                const dateStr = r.date ? new Date(r.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now";
                const isNew = r._id === newlyAddedId;

                const riskVal = r.riskScore ? (r.riskScore * 100).toFixed(0) : null;
                const isHighRisk = r.riskScore >= 0.7 || r.riskZone === "High Risk";

                return (
                  <div
                    key={r._id || i}
                    className="live-feed-card"
                    style={{
                      borderLeft: isHighRisk ? "4px solid #ef4444" : "4px solid #38bdf8",
                      boxShadow: isNew ? "0 0 16px rgba(56, 189, 248, 0.4)" : undefined,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div className="live-feed-header">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="live-feed-reporter">
                          {r.reporterId || "HCW-FIELD"}
                        </span>
                        {isNew && (
                          <span style={{
                            background: "#10b981",
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: 800,
                            padding: "1px 6px",
                            borderRadius: "10px"
                          }}>
                            NEW
                          </span>
                        )}
                        {riskVal && (
                          <span style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "4px",
                            background: isHighRisk ? "rgba(239, 68, 68, 0.15)" : "rgba(56, 189, 248, 0.15)",
                            color: isHighRisk ? "#ef4444" : "#38bdf8"
                          }}>
                            {riskVal}% Risk
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="live-feed-time">{dateStr}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(r._id, e)}
                          title="Delete from database"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-light)",
                            cursor: "pointer",
                            padding: "2px 4px",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            lineHeight: 1
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-light)")}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="live-feed-patient">
                      <strong>Patient:</strong> Age {r.patientAge || "N/A"} • {r.patientGender || "N/A"} • 📍 <strong>{village}</strong>
                      {r.location?.lat && (
                        <span style={{ fontSize: "0.7rem", color: "var(--text-light)", marginLeft: "6px" }}>
                          ({Number(r.location.lat).toFixed(3)}, {Number(r.location.lng).toFixed(3)})
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "2px" }}>
                      {symptomsList.map((sym, sI) => (
                        <span key={sI} className="symptom-tag">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
