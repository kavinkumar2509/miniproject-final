import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("officer");

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter your Username or Personnel ID");
      return;
    }
    if (!password) {
      setError("Please enter your Security Password");
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      // Navigate to destination (default /)
      navigate(from, { replace: true });
    } else {
      setError(res.error || "Invalid username or password");
    }
  };

  const handleDemoFill = (u, p, r) => {
    setUsername(u);
    setPassword(p);
    setRole(r);
    setError(null);
  };

  return (
    <div className="login-page-container">
      {/* Background Ambient Cosmic / Radar Orbs */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />
      <div className="login-grid-overlay" />

      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-logo-badge">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#ef4444" />
              <rect x="3" y="9.5" width="18" height="5" rx="1.5" fill="#ef4444" />
            </svg>
          </div>
          <h1 className="login-title">Smart Community Health</h1>
          <div className="login-subtitle">
            Epidemiological Surveillance & Early Warning Portal
          </div>
          <div className="login-access-badge">
            <span className="live-dot" />
            <span>RESTRICTED ACCESS • LEVEL-4 SECURITY</span>
          </div>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="demo-credentials-box">
          <div className="demo-title">⚡ Quick One-Click Demo Access:</div>
          <div className="demo-pills">
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleDemoFill("officer", "health2026", "officer")}
              title="Click to fill Officer credentials"
            >
              🔑 <strong>Officer</strong> (officer)
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleDemoFill("admin", "admin123", "admin")}
              title="Click to fill Admin credentials"
            >
              🛡️ <strong>Admin</strong> (admin)
            </button>
            <button
              type="button"
              className="demo-pill"
              onClick={() => handleDemoFill("kavin", "kavin123", "kavin")}
              title="Click to fill Dr. Kavin credentials"
            >
              🩺 <strong>Dr. Kavin</strong> (kavin)
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="login-error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label htmlFor="login-username">Personnel ID / Username</label>
            <div className="login-input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="login-username"
                type="text"
                placeholder="e.g. officer, admin, or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="login-field-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="login-password">Security Password</label>
              <span className="security-hint">Encrypted</span>
            </div>
            <div className="login-input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="login-options-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember this clinical workstation</span>
            </label>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="login-btn-loading">
                <span className="spinner" /> Authenticating Session...
              </span>
            ) : (
              <span>🔐 Authenticate & Enter Admin Mode →</span>
            )}
          </button>

          {/* Direct Guest / Public Observer Access */}
          <div style={{ marginTop: "12px", textAlign: "center" }}>
            <Link
              to="/"
              style={{
                color: "#94a3b8",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#38bdf8";
                e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <span>👁️</span>
              <span>Continue as Public Observer (Guest Access) →</span>
            </Link>
          </div>
        </form>

        {/* Card Footer Security Watermark */}
        <div className="login-footer">
          <div className="login-footer-security">
            🔒 256-bit TLS Cryptographic Tunnel • Tamil Nadu Public Health Directorate
          </div>
          <div className="login-footer-copy">
            Unauthorized access or transmission is strictly monitored under National Disease Surveillance protocols.
          </div>
        </div>
      </div>
    </div>
  );
}
