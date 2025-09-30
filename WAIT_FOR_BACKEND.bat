@echo off
title Checking Backend Status
color 0E

:check
echo Checking if backend is running on port 8080...
echo.

curl http://localhost:8080/api/tours 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   BACKEND IS RUNNING SUCCESSFULLY!
    echo ========================================
    echo.
    echo You can now access:
    echo   - http://localhost:8080/api/tours
    echo   - http://localhost:8080/api/categories
    echo.
    pause
    exit
) else (
    echo Backend not ready yet...
    echo Waiting 10 seconds...
    echo.
    timeout /t 10 /nobreak >nul
    goto check
)
