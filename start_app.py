#!/usr/bin/env python3
"""
Main entry point for the Mental Health Tracking and Depression Prediction System
This script launches the application with login functionality
"""

import sys
import os
import subprocess
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("starter")

def check_env_file():
    """Check if env file exists, create if not"""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "env")
    if not os.path.exists(env_path):
        print("Environment file not found. Setting up MongoDB connection details.")
        # Run the env file creation script
        subprocess.run([sys.executable, "create_env_file.py"])
        return True
    return False

def check_default_user():
    """Check if default user exists, create if not"""
    try:
        # Run the create_default_user script to check/create default user
        subprocess.run([sys.executable, "create_default_user.py"])
    except Exception as e:
        logger.error(f"Error checking default user: {e}")

if __name__ == "__main__":
    # Check if required packages are installed
    try:
        import pymongo
        import bcrypt
        from pymongo import MongoClient
    except ImportError as e:
        print(f"Missing required package: {e}")
        print("Please install required packages with: pip install pymongo bcrypt")
        sys.exit(1)
    
    # Check for env file and default user
    check_env_file()
    check_default_user()
    
    # Start the login page
    print("Starting Mirror Chat application...")
    try:
        # Use the new login implementation
        login_path = os.path.join("src", "login_new.py")
        if os.path.exists(login_path):
            subprocess.run([sys.executable, login_path])
        else:
            logger.error(f"Login file not found: {login_path}")
            print(f"Error: Login file not found: {login_path}")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        print(f"Error launching application: {e}")
        sys.exit(1)
