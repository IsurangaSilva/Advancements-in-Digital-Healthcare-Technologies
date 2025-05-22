@echo off
echo Starting Mental Health Tracking Application...

REM Check for Python
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.x and try again
    pause
    exit /b 1
)

REM Run the application
python start_app.py

if %errorlevel% neq 0 (
    echo Application exited with error
    pause
)
