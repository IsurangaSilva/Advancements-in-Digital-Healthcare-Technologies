"""
Enhanced test script specifically for sending FER emotion_data.json to MongoDB
With improved error handling and logging
"""
import os
import sys
import json
import time
from datetime import datetime
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("test_fer_db_sender_enhanced")

# Add the FER module to path if needed
sys.path.append(os.path.dirname(__file__))

def manually_send_to_mongodb():
    """Send emotion data to MongoDB without using the SessionDBSender class"""
    try:
        from pymongo import MongoClient
        from dotenv import load_dotenv
        
        # Load environment variables
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "env")
        logger.info(f"Loading environment variables from: {env_path}")
        load_dotenv(env_path)
        
        # Get MongoDB connection details
        mongo_uri = os.getenv("MONGODB_URL")
        db_name = os.getenv("MONGO_DB_NAME")
        
        if not mongo_uri or not db_name:
            logger.warning("MongoDB environment variables not loaded correctly!")
            logger.warning(f"MONGODB_URL: {'Found' if mongo_uri else 'Missing'}")
            logger.warning(f"MONGO_DB_NAME: {'Found' if db_name else 'Missing'}")
            # Provide default values if environment variables are missing
            mongo_uri = mongo_uri or "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
            db_name = db_name or "emotionDB"
        
        # Connect to MongoDB
        logger.info(f"Connecting to MongoDB database: {db_name}")
        logger.info(f"MongoDB URI: {mongo_uri[:20]}...")  # Show only part of URI for security
        
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            # Test the connection
            client.server_info()
            logger.info("MongoDB connection successful")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            return
            
        db = client[str(db_name)]
        collection = db["fer-aggregates"]
        
        # Verify collection exists or can be created
        if "fer-aggregates" not in db.list_collection_names():
            logger.warning("Collection 'fer-aggregates' does not exist. It will be created when data is inserted.")
        
        # Read emotion data
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        emotion_file = os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        
        if not os.path.exists(emotion_file):
            logger.error(f"File not found: {emotion_file}")
            return
        
        logger.info(f"Reading data from: {emotion_file}")
        with open(emotion_file, "r") as f:
            data = json.load(f)
        
        logger.info(f"Found {len(data)} total entries in the file")
        
        # Check for entries that need to be sent
        unsent_entries = [entry for entry in data if not entry.get("db_status", False)]
        
        if not unsent_entries:
            logger.info("No unsent entries found.")
            return
        
        logger.info(f"Found {len(unsent_entries)} unsent entries.")
        
        # Send unsent entries to MongoDB
        for i, entry in enumerate(unsent_entries):
            try:
                # Create a copy to send to MongoDB to avoid _id serialization issues
                db_entry = entry.copy()
                
                # Log the document we're about to insert
                logger.info(f"Preparing to insert document with timestamp {entry.get('timestamp')}")
                
                # Check if document with this timestamp already exists
                existing_doc = collection.find_one({"timestamp": entry.get("timestamp")})
                if existing_doc:
                    logger.warning(f"Document with timestamp {entry.get('timestamp')} already exists in database. Skipping.")
                    # Update the original entry in the data list
                    idx = data.index(entry)
                    data[idx]["db_status"] = True
                    continue
                
                result = collection.insert_one(db_entry)
                inserted_id = result.inserted_id
                
                # Verify insertion
                inserted_doc = collection.find_one({"_id": inserted_id})
                if not inserted_doc:
                    logger.error(f"Insertion verification failed for entry with timestamp {entry.get('timestamp')}")
                    continue
                
                # Update the original entry in the data list
                idx = data.index(entry)
                data[idx]["db_status"] = True
                
                logger.info(f"Sent entry {i+1}/{len(unsent_entries)} with timestamp {entry.get('timestamp')} to MongoDB with ID: {inserted_id}")
            except Exception as e:
                logger.error(f"Error sending entry with timestamp {entry.get('timestamp')}: {e}")
                logger.error(traceback.format_exc())
        
        # Write updated data back to file
        try:
            with open(emotion_file, "w") as f:
                json.dump(data, f, indent=4)
            
            logger.info(f"Updated {emotion_file} with new db_status values")
        except Exception as e:
            logger.error(f"Error updating {emotion_file}: {e}")
            logger.error(traceback.format_exc())
        
    except Exception as e:
        logger.error(f"Error in manually_send_to_mongodb: {e}")
        logger.error(traceback.format_exc())

