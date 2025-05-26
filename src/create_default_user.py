"""
Create an initial user account in the MongoDB database
Run this script to create a default user account
"""

import pymongo
import bcrypt
import os
import sys
import logging

# Since we're already in the src directory, we don't need to import from src
from db_connection import MongoDBConnection

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("create_user")

def create_default_user(email="patient@example.com", password="password123", role="patient"):
    """Create a default user account in the database"""
    try:
        # Use the project's MongoDB connection
        db_conn = MongoDBConnection()
        users_collection = db_conn.get_collection("users")
        
        # Check if user already exists by email
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            logger.info(f"User with email {email} already exists")
            return {"success": True, "created": False, "user": existing_user}  # Return info about existing user
        
        # Generate a unique username
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        
        while users_collection.find_one({"username": username}):
            username = f"{base_username}{counter}"
            counter += 1
            
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create the user document
        user = {
            "username": username,  # Now using a unique username
            "email": email,
            "password": hashed_password,
            "role": role,
            "phone": "123-456-7890"  # Default phone number
        }
        
        # Insert into database
        result = users_collection.insert_one(user)
        
        logger.info(f"Created user {email} with role {role}")
        return {"success": True, "created": True, "user": user}
    except pymongo.errors.DuplicateKeyError as e:
        # Handle the case where we tried to create a user with a duplicate field
        logger.warning(f"User with this {str(e).split('key:')[1].strip()} already exists")
        # Find the existing user and return it
        existing_user = users_collection.find_one({"email": email}) or users_collection.find_one({"username": user["username"]})
        return {"success": True, "created": False, "user": existing_user}
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return {"success": False, "created": False, "error": str(e)}

if __name__ == "__main__":
    print("Creating default user account...")
    
    # Get custom email/password if provided
    email = input("Enter email (default: patient@example.com): ").strip() or "patient@example.com"
    password = input("Enter password (default: password123): ").strip() or "password123"
    
    result = create_default_user(email, password)
    
    if result["success"]:
        print(f"User account {email} is ready to use.")
        print("You can log in with these credentials:")
        print(f"  Email: {email}")
        print(f"  Password: {password if password == 'password123' else '*' * len(password)}")
        if not result["created"]:
            print("(Note: This user already existed in the database)")
    else:
        print(f"Failed to create user: {result.get('error', 'Unknown error')}")
        print("Check the logs for details.")
