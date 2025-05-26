"""
Test script specifically for sending FER emotion_data.json to MongoDB
"""
import os
import sys
import json
import time
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("test_fer_db_sender")

# Add the FER module to path if needed
sys.path.append(os.path.dirname(__file__))

def manually_send_to_mongodb():
    """Send emotion data to MongoDB without using the SessionDBSender class"""
    try:
        from pymongo import MongoClient
        from dotenv import load_dotenv
        
        # Load environment variables
        load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "env"))
        
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
        client = MongoClient(mongo_uri)
        db = client[str(db_name)]
        collection = db["fer-aggregates"]
        
        # Read emotion data
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        emotion_file = os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        
        if not os.path.exists(emotion_file):
            logger.error(f"File not found: {emotion_file}")
            return
        
        with open(emotion_file, "r") as f:
            data = json.load(f)
        
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
                collection.insert_one(db_entry)
                
                # Update the original entry in the data list
                idx = data.index(entry)
                data[idx]["db_status"] = True
                
                logger.info(f"Sent entry {i+1}/{len(unsent_entries)} with timestamp {entry.get('timestamp')} to MongoDB")
            except Exception as e:
                logger.error(f"Error sending entry with timestamp {entry.get('timestamp')}: {e}")
        
        # Write updated data back to file
        with open(emotion_file, "w") as f:
            json.dump(data, f, indent=4)
        
        logger.info(f"Updated {emotion_file} with new db_status values")
        
    except Exception as e:
        logger.error(f"Error in manually_send_to_mongodb: {e}")

def run_session_db_sender():
    """Run the SessionDBSender directly"""
    try:
        # Import here to avoid import errors if the module structure changes
        from FER.session_db_sender import SessionDBSender
        
        logger.info("Creating SessionDBSender instance")
        sender = SessionDBSender(interval_seconds=5)
        
        logger.info("Running SessionDBSender.run() once")
        # Call run method directly (not in a loop)
        
        # Check 5-minute aggregates.
        sender.send_unsent_aggregates(sender.five_min_file, sender.five_min_collection)
        # Check hourly aggregates.
        sender.send_unsent_aggregates(sender.hour_file, sender.hour_collection)
        # Check emotion data.
        sender.send_unsent_emotion_data()
        
        logger.info("SessionDBSender run completed")
    except Exception as e:
        logger.error(f"Error in run_session_db_sender: {e}")

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

if __name__ == "__main__":
    print("FER Database Sender Test")
    print("1. Run SessionDBSender directly")
    print("2. Manually send emotion data to MongoDB")
    print("3. Reset db_status to false for testing")
    choice = input("Enter your choice (1, 2, or 3): ")
    
    if choice == "1":
        run_session_db_sender()
    elif choice == "2":
        manually_send_to_mongodb()
    elif choice == "3":
        reset_db_status()
    else:
        print("Invalid choice. Exiting.")
