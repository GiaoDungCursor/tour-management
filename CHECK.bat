@echo off
:loop
cls
echo =====================================
echo   CHECKING BACKEND STATUS...
echo =====================================
echo.
curl http://localhost:8080/api/categories 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo.
    echo ========================================
    echo   BACKEND IS RUNNING SUCCESSFULLY!
    echo ========================================
    echo.
    echo Open browser:
    echo   http://localhost:8080/api/tours
    echo.
    pause
    exit
) else (
    echo.
    echo Backend not ready yet...
    echo Waiting 15 seconds...
    timeout /t 15 /nobreak >nul
    goto loop
)
