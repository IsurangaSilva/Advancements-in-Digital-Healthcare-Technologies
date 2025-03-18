import time
import json
import os
from datetime import datetime
from .db_connection import MongoDBConnection
from .aggregator import file_lock  # Use the shared file lock from aggregator

class SessionDBSender:
    def __init__(self, interval_seconds=10, five_min_file=None, hour_file=None):
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        db_dir = os.path.join(BASE_DIR, "db", "FER")
        self.five_min_file = five_min_file or os.path.join(db_dir, "session_summery.json")
        self.hour_file = hour_file or os.path.join(db_dir, "session_summery1h.json")
        self.interval_seconds = interval_seconds

        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

        mongo_connection = MongoDBConnection()
        self.five_min_collection = mongo_connection.get_collection("fer-session-aggregates")
        self.hour_collection = mongo_connection.get_collection("fer-hourly-aggregates")

    def send_unsent_aggregates(self, file_path, collection):
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            print(f"No data found in {file_path}")
            return
        with file_lock:
            try:
                with open(file_path, "r") as f:
                    data = json.load(f)
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                return

            updated = False
            for entry in data:
                # Check if the object has not been sent to the DB.
                if not entry.get("db_status", False):
                    try:
                        collection.insert_one(entry)
                        entry["db_status"] = True
                        # Remove the _id field added by MongoDB to prevent JSON serialization issues.
                        if "_id" in entry:
                            del entry["_id"]
                        updated = True
                        print(f"Sent aggregate with timestamp {entry.get('timestamp')} from {file_path} to DB.")
                    except Exception as e:
                        print(f"Error sending aggregate with timestamp {entry.get('timestamp')}: {e}")

            if updated:
                try:
                    with open(file_path, "w") as f:
                        json.dump(data, f, indent=4)
                    print(f"Updated {file_path} with new db_status values.")
                except Exception as e:
                    print(f"Error updating {file_path}: {e}")

    def run(self):
        while True:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking for unsent session aggregates...")
            # Check 5-minute aggregates.
            self.send_unsent_aggregates(self.five_min_file, self.five_min_collection)
            # Check hourly aggregates.
            self.send_unsent_aggregates(self.hour_file, self.hour_collection)
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    sender = SessionDBSender()
    sender.run()
