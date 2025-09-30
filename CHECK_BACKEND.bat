@echo off
echo Checking if Backend is running...
echo.

curl http://localhost:8080/api/tours

echo.
echo.
echo If you see JSON data above, Backend is running successfully!
echo If you see error, Backend is not running yet.
echo.
pause
