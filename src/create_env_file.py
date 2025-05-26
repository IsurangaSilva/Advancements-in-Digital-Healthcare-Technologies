"""
Create environment file with MongoDB connection details
Run this script to create the env file with MongoDB connection details
"""

import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("env_setup")

# Default MongoDB connection settings
# Default to MongoDB Atlas connection string if available, otherwise use localhost
DEFAULT_MONGO_URI = "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
DEFAULT_DB_NAME = "emotionDB"

def create_env_file():
    """Create env file with MongoDB connection details"""
    # env file should be in the parent directory (project root)
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "env")
    
    # Check if file already exists
    if os.path.exists(env_path):
        logger.info(f"Environment file already exists at {env_path}")
        return False
    
    # Get MongoDB connection details from user
    print("Setting up MongoDB connection details...")
    mongo_uri = input(f"MongoDB URI (default: {DEFAULT_MONGO_URI}): ").strip() or DEFAULT_MONGO_URI
    db_name = input(f"Database name (default: {DEFAULT_DB_NAME}): ").strip() or DEFAULT_DB_NAME
      # Create the env file
    try:
        with open(env_path, "w") as f:
            f.write("# MongoDB Connection Details\n")
            f.write(f"MONGO_URI={mongo_uri}\n")
            f.write(f"MONGODB_URL={mongo_uri}\n")  # Add MONGODB_URL for compatibility
            f.write(f"MONGO_DB_NAME={db_name}\n")
        
        logger.info(f"Environment file created at {env_path}")
        print(f"Environment file created with MongoDB connection details.")
        return True
    except Exception as e:
        logger.error(f"Error creating environment file: {e}")
        print(f"Error creating environment file: {e}")
        return False

if __name__ == "__main__":
    create_env_file()
