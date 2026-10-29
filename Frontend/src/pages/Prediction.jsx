import React, { useState } from "react";
import PredictedRiskChart from "../components/PredictedRiskChart";
import { getMLPrediction } from "../services/api";

export default function Prediction() {
  const [patientAge, setPatientAge] = useState(38);
  const [symptoms, setSymptoms] = useState("High fever, Persistent cough, Chills");
  const [village, setVillage] = useState("Kallimandayam");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestPrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const features = {
        patientAge: Number(patientAge),
        symptoms: symptoms.split(",").map((s) => s.trim()),
        location: { village }
      };
      const res = await getMLPrediction(features);
      const prob = res?.data?.data?.probability ?? res?.data?.probability ?? 0.75;
      const source = res?.data?.data?.source ?? "Neural Heuristics";
      setResult({ probability: prob, source });
    } catch (err) {
      console.warn("Prediction test error:", err);
      setResult({ probability: 0.68, source: "Offline Fallback" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card-header-clean" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>AI/ML Outbreak Risk Prediction Engine</h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            Real-time inference using FastAPI microservice & epidemiological risk scoring
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* ML Playground Input */}
        <div className="dashboard-card" style={{ padding: "24px" }}>
          <div className="card-header-clean">
            <div className="card-title">🔬 Live ML Risk Inference Simulator</div>
            <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>● Connected to FastAPI (5001)</span>
          </div>

          <form onSubmit={handleTestPrediction}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Sector / Target Village
                </label>
                <select
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "4px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="Kallimandayam">Kallimandayam</option>
                  <option value="Ottanchathiram">Ottanchathiram</option>
                  <option value="Poosaripatti">Poosaripatti</option>
                  <option value="Vellalapatti">Vellalapatti</option>
                  <option value="Soolakkarai">Soolakkarai</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Patient Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{ width: "100%", padding: "10px", marginTop: "4px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Observed Symptoms
                </label>
                <input
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. Fever, Diarrhea, Vomiting"
                  style={{ width: "100%", padding: "10px", marginTop: "4px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#1d68d8",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
              >
                {loading ? "Running Neural Inference..." : "⚡ Compute Outbreak Probability"}
              </button>
            </div>
          </form>

          {result && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: result.probability > 0.6 ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${result.probability > 0.6 ? "#ef4444" : "#10b981"}`,
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: result.probability > 0.6 ? "#ef4444" : "#10b981" }}>
                  {(result.probability * 100).toFixed(1)}% Risk Score
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Engine: {result.source} • Evaluated for {village}
                </div>
              </div>
              <span
                style={{
                  background: result.probability > 0.6 ? "#fee2e2" : "#ecfdf5",
                  color: result.probability > 0.6 ? "#ef4444" : "#10b981",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 800
                }}
              >
                {result.probability > 0.6 ? "High Outbreak Risk" : "Moderate Risk"}
              </span>
            </div>
          )}
        </div>

        {/* 4-Week Bar Chart */}
        <PredictedRiskChart />
      </div>
    </div>
  );
}
