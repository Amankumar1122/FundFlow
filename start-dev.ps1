# FundFlow Full-Stack Environment Launcher (PowerShell)
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting FundFlow Full-Stack Development Environment" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# 1. Start Spring Boot Backend in a separate window
Write-Host "[1/2] Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; Write-Host 'Starting Spring Boot Backend...' -ForegroundColor Green; java -jar target\fundflow-backend-0.0.1-SNAPSHOT.jar"

# 2. Start Vite Frontend in a separate window
Write-Host "[2/2] Launching React Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; Write-Host 'Starting Vite Frontend...' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# 3. Open browser
Write-Host "Opening http://localhost:5173 in browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "FundFlow is now running! Keep the terminal windows open while developing." -ForegroundColor Cyan
