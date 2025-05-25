#!/usr/bin/env python3
"""
FER Database Manager

This script provides comprehensive utilities to manage the FER MongoDB collections:
- List all documents in fer-aggregates collection (timestamps and IDs)
- Insert random test objects to each FER collection
- Display statistics about the collections
"""

import os
import sys
import json
import time
import random
import logging
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("fer_db_manager")

def load_env_variables():
    """Load environment variables from the .env file"""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "env")
    logger.info(f"Loading environment variables from: {env_path}")
    load_dotenv(env_path)
    
    # Get MongoDB connection details
    mongo_uri = os.getenv("MONGODB_URL")
    db_name = os.getenv("MONGO_DB_NAME")
    
    if not mongo_uri or not db_name:
        logger.warning("MongoDB environment variables not found!")
        mongo_uri = mongo_uri or "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
        db_name = db_name or "emotionDB"
    
    return mongo_uri, db_name

def connect_to_mongodb():
    """Connect to MongoDB and return the database object"""
    mongo_uri, db_name = load_env_variables()
    logger.info(f"Connecting to MongoDB database: {db_name}")
    
    try:
        client = MongoClient(mongo_uri)
        # Test the connection
        server_info = client.server_info()
        logger.info(f"Successfully connected to MongoDB server version: {server_info['version']}")
        db = client[db_name]
        return db
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        sys.exit(1)

