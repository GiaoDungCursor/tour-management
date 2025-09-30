# Import Database using PowerShell
Write-Host "Importing database..." -ForegroundColor Green

$sqlFile = "D:\DoAnCuaGiao\database\tourism_db.sql"
Get-Content $sqlFile | mysql -u root tourism_db

# If MySQL has password, use:
# Get-Content $sqlFile | mysql -u root -p tourism_db

Write-Host "Database imported successfully!" -ForegroundColor Green
Read-Host "Press Enter to exit"
