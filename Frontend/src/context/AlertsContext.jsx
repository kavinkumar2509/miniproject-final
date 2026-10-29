import React, { createContext, useContext, useState, useEffect } from "react";

const DEFAULT_ALERTS = [
  {
    id: "a1",
    title: "Increase in Water-Borne Disease Risk",
    village: "Kallimandayam",
    desc: "Higher risk of diarrhea cases due to poor water quality",
    time: "2 hours ago",
    type: "red",
    icon: "⚠️"
  },
  {
    id: "a2",
    title: "Poor Water Quality Detected",
    village: "Ottanchathiram",
    desc: "Turbidity level above safe limit",
    time: "5 hours ago",
    type: "amber",
    icon: "💧"
  },
  {
    id: "a3",
    title: "Spike in Fever Cases",
    village: "Poosaripatti",
    desc: "15 new suspected dengue cases reported",
    time: "1 day ago",
    type: "red",
    icon: "🚨"
  },
  {
    id: "a4",
    title: "Mosquito Breeding Risk High",
    village: "Vellalapatti",
    desc: "High breeding potential due to recent rainfall",
    time: "1 day ago",
    type: "amber",
    icon: "🦟"
  }
];

const AlertsContext = createContext();

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem("sih_alerts");
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load saved alerts:", e);
    }
    return DEFAULT_ALERTS;
  });

  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("sih_alerts", JSON.stringify(alerts));
    } catch (e) {
      console.error("Failed to persist alerts:", e);
    }
  }, [alerts]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const deleteAlert = (id) => {
    const alertToDelete = alerts.find((a) => a.id === id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast(`🗑️ Cleared: "${alertToDelete?.title || 'Notification'}"`);
  };

  const clearAllAlerts = () => {
    const count = alerts.length;
    setAlerts([]);
    showToast(`✨ All ${count} notifications have been cleared.`);
  };

  const restoreAlerts = () => {
    setAlerts(DEFAULT_ALERTS);
    showToast("🔄 Restored sample notifications.");
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        alertsCount: alerts.length,
        deleteAlert,
        clearAllAlerts,
        restoreAlerts,
        toast
      }}
    >
      {children}
      {toast && (
        <div className="notification-toast">
          <span>{toast}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
          >
            ✕
          </button>
        </div>
      )}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
}
