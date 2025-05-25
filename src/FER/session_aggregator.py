import time
import json
import os
from datetime import datetime
from .aggregator import file_lock

class SessionAggregator:
    def __init__(self, interval_seconds=60, emotion_file=None, session_file=None):
        # Compute the base directory one level up and point to the db/FER folder.
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        db_dir = os.path.join(BASE_DIR, "db", "FER")
        self.emotion_file = emotion_file or os.path.join(db_dir, "emotion_data.json")
        self.session_file = session_file or os.path.join(db_dir, "session_summery.json")
        self.interval_seconds = interval_seconds

        # Ensure the database directory exists.
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

    def aggregate(self):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Session aggregation called.")
        with file_lock:
            try:
                if os.path.exists(self.emotion_file) and os.path.getsize(self.emotion_file) > 0:
                    with open(self.emotion_file, "r") as f:
                        data = json.load(f)
                else:
                    data = []
            except Exception as e:
                print("Error reading emotion data:", e)
                return
            
            # Filter entries that have not been used for 1h session aggregation.
            unused = [entry for entry in data if not entry.get("session_used", False)]
            if len(unused) < 12:
                print(f"Not enough unused (Have len(unused)={len(unused)}) emotion data for session aggregation. Waiting for 12 entries.")
                return
            
            # Take the last 12 objects (most recent 12 entries)
            session_entries = unused[-12:]
            keys = ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
            session_aggregate = {}
            for key in keys:
                total = sum(entry["aggregated_emotions"].get(key, 0) for entry in session_entries)
                session_aggregate[key] = total / 12.0

            # Append the session aggregate to session_summery.json.
            try:
                if os.path.exists(self.session_file) and os.path.getsize(self.session_file) > 0:
                    with open(self.session_file, "r") as f:
                        sessions = json.load(f)
                else:
                    sessions = []
            except Exception:
                sessions = []
            session_summary = {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "session_aggregate": session_aggregate,
                "db_status": False
            }
            sessions.append(session_summary)
            with open(self.session_file, "w") as f:
                json.dump(sessions, f, indent=4)
            print("Session aggregate computed and saved:", session_aggregate)

            # Mark the used minute aggregates as processed for 5-minute aggregation.
            for entry in data:
                for se in session_entries:
                    if entry.get("timestamp") == se.get("timestamp"):
                        entry["session_used"] = True
                        break

            with open(self.emotion_file, "w") as f:
                json.dump(data, f, indent=4)

    def run(self):
        while True:
            self.aggregate()
            time.sleep(self.interval_seconds)

    def aggregate_hour(self):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Hour session aggregation called.")
        with file_lock:
            try:
                if os.path.exists(self.emotion_file) and os.path.getsize(self.emotion_file) > 0:
                    with open(self.emotion_file, "r") as f:
                        data = json.load(f)
                else:
                    data = []
            except Exception as e:
                print("Error reading emotion data for hourly aggregation:", e)
                return
            
            # Filter entries that have not been used for hourly aggregation.
            unused = [entry for entry in data if not entry.get("session_used", False)]
            if len(unused) < 33:
                print(f"Not enough unused (Have len(unused)={len(unused)}) emotion data for hour aggregation. Waiting for 12 entries.")
                return
            
            # Take the last 12 objects (most recent 12 entries for 1 hour aggregation)
            session_entries = unused[-33:]
            keys = ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
            session_aggregate = {}
            for key in keys:
                total = sum(entry["aggregated_emotions"].get(key, 0) for entry in session_entries)
                session_aggregate[key] = total / 33.0

            # Define the session summary file (session_summery.json)
            hour_session_file = os.path.join(os.path.dirname(self.session_file), "session_summery.json")
            try:
                if os.path.exists(hour_session_file) and os.path.getsize(hour_session_file) > 0:
                    with open(hour_session_file, "r") as f:
                        sessions = json.load(f)
                else:
                    sessions = []
            except Exception:
                sessions = []
            session_summary = {
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "session_aggregate": session_aggregate,
                "db_status": False
            }
            sessions.append(session_summary)
            with open(hour_session_file, "w") as f:
                json.dump(sessions, f, indent=4)
            print("Hour session aggregate computed and saved:", session_aggregate)

            # Mark the used minute aggregates as processed for hourly aggregation.
            for entry in data:
                for se in session_entries:
                    if entry.get("timestamp") == se.get("timestamp"):
                        entry["session_used"] = True
                        break

            with open(self.emotion_file, "w") as f:
                json.dump(data, f, indent=4)

    def run_hour(self):
        # This loop runs the hourly aggregation periodically.
        while True:
            self.aggregate_hour()
            time.sleep(3600)  # Sleep for 1 hour (For testing, changed to 60 seconds)

if __name__ == "__main__":
    aggregator = SessionAggregator()
    aggregator.run()
