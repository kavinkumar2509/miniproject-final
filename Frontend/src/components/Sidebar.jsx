import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAlerts } from "../context/AlertsContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { alertsCount } = useAlerts();
  const { logout, isAuthenticated } = useAuth();

  const navItems = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/surveillance", label: "Disease Surveillance", icon: "📈" },
    { to: "/community", label: "Community Data", icon: "👥" },
    { to: "/environmental", label: "Environmental Data", icon: "💧" },
    { to: "/prediction", label: "Risk Prediction", icon: "🛡️" },
    { to: "/alerts", label: "Alerts & Notifications", icon: "🔔", badge: alertsCount > 0 ? alertsCount : null },
    { to: "/reports", label: "Reports", icon: "📄" },
    { to: "/data-management", label: "Data Management", icon: "🗄️" },
    { to: "/settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon" title="Smart Community Health">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#ef4444" />
              <rect x="3" y="9.5" width="18" height="5" rx="1.5" fill="#ef4444" />
            </svg>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: "0.92rem", lineHeight: 1.2 }}>
              Smart Community
            </div>
            <div style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>
              Health System
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              end={item.to === "/"}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#ef4444" />
            <rect x="3" y="9.5" width="18" height="5" rx="1.5" fill="#ef4444" />
          </svg>
          <span>Smart Community Health</span>
        </div>
        <div className="sidebar-footer-tagline">
          People • Prevention • Progress
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={logout}
            style={{
              marginTop: "10px",
              width: "100%",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#fca5a5",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
              e.currentTarget.style.color = "#fca5a5";
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              marginTop: "10px",
              width: "100%",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              border: "none",
              padding: "7px 12px",
              borderRadius: "6px",
              fontSize: "0.74rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)",
              transition: "all 0.2s"
            }}
          >
            <span>🔐</span>
            <span>Admin Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