def check_mongo_collections():
    """Check what collections exist and how many documents they contain"""
    try:
        from pymongo import MongoClient
        from dotenv import load_dotenv
        
        # Load environment variables
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "env")
        logger.info(f"Loading environment variables from: {env_path}")
        load_dotenv(env_path)
        
        # Get MongoDB connection details
        mongo_uri = os.getenv("MONGODB_URL")
        db_name = os.getenv("MONGO_DB_NAME")
        
        if not mongo_uri or not db_name:
            logger.warning("MongoDB environment variables not loaded correctly!")
            logger.warning(f"MONGODB_URL: {'Found' if mongo_uri else 'Missing'}")
            logger.warning(f"MONGO_DB_NAME: {'Found' if db_name else 'Missing'}")
            # Provide default values if environment variables are missing
            mongo_uri = mongo_uri or "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
            db_name = db_name or "emotionDB"
        
        # Connect to MongoDB
        logger.info(f"Connecting to MongoDB database: {db_name}")
        
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test the connection
        client.server_info()
        logger.info("MongoDB connection successful")
            
        db = client[str(db_name)]
        
        # List all collections
        collections = db.list_collection_names()
        logger.info(f"Available collections in {db_name}:")
        for collection_name in collections:
            count = db[collection_name].count_documents({})
            logger.info(f"  - {collection_name}: {count} documents")
            
            # Check our specific collections
            if collection_name in ["fer-aggregates", "fer-session-aggregates", "fer-hourly-aggregates"]:
                if count > 0:
                    sample = db[collection_name].find_one()
                    # Convert ObjectId to string for printing
                    sample['_id'] = str(sample['_id'])
                    logger.info(f"    Sample document: {json.dumps(sample, indent=2)}")
                else:
                    logger.warning(f"    Collection '{collection_name}' is empty")
        
    except Exception as e:
        logger.error(f"Error checking MongoDB collections: {e}")
        logger.error(traceback.format_exc())

def reset_db_status():
    """Reset db_status to false for testing purposes"""
    try:
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        emotion_file = os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        
        if not os.path.exists(emotion_file):
            logger.error(f"File not found: {emotion_file}")
            return
        
        with open(emotion_file, "r") as f:
            data = json.load(f)
        
        # Ask how many entries to reset
        entries_to_reset = min(len(data), 3)  # Default to 3 or less if fewer entries exist
        
        logger.info(f"Resetting db_status to false for {entries_to_reset} entries")
        
        # Reset the most recent entries
        for i in range(entries_to_reset):
            if i < len(data):
                data[i]["db_status"] = False
                logger.info(f"Reset db_status for entry with timestamp {data[i].get('timestamp')}")
        
        # Write updated data back to file
        with open(emotion_file, "w") as f:
            json.dump(data, f, indent=4)
        
        logger.info(f"Updated {emotion_file} with reset db_status values")
        
    except Exception as e:
        logger.error(f"Error resetting db_status: {e}")
        logger.error(traceback.format_exc())

def inspect_env_file():
    """Check if the env file exists and what variables it contains"""
    try:
        env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "env")
        
        if not os.path.exists(env_path):
            logger.error(f"Environment file not found: {env_path}")
            return
            
        logger.info(f"Environment file found: {env_path}")
        
        # Read the file but don't print sensitive values
        with open(env_path, "r") as f:
            lines = f.readlines()
            
        logger.info(f"Environment file contains {len(lines)} lines")
        
        # Log presence of important variables (without their values)
        var_names = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith("#"):
                var_name = line.split("=")[0].strip()
                var_names.append(var_name)
                
        logger.info(f"Environment variables defined: {', '.join(var_names)}")
        
        # Specifically check for MongoDB variables
        if "MONGODB_URL" in var_names:
            logger.info("MONGODB_URL is defined in the env file")
        else:
            logger.warning("MONGODB_URL is NOT defined in the env file")
            
        if "MONGO_DB_NAME" in var_names:
            logger.info("MONGO_DB_NAME is defined in the env file")
        else:
            logger.warning("MONGO_DB_NAME is NOT defined in the env file")
            
    except Exception as e:
        logger.error(f"Error inspecting env file: {e}")
        logger.error(traceback.format_exc())

if __name__ == "__main__":
    print("Enhanced FER Database Sender Test")
    print("1. Manually send emotion data to MongoDB with enhanced logging")
    print("2. Check MongoDB collections and documents")
    print("3. Reset db_status to false for testing")
    print("4. Inspect environment file")
    
    choice = input("Enter your choice (1-4): ")
    
    if choice == "1":
        manually_send_to_mongodb()
    elif choice == "2":
        check_mongo_collections()
    elif choice == "3":
        reset_db_status()
    elif choice == "4":
        inspect_env_file()
    else:
        print("Invalid choice. Exiting.")
