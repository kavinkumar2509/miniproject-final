# 🌐 SmartHealth AI — Epidemic Surveillance & Early Warning System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kavinkumar2509/miniproject-final)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

An end-to-end distributed epidemiological intelligence system designed for healthcare workers, administrators, and field leads to record community symptoms, predict localized outbreak risks using AI/ML, and visualize real-time regional disease surveillance.

---

## ⚡ Live Vercel Deployment

The frontend is fully optimized for **Vercel** with zero-configuration deployments and standalone preview capability:

- **1-Click Deploy**: Import `kavinkumar2509/miniproject-final` in the [Vercel Dashboard](https://vercel.com/new).
- **Zero Config Needed**: Pre-configured via `vercel.json` with Vite presets, SPA client-side routing, and root build scripts.
- **Built-in Offline/Demo Fallback**: Even without an active MongoDB/Python ML microservice backend, the live Vercel deployment provides an interactive experience using built-in realistic epidemiological data and heuristics.
- **Optional Backend Integration**: Connect to an external backend by setting the `VITE_API_URL` environment variable in your Vercel Project Settings (e.g. `https://your-api.onrender.com/api`).

### Deploying via Vercel CLI

```powershell
# 1. Log in to Vercel
npx vercel login

# 2. Deploy a preview build
npx vercel

# 3. Deploy straight to production
npx vercel --prod
```

---

## 🔐 Demo Credentials & Access Control

Direct access to sensitive surveillance data requires authentication. Use the credentials below or click the quick-login demo pills on the sign-in page:

| Role | Username | Password | Access Scope |
|---|---|---|---|
| **Chief Medical Officer** | `officer` | `health2026` | Full administrative, high-risk quarantine alerts & outbreak controls |
| **Surveillance Administrator** | `admin` | `admin123` | Complete analytics, field camps, worker deployment & dataset exports |
| **Field Health Lead** | `kavin` | `kavin123` | Symptom logging, community camp management & local zone monitoring |

---

## 🏗️ Architecture & Services

```
miniproject-final/
├── Frontend/           # React 18 SPA (Vite, Leaflet Maps, 3D Canvas, Lucide)
├── backend/            # Express REST API Gateway (Node.js, MongoDB, In-memory fallback)
├── ml-service/         # Outbreak Risk Scoring Microservice (FastAPI, Scikit-learn, Python)
├── vercel.json         # Vercel deployment & routing configuration
├── .vercelignore       # Excludes non-frontend files from Vercel builds
├── docker-compose.yml  # Multi-container containerized deployment
└── start_all.ps1       # One-click Windows PowerShell local runner
```

| Service | Port | Tech Stack | Role |
|---|---|---|---|
| **Frontend** | `3000` | React 18, Vite, Leaflet, 3D Canvas | Secure surveillance dashboard, clinical maps, risk charts & notification center |
| **Backend API** | `5000` | Node.js, Express, Mongoose, JWT | REST API gateway, database orchestration & ML microservice proxy |
| **ML Microservice** | `5001` | FastAPI, Python 3.11+, Scikit-learn | Outbreak risk scoring & cluster assessment engine |
| **Database** | `27017` | MongoDB 6.0 + In-memory fallback | Persistent storage for clinical reports and surveillance logs |

---

## 🌟 Key Features

- **Real-Time Surveillance Dashboard**: Dynamic metrics showing active cases, population at risk, high-risk containment zones, and village distribution.
- **Interactive Geospatial Mapping**: Leaflet-powered maps featuring epidemiological cluster points, heatzones, and health camp markers.
- **AI Outbreak Risk Prediction**: ML model scoring symptom patterns (Acute Watery Diarrhea, Vomiting, Chills, Turbid Water Ingestion) to predict disease outbreak probabilities.
- **Field Worker & Health Camp Management**: Track active healthcare workers in field zones and schedule medical relief camps.
- **Dual Runtime Support**: Operates as a full Docker microservice stack locally or as a lightweight standalone web application on Vercel.

---

## 🐳 Docker Deployment (Full Stack)

To run the complete containerized stack (Frontend + Backend + ML Service + MongoDB):

```bash
docker compose up --build
```

Access services:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **ML Service**: [http://localhost:5001/docs](http://localhost:5001/docs)

To stop all containers:
```bash
docker compose down
```

---

## 💻 Local Development (Without Docker)

### Option 1: Start All Services via PowerShell Helper
```powershell
.\start_all.ps1
```

### Option 2: Run Services Individually

1. **ML Microservice (FastAPI)**
   ```powershell
   cd ml-service
   python -m venv .venv
   .\.venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --host 127.0.0.1 --port 5001 --reload
   ```

2. **Backend API (Express)**
   ```powershell
   cd backend
   npm install
   npm run dev
   ```

3. **Frontend (Vite / React)**
   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚙️ Environment Variables

| Variable | Location | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | Frontend (`.env` or Vercel) | `/api` | Base URL of the backend API (leave blank for standalone demo mode) |
| `PORT` | Backend (`.env`) | `5000` | Port for the Express server |
| `MONGO_URI` | Backend (`.env`) | `mongodb://127.0.0.1:27017/smarthealth` | MongoDB connection string |
| `ML_API_URL` | Backend (`.env`) | `http://localhost:5001/predict` | Endpoint of the FastAPI ML microservice |
| `JWT_SECRET` | Backend (`.env`) | `smarthealth_secret_key` | Secret key for signing JWT authentication tokens |

---

## 📄 License

This project is licensed under the MIT License — created for SIH (Smart India Hackathon).
