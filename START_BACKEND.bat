@echo off
echo ========================================
echo    STARTING BACKEND SERVER
echo ========================================
echo.

cd /d "%~dp0backend"

echo Current directory: %CD%
echo.

echo Checking mvnw.cmd...
if exist "mvnw.cmd" (
    echo mvnw.cmd found!
    echo.
    echo Starting Spring Boot...
    echo This will take 2-5 minutes on first run...
    echo.
    call mvnw.cmd spring-boot:run
) else (
    echo ERROR: mvnw.cmd not found!
    echo Please make sure you are in the correct directory
    pause
)
