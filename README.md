# SmartHealth AI — Epidemic Surveillance & Early Warning System (SIH-2025)

An end-to-end distributed system for health workers to record epidemiological symptoms in the field, predict localized outbreak risks via AI/ML, and view real-time regional surveillance analytics.

---

## 🏗️ Architecture & Services

| Service | Port | Tech Stack | Role |
|---|---|---|---|
| **Frontend** | `3000` | React 18/19, Vite, React Router, Leaflet, Canvas 3D | Secure surveillance portal, 3D Globe, clinical maps, analytics & notifications |
| **Backend API** | `5000` | Node.js, Express, Mongoose, JWT Auth | REST API gateway, database orchestration & ML microservice proxy |
| **ML Microservice** | `5001` | FastAPI, Python 3.11/3.12, Uvicorn, Scikit-learn, Pandas | AI/ML outbreak risk scoring & cluster assessment |
| **Database** | `27017` | MongoDB 6.0 + In-memory fallback | Persistent storage for field surveillance logs and notifications |

---

## 🔐 Authentication & Access Control

Direct access to the dashboard is blocked. Users must authenticate via the secure portal:

- **Portal URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Demo Credentials**:
  - **Chief Officer**: `officer` / `health2026`
  - **Administrator**: `admin` / `admin123`
  - **Field Lead**: `kavin` / `kavin123`
  - *(One-click demo credential pills are also built directly into the login screen)*

---

## 🐳 Docker Containerization (One-Click Launch)

You can build and spin up the complete containerized stack using Docker Compose:

```bash
docker compose up --build
```

This will automatically build and network:
- `sih-frontend` on port `3000` (Nginx reverse proxy)
- `sih-backend` on port `5000`
- `sih-ml-service` on port `5001`
- `sih-mongodb` on port `27017`

To shut down containers:
```bash
docker compose down
```

---

## 🚀 Local Development (Without Docker)

Launch all 3 services together using the PowerShell helper:

```powershell
.\start_all.ps1
```

Or run individually:

### 1. ML Microservice (FastAPI)
```powershell
cd ml-service
.\.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 5001
```

### 2. Backend (Node.js/Express)
```powershell
cd backend
node src/index.js
```

### 3. Frontend (React/Vite)
```powershell
cd Frontend
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚡ Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import the repository.
3. Build Settings are preconfigured via `vercel.json` (or set Root Directory to `Frontend`).
4. (Optional) In Environment Variables, set `VITE_API_URL` to your production backend API URL (if not set, the frontend runs standalone with built-in realistic mock data).
5. Click **Deploy**.

### Option B: Via Vercel CLI
```powershell
# 1. Login to Vercel
npx vercel login

# 2. Deploy preview
npx vercel

# 3. Deploy to production
npx vercel --prod
```

