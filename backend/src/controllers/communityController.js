import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const CAMPS_FILE = path.join(DATA_DIR, "camps.json");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CAMPS = [
  {
    id: "camp-1",
    day: "21",
    month: "Oct",
    title: "General Health Checkup & Fever Triage",
    village: "Poosaripatti",
    status: "Completed",
    badgeClass: "camp-completed",
    targetBeneficiaries: 240,
    attended: 215,
    date: "2026-10-21"
  },
  {
    id: "camp-2",
    day: "25",
    month: "Oct",
    title: "Water Contamination & Chlorination Drive",
    village: "Kallimandayam",
    status: "Completed",
    badgeClass: "camp-completed",
    targetBeneficiaries: 350,
    attended: 310,
    date: "2026-10-25"
  },
  {
    id: "camp-3",
    day: "28",
    month: "Oct",
    title: "Anti-Larval & Dengue Fogging Drive",
    village: "Ottanchathiram",
    status: "Upcoming",
    badgeClass: "camp-upcoming",
    targetBeneficiaries: 500,
    attended: 0,
    date: "2026-10-28"
  }
];

function readCamps() {
  try {
    if (fs.existsSync(CAMPS_FILE)) {
      return JSON.parse(fs.readFileSync(CAMPS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading camps:", e);
  }
  fs.writeFileSync(CAMPS_FILE, JSON.stringify(DEFAULT_CAMPS, null, 2), "utf-8");
  return DEFAULT_CAMPS;
}

function saveCamps(camps) {
  fs.writeFileSync(CAMPS_FILE, JSON.stringify(camps, null, 2), "utf-8");
}

function readReports() {
  try {
    if (fs.existsSync(REPORTS_FILE)) {
      return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Error reading reports for workers:", e);
  }
  return [];
}

// Get Frontline Healthcare Workers with REAL counts computed from live reports database
export const getWorkers = (req, res) => {
  const reports = readReports();

  // Baseline workers
  const workers = [
    {
      id: "HCW-001",
      name: "Anitha Raman",
      assignedZone: "Kallimandayam",
      baseReports: 6,
      phone: "+91 94421-50811",
      status: "Active in Field"
    },
    {
      id: "HCW-002",
      name: "Rajesh Kumar",
      assignedZone: "Ottanchathiram",
      baseReports: 4,
      phone: "+91 98422-71023",
      status: "Active in Field"
    },
    {
      id: "HCW-003",
      name: "Priya Sundaram",
      assignedZone: "Poosaripatti",
      baseReports: 3,
      phone: "+91 97890-44129",
      status: "Reporting"
    },
    {
      id: "HCW-004",
      name: "Murugan Selvam",
      assignedZone: "Vellalapatti",
      baseReports: 2,
      phone: "+91 94862-33901",
      status: "Standby"
    }
  ];

  // Count reports dynamically for each worker from live database
  const reportsByWorker = {};
  reports.forEach((r) => {
    const wId = (r.reporterId || "").toUpperCase().trim();
    reportsByWorker[wId] = (reportsByWorker[wId] || 0) + 1;
  });

  const liveWorkers = workers.map((w) => {
    const liveCount = reportsByWorker[w.id] || 0;
    return {
      ...w,
      reportsSubmitted: w.baseReports + liveCount,
      liveDbRecords: liveCount
    };
  });

  return res.json(liveWorkers);
};

// Get health camps
export const getCamps = (req, res) => {
  const camps = readCamps();
  return res.json(camps);
};

// Create a new health camp (dynamic database write)
export const createCamp = (req, res) => {
  try {
    const { title, village, date, targetBeneficiaries } = req.body;
    if (!title || !village) {
      return res.status(400).json({ error: "Title and village are required" });
    }

    const campDate = date ? new Date(date) : new Date();
    const day = String(campDate.getDate()).padStart(2, "0");
    const month = campDate.toLocaleString("en-US", { month: "short" });

    const newCamp = {
      id: "camp-" + Date.now(),
      day,
      month,
      title,
      village,
      status: "Upcoming",
      badgeClass: "camp-upcoming",
      targetBeneficiaries: Number(targetBeneficiaries) || 200,
      attended: 0,
      date: campDate.toISOString().split("T")[0]
    };

    const camps = readCamps();
    camps.unshift(newCamp);
    saveCamps(camps);

    return res.status(201).json(newCamp);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
