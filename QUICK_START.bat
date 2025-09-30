@echo off
title Tourism Backend Server
color 0A
echo.
echo ================================================
echo     TOURISM MANAGEMENT - BACKEND SERVER
echo ================================================
echo.
echo Starting backend server...
echo Please wait, first run may take 2-5 minutes...
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================
echo.

cd backend
call mvnw.cmd spring-boot:run

pause
