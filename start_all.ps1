Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting SIH-2025 SmartHealth System " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$scriptRoot = $PSScriptRoot

# 1. Start ML Service (Port 5001)
Write-Host "`n[1/3] Starting ML Service on port 5001..." -ForegroundColor Yellow
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot\ml-service'; .\.venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 5001"

# 2. Start Backend API (Port 5000)
Write-Host "[2/3] Starting Backend API on port 5000..." -ForegroundColor Yellow
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot\backend'; node src/index.js"

# 3. Start Frontend (Port 3000)
Write-Host "[3/3] Starting Frontend Dev Server on port 3000..." -ForegroundColor Yellow
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd '$scriptRoot\Frontend'; npm run dev"

Write-Host "`nAll 3 services have been initiated!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "ML Engine: http://localhost:5001" -ForegroundColor White
