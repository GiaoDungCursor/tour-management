@echo off
echo ========================================
echo    STARTING TOURISM BACKEND SERVER
echo ========================================
echo.

cd backend

echo Checking Java installation...
java -version
echo.

echo Starting Spring Boot Application...
echo Please wait, this may take a while on first run...
echo.

call mvnw.cmd spring-boot:run

pause
