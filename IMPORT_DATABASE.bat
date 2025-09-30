@echo off
echo ========================================
echo    IMPORT DATABASE TOURISM_DB
echo ========================================
echo.
echo Importing data to MySQL...
echo Please enter your MySQL root password when prompted
echo.

mysql -u root -p tourism_db < database\tourism_db.sql

echo.
echo Database imported successfully!
echo.
pause
