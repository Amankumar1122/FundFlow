@echo off
echo ========================================================
echo Starting FundFlow Full-Stack Environment
echo ========================================================

echo [1/2] Starting Spring Boot Backend on http://localhost:8080...
start "FundFlow Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && java -jar target\fundflow-backend-0.0.1-SNAPSHOT.jar"

echo [2/2] Starting React Vite Frontend on http://localhost:5173...
start "FundFlow Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul
echo Opening FundFlow in your default browser...
start http://localhost:5173

echo Done! Both servers are running in separate terminal windows.
pause
