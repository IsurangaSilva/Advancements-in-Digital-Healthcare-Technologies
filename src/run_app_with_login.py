"""
Main Launcher Script for Mental Health Tracking Application
This script starts the login page first, and the main application only launches after successful login.
"""

import os
import sys
import logging
import subprocess

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("launcher")

def main():
    """Launch the application with login first"""
    try:
        logger.info("Starting Mirror Chat application with login")
        
        # Check if pymongo and bcrypt are installed
        try:
            import pymongo
            import bcrypt
        except ImportError as e:
            logger.error(f"Required package missing: {e}")
            print(f"Error: {e}. Please install required packages with:")
            print("pip install pymongo bcrypt")
            return 1        # Launch login screen
        # The login script will launch main.py after successful login
        login_path = "login_new.py"
        if os.path.exists(login_path):
            subprocess.run([sys.executable, login_path])
        else:
            logger.error(f"Login file not found: {login_path}")
            print(f"Error: Login file not found: {login_path}")
            return 1
            
        return 0
    except Exception as e:
        logger.error(f"Failed to start application: {e}")
        print(f"Error launching application: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
