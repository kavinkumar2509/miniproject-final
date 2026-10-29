import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlerts } from "../context/AlertsContext";
import { useAuth } from "../context/AuthContext";

export default function TopHeader() {
  const { alerts, alertsCount, deleteAlert, clearAllAlerts, restoreAlerts } = useAlerts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("sih_theme") || "light";
  });

  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const themes = [
    { id: "light", label: "☀️ Clinical Light", icon: "☀️" },
    { id: "dark", label: "🌙 Midnight Dark", icon: "🌙" },
    { id: "emerald", label: "🌿 Emerald Health", icon: "🌿" },
    { id: "cyber", label: "🌌 Cyber Ocean", icon: "🌌" }
  ];

  const applyTheme = (themeId) => {
    setCurrentTheme(themeId);
    if (themeId === "light") {
      document.documentElement.removeAttribute("data-theme");
      document.body.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
      document.body.setAttribute("data-theme", themeId);
    }
    localStorage.setItem("sih_theme", themeId);
    setThemeMenuOpen(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("sih_theme") || "light";
    applyTheme(saved);

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentIcon = themes.find((t) => t.id === currentTheme)?.icon || "🎨";

  return (
    <header className="top-header">
      <div className="header-title-area">
        <h1>Smart Community Health Monitoring & Early Warning System</h1>
        <div className="header-subtitle">
          Healthy Communities &nbsp;|&nbsp; Early Detection &nbsp;|&nbsp; Safer Tomorrow
        </div>
      </div>

      <div className="header-actions">
        {/* Notification Bell with Dropdown Popover */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            type="button"
            className="notification-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            title="Early Warning Notifications"
            style={{
              borderColor: notifOpen ? "#1d68d8" : undefined,
              boxShadow: notifOpen ? "0 0 0 2px rgba(29, 104, 216, 0.25)" : undefined
            }}
          >
            <span>🔔</span>
            {alertsCount > 0 && <span className="notification-badge">{alertsCount}</span>}
          </button>

          {/* Notifications Dropdown Panel */}
          {notifOpen && (
            <div className="notif-dropdown-menu">
              <div className="notif-dropdown-header">
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--text-dark)" }}>
                  🔔 Notifications ({alertsCount})
                </div>
                {alertsCount > 0 ? (
                  <button
                    type="button"
                    className="notif-clear-all-link"
                    onClick={clearAllAlerts}
                    title="Clear all notifications"
                  >
                    🗑️ Clear All
                  </button>
                ) : (
                  <button
                    type="button"
                    className="notif-clear-all-link"
                    onClick={restoreAlerts}
                    title="Restore sample notifications"
                  >
                    🔄 Restore
                  </button>
                )}
              </div>

              <div className="notif-dropdown-body">
                {alerts.length === 0 ? (
                  <div className="notif-empty-state">
                    <span style={{ fontSize: "1.8rem" }}>✨</span>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-dark)", marginTop: "4px" }}>
                      All caught up!
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      No unread epidemic warnings.
                    </div>
                  </div>
                ) : (
                  alerts.map((item) => (
                    <div key={item.id} className="notif-dropdown-item">
                      <div className={`notif-item-icon ${item.type === "red" ? "alert-icon-red" : "alert-icon-amber"}`}>
                        {item.icon}
                      </div>
                      <div className="notif-item-info">
                        <div className="notif-item-title">{item.title}</div>
                        <div className="notif-item-sub">📍 {item.village} • {item.time}</div>
                      </div>
                      <button
                        type="button"
                        className="notif-item-delete"
                        onClick={() => deleteAlert(item.id)}
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="notif-dropdown-footer">
                <Link
                  to="/alerts"
                  className="notif-view-all"
                  onClick={() => setNotifOpen(false)}
                >
                  Go to Alerts & Interventions Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar (PFP) with Session Popover */}
        <div style={{ position: "relative" }} ref={userMenuRef}>
          <button
            type="button"
            className="user-avatar-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title="Personnel Profile & Security Session"
            style={{
              borderColor: userMenuOpen ? "#1d68d8" : undefined,
              boxShadow: userMenuOpen ? "0 0 0 2px rgba(29, 104, 216, 0.25)" : undefined
            }}
          >
            <span>👤</span>
          </button>

          {/* User Profile Menu */}
          {userMenuOpen && (
            <div className="user-dropdown-menu">
              <div className="user-dropdown-profile">
                <div className="user-avatar-circle">
                  <span>👤</span>
                </div>
                <div>
                  <div className="user-profile-name">
                    {user?.name || "Dr. Kavin Kumar"}
                  </div>
                  <div className="user-profile-role">
                    {user?.role || "Chief Epidemiological Officer"}
                  </div>
                </div>
              </div>

              <div className="user-dropdown-meta">
                <div className="user-meta-item">
                  <span className="user-meta-label">Department:</span>
                  <span className="user-meta-val">{user?.department || "Epidemic Surveillance Division"}</span>
                </div>
                <div className="user-meta-item">
                  <span className="user-meta-label">Access Level:</span>
                  <span className="user-badge-pill">{user?.badge || "Active Session"}</span>
                </div>
              </div>

              <div className="user-dropdown-actions">
                <button
                  type="button"
                  className="user-logout-btn"
                  onClick={handleLogout}
                >
                  <span>🚪</span>
                  <span>Sign Out / Lock Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Switching Icon Right Next to PFP */}
        <div style={{ position: "relative" }} ref={menuRef}>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            title="Switch Dashboard Theme"
            style={{
              borderColor: themeMenuOpen ? "#1d68d8" : undefined,
              boxShadow: themeMenuOpen ? "0 0 0 2px rgba(29, 104, 216, 0.25)" : undefined
            }}
          >
            <span>{currentIcon}</span>
          </button>

          {/* Theme Dropdown Menu */}
          {themeMenuOpen && (
            <div className="theme-dropdown-menu">
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", padding: "4px 8px", textTransform: "uppercase" }}>
                Select UI Theme
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`theme-dropdown-item ${currentTheme === t.id ? "active" : ""}`}
                  onClick={() => applyTheme(t.id)}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Display */}
        <div className="date-pill">
          <span>📅</span>
          <span>{currentDate}</span>
        </div>
      </div>
    </header>
  );
}
