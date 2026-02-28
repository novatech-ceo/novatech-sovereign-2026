@echo off
title NOVATECH EMPIRE SERVER
color 0E
cls

echo ====================================================
echo    NOVATECH FOUNDER HOLDINGS LTD - SYSTEM ONLINE
echo ====================================================
echo [STATUS] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not recognized. Please reinstall it.
    pause
    exit /b 1
)

echo [STATUS] Freeing port 3080 if in use...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3080') do taskkill /PID %%a /F 2>nul
timeout /t 1 /nobreak >nul

echo [STATUS] Navigating to API Core...
cd /d "D:\NOVATECH-FOUNDER-HQ\api"

echo [STATUS] Starting Unified Server (API + Front-end)...
echo ----------------------------------------------------
node server-unified.js

if %errorlevel% neq 0 (
    color 0C
    echo [CRITICAL] Server stopped or port 3080 is blocked.
    echo [HELP] Close any other app using port 3080 and run again.
)
pause
