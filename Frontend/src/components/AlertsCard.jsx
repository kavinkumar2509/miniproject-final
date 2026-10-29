import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAlerts } from "../context/AlertsContext";

export default function AlertsCard() {
  const { alerts, alertsCount, deleteAlert, clearAllAlerts, restoreAlerts } = useAlerts();
  const location = useLocation();
  const isAlertsPage = location.pathname === "/alerts";

  return (
    <div className="dashboard-card" style={{ padding: "20px" }}>
      <div className="card-header-clean" style={{ flexWrap: "wrap", gap: "10px" }}>
        <div className="card-title-group">
          <span style={{ fontSize: "1.2rem", color: "#1d68d8" }}>🔔</span>
          <span className="card-title">Early Warning Alerts</span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "12px",
              background: alertsCount > 0 ? "rgba(239, 68, 68, 0.15)" : "rgba(100, 116, 139, 0.15)",
              color: alertsCount > 0 ? "#ef4444" : "#94a3b8"
            }}
          >
            {alertsCount} {alertsCount === 1 ? "alert" : "alerts"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {alertsCount > 0 ? (
            <button
              type="button"
              className="clear-alerts-btn"
              onClick={clearAllAlerts}
              title="Clear all early warning notifications"
            >
              <span>🗑️</span>
              <span>Clear All</span>
            </button>
          ) : (
            <button
              type="button"
              className="restore-sample-btn"
              onClick={restoreAlerts}
              title="Restore sample notifications"
            >
              <span>🔄</span>
              <span>Restore Samples</span>
            </button>
          )}

          {!isAlertsPage && (
            <Link to="/alerts" className="card-link">
              View All
            </Link>
          )}
        </div>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="alerts-empty-state">
            <span style={{ fontSize: "2.4rem" }}>✨</span>
            <div className="empty-state-title">All Notifications Cleared</div>
            <p className="empty-state-desc">
              Zero active health anomalies or epidemic warnings reported for your sector.
            </p>
            <button
              type="button"
              className="restore-alerts-btn"
              onClick={restoreAlerts}
            >
              <span>🔄</span> Restore Sample Alerts
            </button>
          </div>
        ) : (
          alerts.map((item) => (
            <div key={item.id} className="alert-item">
              <div
                className={`alert-icon-box ${
                  item.type === "red" ? "alert-icon-red" : "alert-icon-amber"
                }`}
              >
                <span>{item.icon}</span>
              </div>

              <div className="alert-content">
                <div className="alert-title-row">
                  <span className="alert-title">{item.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="alert-time">{item.time}</span>
                    <button
                      type="button"
                      className="alert-delete-btn"
                      onClick={() => deleteAlert(item.id)}
                      title="Delete / Dismiss notification"
                      aria-label="Delete notification"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="alert-village">📍 {item.village}</div>
                <div className="alert-desc">{item.desc}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
