@echo off
setlocal
chcp 65001 >nul
title Cavno Article Downloads
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Bootstrap.ps1" %*
set "CAVNO_RESULT=%ERRORLEVEL%"
echo.
if not "%CAVNO_RESULT%"=="0" echo Cavno did not complete. Read the error and log path above.
pause
exit /b %CAVNO_RESULT%
