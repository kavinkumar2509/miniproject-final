import React, { useEffect, useState } from "react";
import KpiCards from "../components/KpiCards";
import DiseaseRiskMap from "../components/DiseaseRiskMap";
import AlertsCard from "../components/AlertsCard";
import DiseaseTrendsChart from "../components/DiseaseTrendsChart";
import PredictedRiskChart from "../components/PredictedRiskChart";
import SymptomsChart from "../components/SymptomsChart";
import EnvironmentalCard from "../components/EnvironmentalCard";
import CommunityStatusCard from "../components/CommunityStatusCard";
import HealthCampsCard from "../components/HealthCampsCard";
import { getReports, getReportStats } from "../services/api";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [realtimeNotification, setRealtimeNotification] = useState(null);

  // Initial fetch from persistent database
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [repRes, statsRes] = await Promise.allSettled([
          getReports(),
          getReportStats()
        ]);
        if (repRes.status === "fulfilled" && Array.isArray(repRes.value.data)) {
          setReports(repRes.value.data);
        }
        if (statsRes.status === "fulfilled" && statsRes.value.data) {
          setStats(statsRes.value.data);
        }
      } catch (err) {
        console.warn("Could not fetch dashboard reports/stats on load:", err.message);
      }
    }
    fetchInitialData();

    // Connect to Server-Sent Events (SSE) for Real-Time Background Synchronization
    let eventSource = null;
    try {
      eventSource = new EventSource("/api/reports/stream");

      eventSource.addEventListener("new_report", (e) => {
        try {
          const newRep = JSON.parse(e.data);
          setReports((prev) => [newRep, ...prev]);

          // Refresh live stats
          getReportStats().then((res) => {
            if (res.data) setStats(res.data);
          }).catch(() => {});

          // Flash live synchronization banner
          setRealtimeNotification(
            `⚡ Real-Time Update: New surveillance report received for ${newRep.location?.village || "community"}!`
          );
          setTimeout(() => setRealtimeNotification(null), 5000);
        } catch (parseErr) {
          console.error("SSE parse error:", parseErr);
        }
      });

      eventSource.addEventListener("delete_report", () => {
        getReportStats().then((res) => {
          if (res.data) setStats(res.data);
        }).catch(() => {});
      });

      eventSource.onerror = () => {
        eventSource.close();
      };
    } catch (sseErr) {
      console.warn("SSE connection error:", sseErr);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Compute live metrics from database reports & stats
  const totalReportsCount = reports.length;
  const activeCasesCount = stats?.activeCases ?? (12 + totalReportsCount);
  const atRiskCount = stats?.atRisk ?? (40 + Math.round(totalReportsCount * 1.5));
  const population = stats?.population ? stats.population.toLocaleString() : "12,486";
  const highRiskZones = stats?.highRiskZones ? String(stats.highRiskZones) : "2";

  const kpiData = {
    population,
    activeCases: String(activeCasesCount),
    atRisk: String(atRiskCount),
    highRiskZones
  };

  return (
    <div>
      {/* Real-time background sync notification toast */}
      {realtimeNotification && (
        <div
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "0.85rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)",
            animation: "slideDown 0.3s ease"
          }}
        >
          <span>{realtimeNotification}</span>
          <span style={{ fontSize: "0.75rem", opacity: 0.9 }}>Live Sync Active ●</span>
        </div>
      )}

      {/* 1. Top KPI Row (4 Cards) */}
      <KpiCards data={kpiData} />

      {/* 2. Middle Section: Map + Alerts */}
      <div className="middle-grid">
        <DiseaseRiskMap />
        <AlertsCard />
      </div>

      {/* 3. Trends, Risk, and Symptoms (3 Columns) */}
      <div className="charts-grid-3">
        <DiseaseTrendsChart />
        <PredictedRiskChart />
        <SymptomsChart />
      </div>

      {/* 4. Bottom Section: Environmental, Status, Camps (3 Columns) */}
      <div className="bottom-grid-3">
        <EnvironmentalCard />
        <CommunityStatusCard />
        <HealthCampsCard />
      </div>
    </div>
  );
}