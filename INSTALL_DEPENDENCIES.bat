@echo off
title FINVERSE AI - ENVIRONMENT SETUP & DEPENDENCY INSTALLER
color 0E
cls

echo ==============================================================================
echo           FINVERSE AI - AUTOMATIC DEPENDENCY SETUP & VERIFICATION             
echo ==============================================================================
echo.

echo [1/3] Installing Python AI/ML microservice requirements...
cd /d "%~dp0finverse-ml"
pip install -r requirements.txt
echo.

echo [2/3] Checking Node.js frontend dependencies...
cd /d "%~dp0finverse-frontend"
call npm install
echo.

echo [3/3] Checking AI Chat Assistant dependencies...
cd /d "%~dp0ai-chat-assistant\backend"
call npm install
cd /d "%~dp0ai-chat-assistant\frontend"
call npm install
echo.

echo ==============================================================================
echo  SETUP COMPLETE! All dependencies have been verified and installed.
echo  You can now run RUN_FINVERSE.bat to launch the application.
echo ==============================================================================
pause
