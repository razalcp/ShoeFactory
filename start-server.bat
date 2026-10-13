@echo off
echo Killing all Node.js processes...
taskkill /IM node.exe /F > nul 2>&1

echo Waiting for processes to terminate...
timeout /t 3 /nobreak > nul

echo Starting server...
cd /d "%~dp0"
node server.js

pause
