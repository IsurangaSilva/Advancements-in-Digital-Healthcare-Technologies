import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the root folder
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "env"))

class MongoDBConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
            mongo_uri = os.getenv("MONGODB_URL")
            db_name = os.getenv("MONGO_DB_NAME")
            cls._instance.client = MongoClient(mongo_uri)
            cls._instance.db = cls._instance.client[db_name]
        return cls._instance

    def get_collection(self, collection_name):
        """Returns a MongoDB collection."""
        return self.db[collection_name]

