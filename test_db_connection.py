"""
Test script to verify MongoDB connection
"""
import sys
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("test_connection")

# Add src directory to path to make imports work
sys.path.insert(0, os.path.abspath("."))

try:
    from src.db_connection import MongoDBConnection
    
    # Test connection
    print("Attempting to connect to MongoDB...")
    db_conn = MongoDBConnection()
    
    # Try to get a collection
    users = db_conn.get_collection("users")
    count = users.count_documents({})
    
    print(f"Connection successful! Found {count} users in the database.")
    print("MongoDB connection is working correctly.")
    
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    print("Please make sure the connection string is correct in the env file")
    print("The env file should contain either MONGO_URI or MONGODB_URL variable")
    logger.error(f"MongoDB connection error: {e}")
