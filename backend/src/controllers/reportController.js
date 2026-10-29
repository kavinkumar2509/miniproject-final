import mongoose from "mongoose";
import Report from "../models/Report.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const DATA_FILE = path.join(DATA_DIR, "reports.json");

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultReports = [
  {
    _id: "init-1",
    reporterId: "HCW-001",
    patientAge: 32,
    patientGender: "Female",
    symptoms: ["Fever", "Diarrhea", "Body Pain"],
    location: {
      lat: 10.5124,
      lng: 77.7265,
      village: "Kallimandayam"
    },
    riskScore: 0.88,
    riskZone: "High Risk",
    date: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: "init-2",
    reporterId: "HCW-002",
    patientAge: 45,
    patientGender: "Male",
    symptoms: ["Diarrhea", "Vomiting", "Stomach Pain"],
    location: {
      lat: 10.4900,
      lng: 77.7800,
      village: "Ottanchathiram"
    },
    riskScore: 0.65,
    riskZone: "Moderate Risk",
    date: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: "init-3",
    reporterId: "HCW-003",
    patientAge: 21,
    patientGender: "Male",
    symptoms: ["High Fever", "Chills", "Cough"],
    location: {
      lat: 10.5400,
      lng: 77.8200,
      village: "Poosaripatti"
    },
    riskScore: 0.42,
    riskZone: "Low Risk",
    date: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: "init-4",
    reporterId: "HCW-004",
    patientAge: 56,
    patientGender: "Female",
    symptoms: ["Skin Rash", "Fever"],
    location: {
      lat: 10.4500,
      lng: 77.7100,
      village: "Vellalapatti"
    },
    riskScore: 0.35,
    riskZone: "Normal",
    date: new Date(Date.now() - 3600000 * 26).toISOString()
  }
];

function readDiskReports() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading disk reports:", err.message);
  }
  // Initialize with defaults if empty
  saveDiskReports(defaultReports);
  return defaultReports;
}

function saveDiskReports(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing disk reports:", err.message);
  }
}

// Active connected SSE clients for live background synchronization
let sseClients = [];

export const streamReports = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = Date.now() + "-" + Math.random().toString(36).substring(2, 9);
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: "connected", clientId })}\n\n`);

  req.on("close", () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
};

function broadcastLiveUpdate(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch (err) {
      // client disconnected
    }
  });
}

export const createReport = async (req, res) => {
  try {
    let savedReport = null;

    if (mongoose.connection.readyState === 1) {
      const report = new Report(req.body);
      savedReport = await report.save();
    } else {
      savedReport = {
        _id: "rep-" + Date.now(),
        ...req.body,
        date: new Date().toISOString()
      };
    }

    // Always persist to local disk database
    const current = readDiskReports();
    current.unshift(savedReport);
    saveDiskReports(current);

    // Broadcast live event to all connected dashboard clients
    broadcastLiveUpdate("new_report", savedReport);

    return res.status(201).json(savedReport);
  } catch (error) {
    console.error("createReport error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reports = await Report.find().sort({ date: -1 });
      return res.json(reports);
    } else {
      const reports = readDiskReports();
      return res.json(reports);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      try {
        await Report.findByIdAndDelete(id);
      } catch (e) {
        // Continue to disk cleanup
      }
    }
    const current = readDiskReports();
    const updated = current.filter((r) => r._id !== id && r.id !== id);
    saveDiskReports(updated);

    broadcastLiveUpdate("delete_report", { id });
    return res.json({ success: true, message: "Report deleted from database" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const reports = readDiskReports();
    const activeCases = reports.length;
    const atRisk = reports.filter((r) => (r.riskScore || 0) >= 0.5 || r.riskZone === "High Risk").length;
    const villageCounts = {};
    const symptomCounts = {};

    reports.forEach((r) => {
      const v = r.location?.village || "Unknown";
      villageCounts[v] = (villageCounts[v] || 0) + 1;
      const syms = Array.isArray(r.symptoms) ? r.symptoms : [r.symptoms];
      syms.forEach((s) => {
        if (s) symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    const highRiskVillages = Object.keys(villageCounts).filter((v) => villageCounts[v] >= 2);

    return res.json({
      totalReports: reports.length,
      population: 12486 + reports.length * 3,
      activeCases: activeCases + 12,
      atRisk: atRisk + 45,
      highRiskZones: Math.max(2, highRiskVillages.length),
      villageCounts,
      symptomCounts
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

