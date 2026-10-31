@echo off
title FINORA 2026 AI FINANCIAL COMMAND CENTER LAUNCHER
color 0A
cls
echo ======================================================================
echo          FINORA 2026 FINANCIAL COMMAND CENTER & FINVERSE HUB          
echo ======================================================================
echo.
echo Launching microservices and application servers...
echo.
echo [1/4] Starting Python Flask AI Engine Microservice (Port 5001)...
start "Python AI Engine (Port 5001)" /min cmd /k "cd /d %~dp0smart-savings-ai && python app.py"

echo [2/4] Starting Spring Boot Java Backend API (Port 8080)...
start "Spring Boot Backend (Port 8080)" /min cmd /k "cd /d %~dp0smart-savings-planner-backend && C:\Users\varsh\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run"

echo [3/4] Starting FINORA 2026 Command Center Frontend (Port 3000)...
start "FINORA Frontend (Port 3000)" /min cmd /k "cd /d %~dp0smart-savings-planner-frontend && npm run dev"

echo [4/4] Starting FinVerse Analytics Platform (Port 3001)...
start "FinVerse Frontend (Port 3001)" /min cmd /k "cd /d %~dp0finverse-frontend && npm run dev -- --port 3001"

echo.
echo ======================================================================
echo  SUCCESS! All 4 servers and microservices are active in background.
echo.
echo  Opening FINORA 2026 Application in your browser...
echo  URL: http://localhost:3000
echo ======================================================================
echo.

timeout /t 3 >nul
start "" "http://localhost:3000"

pause
