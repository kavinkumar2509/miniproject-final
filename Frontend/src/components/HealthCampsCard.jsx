import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealthCamps } from "../services/api";

export default function HealthCampsCard({ campsData = null }) {
  const [camps, setCamps] = useState(campsData || []);

  useEffect(() => {
    if (campsData && campsData.length > 0) {
      setCamps(campsData);
    } else {
      getHealthCamps()
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setCamps(res.data);
          }
        })
        .catch(() => {});
    }
  }, [campsData]);

  return (
    <div className="dashboard-card" style={{ padding: "18px 20px" }}>
      <div className="card-header-clean">
        <div className="card-title-group">
          <span style={{ fontSize: "1.1rem", color: "#1d68d8" }}>📅</span>
          <span className="card-title">Recent Health Camps</span>
          <span style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700 }}>● Live DB</span>
        </div>
        <Link to="/community" className="card-link">View All</Link>
      </div>

      <div className="camps-list">
        {camps.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No health camps scheduled yet.
          </div>
        ) : (
          camps.slice(0, 4).map((c) => (
            <div key={c.id || c._id} className="camp-item">
              <div className="camp-date-box">
                <span className="camp-day">{c.day}</span>
                <span className="camp-month">{c.month}</span>
              </div>
              <div className="camp-info">
                <div className="camp-title">{c.title}</div>
                <div className="camp-village">📍 {c.village}</div>
              </div>
              <span className={`camp-status-badge ${c.badgeClass || (c.status === "Completed" ? "camp-completed" : "camp-upcoming")}`}>
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
