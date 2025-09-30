@echo off
echo Starting Backend...
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-17
mvnw.cmd spring-boot:run
pause
