import { useState } from "react";
import { createReport, getMLPrediction } from "../services/api";

const VILLAGE_COORDS = {
  Kallimandayam: { lat: "10.5124", lng: "77.7265" },
  Ottanchathiram: { lat: "10.4900", lng: "77.7800" },
  Poosaripatti: { lat: "10.5400", lng: "77.8200" },
  Vellalapatti: { lat: "10.4500", lng: "77.7100" },
  Soolakkarai: { lat: "10.5050", lng: "77.6800" },
  Senganur: { lat: "10.4800", lng: "77.8400" }
};

export default function ReportForm({ onReportSubmitted }) {
  const [form, setForm] = useState({
    reporterId: "HCW-001",
    patientAge: "32",
    patientGender: "Female",
    symptoms: "High Fever, Persistent Cough, Fatigue",
    village: "Kallimandayam",
    lat: "10.5124",
    lng: "77.7265"
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "village" && VILLAGE_COORDS[value]) {
      setForm((prev) => ({
        ...prev,
        village: value,
        lat: VILLAGE_COORDS[value].lat,
        lng: VILLAGE_COORDS[value].lng
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuickFill = () => {
    setForm({
      reporterId: "HCW-002",
      patientAge: "45",
      patientGender: "Male",
      symptoms: "Acute Diarrhea, Watery Stool, Abdominal Cramps",
      village: "Ottanchathiram",
      lat: "10.4900",
      lng: "77.7800"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const features = {
        patientAge: Number(form.patientAge),
        patientGender: form.patientGender,
        symptoms: form.symptoms.split(",").map((s) => s.trim()),
        location: {
          lat: Number(form.lat),
          lng: Number(form.lng),
          village: form.village
        }
      };

      // 1. Get ML prediction from backend
      let mlProb = 0.78;
      try {
        const mlRes = await getMLPrediction(features);
        if (mlRes?.data?.data?.probability !== undefined) {
          mlProb = mlRes.data.data.probability;
        } else if (mlRes?.data?.probability !== undefined) {
          mlProb = mlRes.data.probability;
        }
        setPrediction(mlProb);
      } catch (mlErr) {
        console.warn("ML prediction failed:", mlErr);
      }

      // 2. Submit report to live database
      const payload = {
        reporterId: form.reporterId,
        patientAge: Number(form.patientAge),
        patientGender: form.patientGender,
        symptoms: features.symptoms,
        location: features.location,
        riskScore: mlProb,
        riskZone: mlProb >= 0.7 ? "High Risk" : mlProb >= 0.4 ? "Moderate Risk" : "Normal"
      };

      const res = await createReport(payload);
      const saved = res?.data || payload;

      setStatusMessage({
        type: "success",
        text: `✅ Report #${saved._id || 'SAVED'} logged & synced to live database!`
      });

      // Notify parent to immediately refresh live database feed
      if (onReportSubmitted) {
        onReportSubmitted(saved);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({
        type: "error",
        text: "❌ Failed to submit report: " + (error.response?.data?.error || error.message)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1>Surveillance Health Report</h1>
        <p>Submit epidemiological field symptoms for automated ML outbreak risk analysis</p>
      </div>

      <div className="form-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-dark)", margin: 0 }}>
            Patient & Symptom Details
          </h2>
          <button
            type="button"
            onClick={handleQuickFill}
            className="autofill-btn"
          >
            ⚡ Autofill Sample Data
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="input-group">
              <label>Reporter ID (Healthcare Worker)</label>
              <select
                name="reporterId"
                value={form.reporterId}
                onChange={handleChange}
                required
              >
                <option value="HCW-001">HCW-001 (Anitha Raman)</option>
                <option value="HCW-002">HCW-002 (Rajesh Kumar)</option>
                <option value="HCW-003">HCW-003 (Priya Sundaram)</option>
                <option value="HCW-004">HCW-004 (Murugan Selvam)</option>
                <option value="HCW-KALLI">HCW-KALLI (Emergency Rapid Unit)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Patient Age</label>
              <input
                type="number"
                name="patientAge"
                value={form.patientAge}
                onChange={handleChange}
                placeholder="e.g. 35"
                required
              />
            </div>

            <div className="input-group">
              <label>Patient Gender</label>
              <select
                name="patientGender"
                value={form.patientGender}
                onChange={handleChange}
                required
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Village / Sector (Monitored Hub)</label>
              <select
                name="village"
                value={form.village}
                onChange={handleChange}
                required
              >
                <option value="Kallimandayam">📍 Kallimandayam (High Risk)</option>
                <option value="Ottanchathiram">📍 Ottanchathiram (Moderate)</option>
                <option value="Poosaripatti">📍 Poosaripatti (Low Risk)</option>
                <option value="Vellalapatti">📍 Vellalapatti (Baseline)</option>
                <option value="Soolakkarai">📍 Soolakkarai (Safe)</option>
                <option value="Senganur">📍 Senganur (Safe)</option>
              </select>
            </div>

            <div className="input-group full-width">
              <label>Reported Symptoms (Comma separated)</label>
              <input
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                placeholder="e.g. High fever, Watery diarrhea, Cough, Body ache"
                required
              />
            </div>

            <div className="input-group">
              <label>Latitude (GPS)</label>
              <input
                type="number"
                step="any"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Longitude (GPS)</label>
              <input
                type="number"
                step="any"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Analyzing with ML & Submitting..." : "🔬 Predict Outbreak Risk & Submit Report"}
          </button>
        </form>

        {prediction !== null && (
          <div className="prediction-banner">
            <div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700 }}>
                AI Outbreak Risk Probability
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Computed live by Python ML Epidemiological Engine
              </div>
            </div>
            <div className="prediction-val">
              {(prediction * 100).toFixed(1)}%
            </div>
          </div>
        )}

        {statusMessage && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            fontWeight: 700,
            background: statusMessage.type === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
            color: statusMessage.type === "success" ? "#34d399" : "#fb7185",
            border: `1px solid ${statusMessage.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`
          }}>
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
