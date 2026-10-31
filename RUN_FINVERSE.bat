@echo off
title FINVERSE AI - FINANCIAL PLATFORM LAUNCHER
color 0B
cls

echo ==============================================================================
echo                 FINVERSE AI - INTELLIGENT FINANCIAL PLATFORM                  
echo ==============================================================================
echo.
echo [INFO] Initializing FinVerse AI Microservices and Servers...
echo.

:: Detect Maven Executable
set "MVN_CMD=mvn"
where mvn >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\Users\varsh\maven\apache-maven-3.9.6\bin\mvn.cmd" (
        set "MVN_CMD=C:\Users\varsh\maven\apache-maven-3.9.6\bin\mvn.cmd"
    ) else (
        echo [WARNING] Maven not found in PATH or standard location.
    )
)

:: Step 1: Start Python AI/ML Microservice (Port 5000)
echo [1/3] Starting FinVerse ML Prediction Engine (Port 5000)...
start "FinVerse ML Engine (Port 5000)" cmd /k "cd /d %~dp0finverse-ml && python app.py"

timeout /t 2 >nul

:: Step 2: Start Spring Boot REST API Backend (Port 8080)
echo [2/3] Starting FinVerse Spring Boot Backend API (Port 8080)...
start "FinVerse Backend API (Port 8080)" cmd /k "cd /d %~dp0finverse-backend && "%MVN_CMD%" spring-boot:run"

timeout /t 3 >nul

:: Step 3: Start React 18 Frontend Platform (Port 3000)
echo [3/3] Starting FinVerse React Frontend Platform (Port 3000)...
start "FinVerse Frontend (Port 3000)" cmd /k "cd /d %~dp0finverse-frontend && npm run dev"

echo.
echo ==============================================================================
echo  ALL FINVERSE AI SERVICES ARE LAUNCHING IN BACKGROUND WINDOWS:
echo.
echo  * AI/ML Prediction Microservice : http://localhost:5000
echo  * Spring Boot REST API & H2 DB  : http://localhost:8080/api
echo  * H2 Database Console           : http://localhost:8080/h2-console
echo  * FinVerse Frontend Application : http://localhost:3000
echo.
echo  Default Demo Credentials:
echo  - User  : user@finverse.com  ^| Password: password123
echo  - Admin : admin@finverse.com ^| Password: password123
echo ==============================================================================
echo.

timeout /t 5 >nul
start "" "http://localhost:3000"

echo FinVerse AI is active. Keep the service console windows open while testing.
pause
