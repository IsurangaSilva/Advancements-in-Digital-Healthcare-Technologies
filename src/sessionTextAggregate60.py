import time
import json
import os
from datetime import datetime, timedelta
import threading
from db_connection import MongoDBConnection

file_lock = threading.Lock()

mongo_connection = MongoDBConnection()
collection = mongo_connection.get_collection("text-emotion-60minaggregate")

class TextEmotionAggregator60:
    def __init__(self, interval_seconds=60, emotion_file=None, session_file=None):
        
        db_dir = os.path.join("db", "Text")
    
        self.emotion_file = emotion_file or os.path.join(db_dir, "text_session_summary.json")
        self.session_file = session_file or os.path.join(db_dir, "text_session_summary_60.json")
        self.interval_seconds = interval_seconds

        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def aggregate(self):
        print(f"[{datetime.now().isoformat()}] Text 60min session aggregation started.")
        
        with file_lock:
            try:
                if os.path.exists(self.emotion_file) and os.path.getsize(self.emotion_file) > 0:
                    with open(self.emotion_file, "r") as f:
                        data = json.load(f)
                else:
                    data = []
            except Exception as e:
                print("Error reading text emotion data:", e)
                return
            print(data)
            # Get first entry with session_aggregated=False
            pending_entries = [entry for entry in data if not entry.get("session_aggregate60min", False)]
            if not pending_entries:
                print("No pending text emotion data for session aggregation.")
                return

            # Aggregate all pending results
            keys = ["joy", "sadness", "anger", "fear", "surprise", "neutral"]
            session_aggregate60 = {}
            total_entries = len(pending_entries)

            for key in keys:
                total = sum(entry["session_aggregate"].get(key, 0) for entry in pending_entries)
                session_aggregate60[key] = total / total_entries  # Calculate average

            # Save aggregated result
            try:
                if os.path.exists(self.session_file) and os.path.getsize(self.session_file) > 0:
                    with open(self.session_file, "r") as f:
                        sessions = json.load(f)
                else:
                    sessions = []
            except Exception:
                sessions = []

            session_summary = {
                "timestamp": datetime.now().isoformat(),
                "session_aggregate": session_aggregate60,
            }
            sessions.append(session_summary)

            with open(self.session_file, "w") as f:
                json.dump(sessions, f, indent=4)

            print(f"Text session aggregated and saved: {session_aggregate60}")

            collection.insert_one(session_summary)

            # Mark processed entries as session_aggregated = True
            for entry in data:
                if not entry.get("session_aggregate60min", False):
                    entry["session_aggregate60min"] = True

            with open(self.emotion_file, "w") as f:
                json.dump(data, f, indent=4)

    def run(self):
        while True:
            self.aggregate()
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    aggregator = TextEmotionAggregator60()
    aggregator.run()
