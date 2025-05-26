import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the root folder
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "env"))  # Project root/env

class MongoDBConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
            mongo_uri = os.getenv("MONGODB_URL")
            db_name = os.getenv("MONGO_DB_NAME")
              # Check if environment variables were loaded correctly
            if not mongo_uri or not db_name:
                print("WARNING: MongoDB environment variables not loaded correctly!")
                print(f"MONGODB_URL: {'Found' if mongo_uri else 'Missing'}")
                print(f"MONGO_DB_NAME: {'Found' if db_name else 'Missing'}")
                # Provide default values if environment variables are missing
                mongo_uri = mongo_uri or "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
                db_name = db_name or "emotionDB"
            
            # Create MongoDB client
            cls._instance.client = MongoClient(mongo_uri)
            cls._instance.db = cls._instance.client[str(db_name)]
        return cls._instance

    def get_collection(self, collection_name):
        """Returns a MongoDB collection."""
        return self.db[collection_name]

