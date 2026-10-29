import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("sih_theme") || "emerald";
  });

  useEffect(() => {
    if (theme === "emerald") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("sih_theme", theme);
  }, [theme]);

  const themes = [
    { id: "emerald", label: "🌿 Emerald", title: "Emerald Health" },
    { id: "cyber", label: "🌌 Cyber", title: "Cyber Ocean" },
    { id: "violet", label: "💜 Violet", title: "Royal Violet" },
    { id: "light", label: "☀️ Light", title: "Clinical Light" },
  ];

  return (
    <nav className="main-nav">
      <NavLink to="/" className="brand-logo">
        <div className="brand-icon">⚕️</div>
        <span>SmartHealth AI</span>
      </NavLink>

      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? "active" : "")}
          end
        >
          Submit Report
        </NavLink>
        <NavLink 
          to="/reports" 
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Reports
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
        </NavLink>
      </div>

      <div className="theme-picker" title="Switch UI Theme">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`theme-btn ${theme === t.id ? "active" : ""}`}
            onClick={() => setTheme(t.id)}
            title={t.title}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
