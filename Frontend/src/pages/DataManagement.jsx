import React, { useEffect, useState } from "react";
import { getReports } from "../services/api";

export default function DataManagement() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("Connected");

  useEffect(() => {
    async function load() {
      try {
        const res = await getReports();
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setStatus("Error connecting");
      }
    }
    load();
  }, []);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `surveillance_reports_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  const exportCSV = () => {
    if (reports.length === 0) return;
    const headers = ["ID", "Reporter", "Age", "Gender", "Village", "Symptoms", "Date"];
    const rows = reports.map((r) => [
      r._id || "",
      r.reporterId || "",
      r.patientAge || "",
      r.patientGender || "",
      r.location?.village || "",
      `"${Array.isArray(r.symptoms) ? r.symptoms.join("; ") : r.symptoms || ""}"`,
      r.date || ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `surveillance_data_${Date.now()}.csv`);
    link.click();
  };

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Database & Data Infrastructure</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Storage engine status, disk persistence verification, and database export utilities
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div className="dashboard-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Local Disk Database
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981", margin: "6px 0" }}>
            Active (JSON File)
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Path: <code>backend/data/reports.json</code>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Real-Time Background Sync
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1d68d8", margin: "6px 0" }}>
            Live SSE Stream
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Route: <code>/api/reports/stream</code>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Total Persistent Records
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "6px 0" }}>
            {reports.length} Records
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
            Permanently preserved on disk
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ padding: "24px" }}>
        <div className="card-header-clean">
          <div className="card-title">Export & Backup Surveillance Records</div>
        </div>
        <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "16px" }}>
          Download an archival copy of all community health reports and epidemiological features for offline analysis.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={exportJSON}
            style={{
              background: "#1d68d8",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            📥 Export to JSON
          </button>
          <button
            onClick={exportCSV}
            style={{
              background: "#ffffff",
              color: "#1d68d8",
              border: "1px solid #1d68d8",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            📊 Export to CSV / Excel
          </button>
        </div>
      </div>
    </div>
  );
}
