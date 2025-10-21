@echo off
echo ========================================
echo   KHOI DONG FRONTEND - REACT APP
echo ========================================
echo.

cd /d "%~dp0"

echo Dang kiem tra Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Khong tim thay Node.js!
    echo Vui long cai dat Node.js tu: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js: 
node --version

echo.
echo Dang kiem tra dependencies...
if not exist "node_modules\" (
    echo [INFO] Chua cai dat dependencies. Dang cai dat...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Cai dat dependencies that bai!
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   FRONTEND DANG KHOI DONG...
echo ========================================
echo.
echo Frontend se chay tai: http://localhost:3000
echo Bam Ctrl+C de dung server
echo.

npm start

pause

