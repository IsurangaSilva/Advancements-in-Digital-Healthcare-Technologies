@echo off
echo Starting Mirror Chat with Login...

:: Check if the user database has been initialized
if not exist "db_initialized.txt" (
  echo First time setup - Creating default user
  python create_default_user.py
  echo Setup complete > db_initialized.txt
)

:: Start the application with login
python start_app.py
pause
