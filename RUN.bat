@echo off
title Tourism Backend Server
color 0A

echo ========================================
echo   TOURISM MANAGEMENT BACKEND SERVER
echo ========================================
echo.

REM Tìm Java
for /f "tokens=*" %%i in ('where java 2^>nul') do set JAVA_EXE=%%i

if not defined JAVA_EXE (
    echo ERROR: Java not found!
    echo Please install Java JDK 17
    pause
    exit /b 1
)

echo Found Java: %JAVA_EXE%

REM Lấy JAVA_HOME từ đường dẫn java.exe
for %%i in ("%JAVA_EXE%") do set JAVA_BIN=%%~dpi
for %%i in ("%JAVA_BIN:~0,-1%") do set JAVA_HOME=%%~dpi
set JAVA_HOME=%JAVA_HOME:~0,-1%

echo JAVA_HOME: %JAVA_HOME%
echo.

cd backend

echo Starting Spring Boot...
echo This may take 3-5 minutes on first run...
echo.

call mvnw.cmd spring-boot:run

pause