def list_fer_aggregates(db):
    """List all documents in fer-aggregates collection (only timestamps and IDs)"""
    try:
        collection = db["fer-aggregates"]
        total_count = collection.count_documents({})
        logger.info(f"Found {total_count} documents in fer-aggregates collection")
        
        # Get all documents, but only retrieve _id and timestamp fields
        documents = list(collection.find({}, {"_id": 1, "timestamp": 1}))
        
        print("\n===== fer-aggregates Collection =====")
        print(f"Total documents: {total_count}")
        print("\nSample documents (timestamp and ID):")
        
        # Display the first 20 documents
        display_limit = min(20, len(documents))
        for i, doc in enumerate(documents[:display_limit], 1):
            doc_id = str(doc['_id'])
            timestamp = doc.get('timestamp', 'N/A')
            print(f"{i}. Timestamp: {timestamp} | ID: {doc_id}")
        
        if total_count > display_limit:
            print(f"\n...and {total_count - display_limit} more documents")
        
        # Check for documents without timestamps
        missing_timestamp = collection.count_documents({"timestamp": {"$exists": False}})
        if missing_timestamp > 0:
            print(f"\nWARNING: {missing_timestamp} documents don't have a timestamp field!")
        
        # Check for duplicate timestamps
        pipeline = [
            {"$group": {"_id": "$timestamp", "count": {"$sum": 1}}},
            {"$match": {"count": {"$gt": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        duplicates = list(collection.aggregate(pipeline))
        
        if duplicates:
            print("\nDuplicate timestamps found:")
            for dup in duplicates:
                print(f"  - '{dup['_id']}' appears {dup['count']} times")
        else:
            print("\nNo duplicate timestamps found")
            
        return total_count
    except Exception as e:
        logger.error(f"Error listing documents: {e}")
        return 0

def generate_random_emotions():
    """Generate a dictionary of random emotion values that sum to 1.0"""
    emotions = ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
    # Generate random initial values
    values = [random.random() for _ in range(len(emotions))]
    # Normalize to sum to 1.0
    total = sum(values)
    normalized = [round(v / total, 3) for v in values]
    
    # Ensure they sum to exactly 1.0 (adjust last value if needed)
    normalized[-1] = round(1.0 - sum(normalized[:-1]), 3)
    
    return dict(zip(emotions, normalized))

def insert_random_fer_aggregate(db):
    """Insert a random object to fer-aggregates collection"""
    try:
        collection = db["fer-aggregates"]
        
        # Create the random document
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        random_emotions = generate_random_emotions()
        
        document = {
            "timestamp": timestamp,
            "aggregated_emotions": random_emotions,
            "session_used": random.choice([True, False]),
            "session_used_hour": random.choice([True, False]),
            "db_status": True
        }
        
        # Insert using update_one with upsert to avoid duplicates
        result = collection.update_one(
            {"timestamp": timestamp},
            {"$set": document},
            upsert=True
        )
        
        if result.upserted_id:
            logger.info(f"Inserted new document with ID: {result.upserted_id}")
        else:
            logger.info(f"Document with timestamp {timestamp} already existed and was updated")
        
        print("\nInserted document:")
        print(json.dumps(document, indent=2))
        return document
    except Exception as e:
        logger.error(f"Error inserting random FER aggregate: {e}")
        return None

def insert_random_session_aggregate(db):
    """Insert a random object to fer-session-aggregates collection"""
    try:
        collection = db["fer-session-aggregates"]
        
        # Create the random document
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        random_emotions = generate_random_emotions()
        
        document = {
            "timestamp": timestamp,
            "session_aggregate": random_emotions,
            "db_status": True
        }
        
        # Insert using update_one with upsert to avoid duplicates
        result = collection.update_one(
            {"timestamp": timestamp},
            {"$set": document},
            upsert=True
        )
        
        if result.upserted_id:
            logger.info(f"Inserted new session document with ID: {result.upserted_id}")
        else:
            logger.info(f"Session document with timestamp {timestamp} already existed and was updated")
        
        print("\nInserted session document:")
        print(json.dumps(document, indent=2))
        return document
    except Exception as e:
        logger.error(f"Error inserting random session aggregate: {e}")
        return None

def insert_random_hourly_aggregate(db):
    """Insert a random object to fer-hourly-aggregates collection"""
    try:
        collection = db["fer-hourly-aggregates"]
        
        # Create the random document - note hour-based timestamp
        current_datetime = datetime.now()
        timestamp = f"{current_datetime.strftime('%Y-%m-%d')} {current_datetime.hour}:59:00"
        random_emotions = generate_random_emotions()
        
        document = {
            "timestamp": timestamp,
            "session_aggregate": random_emotions,
            "db_status": True
        }
        
        # Insert using update_one with upsert to avoid duplicates
        result = collection.update_one(
            {"timestamp": timestamp},
            {"$set": document},
            upsert=True
        )
        
        if result.upserted_id:
            logger.info(f"Inserted new hourly document with ID: {result.upserted_id}")
        else:
            logger.info(f"Hourly document with timestamp {timestamp} already existed and was updated")
        
        print("\nInserted hourly document:")
        print(json.dumps(document, indent=2))
        return document
    except Exception as e:
        logger.error(f"Error inserting random hourly aggregate: {e}")
        return None

def show_collection_stats(db):
    """Show statistics for all FER collections"""
    collections = ["fer-aggregates", "fer-session-aggregates", "fer-hourly-aggregates"]
    
    print("\n===== FER Collections Statistics =====")
    for collection_name in collections:
        try:
            collection = db[collection_name]
            count = collection.count_documents({})
            print(f"\n{collection_name}:")
            print(f"  - Total documents: {count}")
            
            # Get sample document
            sample = collection.find_one()
            if sample:
                # Remove _id for cleaner output
                if "_id" in sample:
                    del sample["_id"]
                print("  - Sample document structure:")
                print(f"    {json.dumps(sample, indent=4)}")
            
            # Check for duplicate timestamps
            pipeline = [
                {"$group": {"_id": "$timestamp", "count": {"$sum": 1}}},
                {"$match": {"count": {"$gt": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
            duplicates = list(collection.aggregate(pipeline))
            
            if duplicates:
                print(f"  - Found {len(duplicates)} duplicate timestamps")
                for dup in duplicates[:3]:
                    print(f"    '{dup['_id']}' appears {dup['count']} times")
                if len(duplicates) > 3:
                    print(f"    ...and {len(duplicates) - 3} more")
            else:
                print("  - No duplicate timestamps found")
                
        except Exception as e:
            logger.error(f"Error getting stats for {collection_name}: {e}")

def main():
    """Main function to run the script"""
    print("\nFER Database Manager")
    print("1. List fer-aggregates documents (timestamps and IDs)")
    print("2. Insert random object to fer-aggregates collection")
    print("3. Insert random object to fer-session-aggregates collection")
    print("4. Insert random object to fer-hourly-aggregates collection")
    print("5. Show statistics for all FER collections")
    print("6. Quit")
    
    choice = input("\nEnter your choice (1-6): ")
    
    db = connect_to_mongodb()
    
    if choice == "1":
        list_fer_aggregates(db)
    elif choice == "2":
        insert_random_fer_aggregate(db)
    elif choice == "3":
        insert_random_session_aggregate(db)
    elif choice == "4":
        insert_random_hourly_aggregate(db)
    elif choice == "5":
        show_collection_stats(db)
    elif choice == "6":
        print("Exiting...")
        sys.exit(0)
    else:
        print("Invalid choice. Please enter a number between 1 and 6.")
        
if __name__ == "__main__":
    main()
