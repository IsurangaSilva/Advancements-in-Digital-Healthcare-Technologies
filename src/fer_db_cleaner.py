#!/usr/bin/env python3
"""
FER Database Cleaner

This script provides utilities to clean/delete data from FER MongoDB collections.
Features:
- Delete all documents from a selected collection
- Delete documents by date range
- Delete duplicate documents based on timestamp
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("fer_db_cleaner")

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

def delete_all_documents(db, collection_name):
    """Delete all documents from a collection"""
    try:
        collection = db[collection_name]
        count_before = collection.count_documents({})
        logger.info(f"Found {count_before} documents in {collection_name}")
        
        # Confirm deletion
        confirmation = input(f"Are you sure you want to delete ALL {count_before} documents from {collection_name}? (yes/no): ")
        if confirmation.lower() != "yes":
            logger.info("Operation cancelled.")
            return False
        
        # Delete all documents
        result = collection.delete_many({})
        logger.info(f"Deleted {result.deleted_count} documents from {collection_name}")
        
        # Verify deletion
        count_after = collection.count_documents({})
        logger.info(f"Collection now has {count_after} documents")
        return True
    except Exception as e:
        logger.error(f"Error deleting documents: {e}")
        return False

def delete_by_date_range(db, collection_name):
    """Delete documents within a specific date range"""
    try:
        collection = db[collection_name]
        
        # Get date range from user
        print("\nEnter date range (format: YYYY-MM-DD, empty for no bound)")
        start_date_str = input("Start date (inclusive): ")
        end_date_str = input("End date (inclusive): ")
        
        # Parse dates
        query = {}
        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
                query["timestamp"] = {"$gte": start_date.strftime("%Y-%m-%d 00:00:00")}
            except ValueError:
                logger.error("Invalid start date format. Use YYYY-MM-DD.")
                return False
        
        if end_date_str:
            try:
                end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
                # Add one day to make it inclusive of the end day
                end_date = end_date + timedelta(days=1)
                
                if "timestamp" in query:
                    query["timestamp"]["$lt"] = end_date.strftime("%Y-%m-%d 00:00:00")
                else:
                    query["timestamp"] = {"$lt": end_date.strftime("%Y-%m-%d 00:00:00")}
            except ValueError:
                logger.error("Invalid end date format. Use YYYY-MM-DD.")
                return False
        
        if not query:
            logger.warning("No date range specified. Operation cancelled.")
            return False
        
        # Count documents matching the query
        count = collection.count_documents(query)
        logger.info(f"Found {count} documents matching the date range")
        
        if count == 0:
            logger.info("No documents to delete.")
            return False
        
        # Confirm deletion
        confirmation = input(f"Are you sure you want to delete {count} documents? (yes/no): ")
        if confirmation.lower() != "yes":
            logger.info("Operation cancelled.")
            return False
        
        # Delete documents
        result = collection.delete_many(query)
        logger.info(f"Deleted {result.deleted_count} documents from {collection_name}")
        return True
        
    except Exception as e:
        logger.error(f"Error deleting documents by date range: {e}")
        return False

def remove_duplicates(db, collection_name):
    """Remove duplicate documents based on timestamp"""
    try:
        collection = db[collection_name]
        
        # Find duplicates
        pipeline = [
            {"$group": {
                "_id": "$timestamp", 
                "count": {"$sum": 1},
                "docs": {"$push": "$_id"}
            }},
            {"$match": {"count": {"$gt": 1}}},
            {"$sort": {"_id": 1}}
        ]
        
        duplicates = list(collection.aggregate(pipeline))
        
        if not duplicates:
            logger.info(f"No duplicate timestamps found in {collection_name}")
            return False
        
        logger.info(f"Found {len(duplicates)} duplicate timestamp groups")
        total_duplicates = sum(group["count"] - 1 for group in duplicates)
        logger.info(f"Total of {total_duplicates} duplicate documents to remove")
        
        # Show some examples
        if len(duplicates) > 0:
            logger.info("Sample duplicate groups:")
            for i, group in enumerate(duplicates[:3], 1):
                timestamp = group["_id"]
                count = group["count"]
                logger.info(f"{i}. Timestamp '{timestamp}' appears {count} times")
        
        # Confirm deletion
        confirmation = input(f"Are you sure you want to remove {total_duplicates} duplicate documents? (yes/no): ")
        if confirmation.lower() != "yes":
            logger.info("Operation cancelled.")
            return False
        
        # Remove duplicates (keep one document for each timestamp)
        deleted_count = 0
        for group in duplicates:
            # Keep the first document, delete the rest
            docs_to_delete = group["docs"][1:]  # Skip the first one
            for doc_id in docs_to_delete:
                collection.delete_one({"_id": ObjectId(doc_id)})
                deleted_count += 1
        
        logger.info(f"Deleted {deleted_count} duplicate documents from {collection_name}")
        
        # Verify
        new_duplicates = list(collection.aggregate(pipeline))
        if new_duplicates:
            logger.warning(f"There are still {len(new_duplicates)} duplicate groups. You may need to run the cleanup again.")
        else:
            logger.info("All duplicates successfully removed!")
        return True
    except Exception as e:
        logger.error(f"Error removing duplicates: {e}")
        return False

def clean_by_specific_date(db, collection_name):
    """Delete documents with a specific date"""
    try:
        collection = db[collection_name]
        
        # Get specific date from user
        date_str = input("Enter specific date to delete (format: YYYY-MM-DD): ")
        
        # Parse date
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            logger.error("Invalid date format. Use YYYY-MM-DD.")
            return False
        
        # Create query
        date_start = target_date.strftime("%Y-%m-%d 00:00:00")
        date_end = (target_date + timedelta(days=1)).strftime("%Y-%m-%d 00:00:00")
        
        query = {
            "timestamp": {
                "$gte": date_start,
                "$lt": date_end
            }
        }
        
        # Count documents matching the query
        count = collection.count_documents(query)
        logger.info(f"Found {count} documents on {date_str}")
        
        if count == 0:
            logger.info("No documents to delete.")
            return False
        
        # Confirm deletion
        confirmation = input(f"Are you sure you want to delete all {count} documents from {date_str}? (yes/no): ")
        if confirmation.lower() != "yes":
            logger.info("Operation cancelled.")
            return False
        
        # Delete documents
        result = collection.delete_many(query)
        logger.info(f"Deleted {result.deleted_count} documents from {collection_name}")
        return True
        
    except Exception as e:
        logger.error(f"Error deleting documents by specific date: {e}")
        return False

def delete_by_object_id(db, collection_name):
    """Delete a document by its ObjectID"""
    try:
        collection = db[collection_name]
        
        # Get object ID from user
        object_id_str = input("Enter the MongoDB ObjectID to delete: ")
        
        try:
            # Convert to ObjectId
            object_id = ObjectId(object_id_str)
            
            # Check if document exists
            doc = collection.find_one({"_id": object_id})
            if not doc:
                logger.error(f"No document found with ID {object_id_str}")
                return False
            
            # Show document details
            print("\nDocument to be deleted:")
            doc_copy = doc.copy()
            doc_copy["_id"] = str(doc_copy["_id"])  # Convert ObjectId to string for display
            print(json.dumps(doc_copy, indent=2, default=str))
            
            # Confirm deletion
            confirmation = input(f"Are you sure you want to delete this document? (yes/no): ")
            if confirmation.lower() != "yes":
                logger.info("Operation cancelled.")
                return False
            
            # Delete document
            result = collection.delete_one({"_id": object_id})
            if result.deleted_count == 1:
                logger.info(f"Document with ID {object_id_str} deleted successfully")
                return True
            else:
                logger.error(f"Failed to delete document with ID {object_id_str}")
                return False
            
        except Exception as e:
            logger.error(f"Invalid ObjectID or error: {e}")
            return False
        
    except Exception as e:
        logger.error(f"Error deleting document by ObjectID: {e}")
        return False

def show_collection_stats(db, collection_name):
    """Show statistics for a collection"""
    try:
        collection = db[collection_name]
        count = collection.count_documents({})
        logger.info(f"\n===== {collection_name} Statistics =====")
        logger.info(f"Total documents: {count}")
        
        if count == 0:
            logger.info("Collection is empty.")
            return
        
        # Get date range
        pipeline_min_date = [{"$sort": {"timestamp": 1}}, {"$limit": 1}]
        pipeline_max_date = [{"$sort": {"timestamp": -1}}, {"$limit": 1}]
        
        oldest_doc = list(collection.aggregate(pipeline_min_date))
        newest_doc = list(collection.aggregate(pipeline_max_date))
        
        if oldest_doc and newest_doc:
            oldest_timestamp = oldest_doc[0].get("timestamp", "N/A")
            newest_timestamp = newest_doc[0].get("timestamp", "N/A")
            logger.info(f"Date range: {oldest_timestamp} to {newest_timestamp}")
        
        # Check for duplicate timestamps
        pipeline = [
            {"$group": {"_id": "$timestamp", "count": {"$sum": 1}}},
            {"$match": {"count": {"$gt": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        duplicates = list(collection.aggregate(pipeline))
        
        if duplicates:
            logger.info(f"Found {len(duplicates)} duplicate timestamp groups:")
            for i, dup in enumerate(duplicates[:5], 1):
                logger.info(f"  {i}. '{dup['_id']}' appears {dup['count']} times")
            if len(duplicates) > 5:
                logger.info(f"  ...and {len(duplicates)-5} more duplicate groups")
        else:
            logger.info("No duplicate timestamps found")
        
        # Sample document
        sample = collection.find_one({})
        if sample:
            # Remove _id for cleaner output
            if "_id" in sample:
                sample["_id"] = str(sample["_id"])
            logger.info("\nSample document structure:")
            logger.info(json.dumps(sample, indent=2, default=str))
            
    except Exception as e:
        logger.error(f"Error showing collection stats: {e}")

def main():
    """Main function to run the FER database cleaner"""
    db = connect_to_mongodb()
    
    # Define FER collections
    fer_collections = [
        "fer-aggregates", 
        "fer-session-aggregates", 
        "fer-hourly-aggregates"
    ]
    
    # Show menu
    while True:
        print("\n===== FER Database Cleaner =====")
        print("Collections:")
        for i, collection in enumerate(fer_collections, 1):
            print(f"{i}. {collection}")
        
        # Get collection choice
        try:
            collection_choice = int(input("\nSelect collection (1-3, or 0 to quit): "))
            if collection_choice == 0:
                print("Exiting...")
                sys.exit(0)
                
            if collection_choice < 1 or collection_choice > len(fer_collections):
                print("Invalid choice. Please try again.")
                continue
                
            selected_collection = fer_collections[collection_choice - 1]
            print(f"\nSelected collection: {selected_collection}")
            
            # Show collection statistics
            show_collection_stats(db, selected_collection)
            
            # Show cleaning options
            print("\nCleaning options:")
            print("1. Delete ALL documents")
            print("2. Delete by date range")
            print("3. Remove duplicate timestamps (keep one per timestamp)")
            print("4. Delete documents from a specific date")
            print("5. Delete a single document by ObjectID")
            print("6. Return to collection selection")
            
            clean_choice = int(input("\nSelect cleaning option (1-6): "))
            
            if clean_choice == 1:
                delete_all_documents(db, selected_collection)
            elif clean_choice == 2:
                delete_by_date_range(db, selected_collection)
            elif clean_choice == 3:
                remove_duplicates(db, selected_collection)
            elif clean_choice == 4:
                clean_by_specific_date(db, selected_collection)
            elif clean_choice == 5:
                delete_by_object_id(db, selected_collection)
            elif clean_choice == 6:
                continue
            else:
                print("Invalid choice. Please try again.")
                
            # Show updated statistics
            show_collection_stats(db, selected_collection)
                
        except ValueError:
            print("Please enter a number.")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user.")
            sys.exit(0)
        except Exception as e:
            logger.error(f"Error: {e}")
            
if __name__ == "__main__":
    main()
