# Mental Health Tracking and Depression Prediction System - Login

This document explains how to use the login system for the Mental Health Tracking and Depression Prediction application.

## Setup Instructions

1. **Install required packages**
   ```
   pip install -r requirements.txt
   ```

2. **Set up MongoDB**
   - Install MongoDB if not already installed
   - Start the MongoDB service
   - The application will create the database and collections automatically

3. **Create environment file**
   - Run the environment setup script:
   ```
   python create_env_file.py
   ```
   - This will create an `env` file with MongoDB connection details
   - Default connection is `mongodb://localhost:27017` with database name `mental_health_app`

4. **Create a default user**
   - Run the user creation script:
   ```
   python create_default_user.py
   ```
   - Default credentials:
     - Email: patient@example.com
     - Password: password123
     - Role: patient

5. **Test the setup**
   - Run the test script to verify everything is working:
   ```
   python test_login_flow.py
   ```
   - This will check MongoDB connection, environment file, and user setup

## Starting the Application

### Windows
Run the `run_login.bat` file by double-clicking it.

### Command Line
```
python start_app.py
```

## Login Features

The implemented login system has the following features:

1. **Authentication with bcrypt**
   - Passwords are securely hashed with bcrypt
   - Verification is done securely without storing plaintext passwords

2. **Remember Me Functionality**
   - Check the "Remember me" box to save your email
   - Your email will be pre-filled on subsequent logins
   - Login state is stored in a file in the `src` folder

3. **MongoDB Integration**
   - User accounts are stored in MongoDB
   - Connection details are stored in the `env` file
   - Connection is managed through a singleton pattern

4. **Error Handling**
   - Informative error messages for different failure cases
   - Logging to track issues
   - Database connection failures are handled gracefully

5. **Modern UI**
   - Clean, modern interface with shadow effects
   - Responsive design
   - Hover effects for better user experience

## Troubleshooting

1. **MongoDB Connection Issues**
   - Verify MongoDB service is running
   - Check the connection details in the `env` file
   - Run `python test_db_connection.py` to test the connection

2. **Login Failures**
   - Verify user exists in the database
   - Check that the user has the correct role ("patient")
   - Passwords are case-sensitive

3. **Application Start Issues**
   - Verify that `src/main.py` exists
   - Check all Python dependencies are installed
   - Check logs for specific error messages
