import time
import json
import os
from datetime import datetime, timedelta
import threading
import sys
from config import EMOTION_FILE

file_lock = threading.Lock()

class HourlyVoiceEmotionAggregator:
    def __init__(self, interval_seconds=3600, emotion_file=None, session_file=None):  # 3600 seconds = 1 hour
        print("...Initializing Hourly Voice Emotion Aggregator...")
        
        db_dir = os.path.join("db", "Audio")  
        self.emotion_file = EMOTION_FILE or os.path.join(db_dir, "voice_prediction.json")
        self.session_file = session_file or os.path.join(db_dir, "voice_session_summary_hourly.json")
        self.interval_seconds = interval_seconds

        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

        print(f"Emotion file path: {self.emotion_file}") 
        print(f"Hourly session file path: {self.session_file}")

    def aggregate(self):
        print(f"[{datetime.now().isoformat()}] Hourly voice session aggregation started.")
        
        with file_lock:
            try:
                if os.path.exists(self.emotion_file) and os.path.getsize(self.emotion_file) > 0:
                    with open(self.emotion_file, "r") as f:
                        data = json.load(f)
                else:
                    data = []
            except Exception as e:
                print("Error reading voice emotion data:", e)
                return

            # Get entries from the last hour that haven't been aggregated
            one_hour_ago = datetime.now() - timedelta(hours=1)
            pending_entries = [
                entry for entry in data 
                if not entry.get("hourly_aggregate", False) and 
                datetime.fromisoformat(entry.get("timestamp")) > one_hour_ago
            ]
            
            if not pending_entries:
                print("No pending voice emotion data for hourly aggregation.")
                return

            # Aggregate all pending results
            keys = ["fear", "angry", "neutral", "happy", "sad", "surprise"]
            hourly_aggregate = {}
            total_entries = len(pending_entries)

            for key in keys:
                total = sum(entry["emotion_scores"].get(key, 0) for entry in pending_entries)
                hourly_aggregate[key] = total / total_entries  
                
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
                "hourly_aggregate": hourly_aggregate,
                "period": "1 hour"
            }
            sessions.append(session_summary)

            with open(self.session_file, "w") as f:
                json.dump(sessions, f, indent=4)

            print(f"Hourly voice session aggregated and saved: {hourly_aggregate}")

            # Mark processed entries as hourly_aggregated = True
            for entry in data:
                if (not entry.get("hourly_aggregate", False) and 
                    datetime.fromisoformat(entry.get("timestamp")) > one_hour_ago):
                    entry["hourly_aggregate"] = True

            with open(self.emotion_file, "w") as f:
                json.dump(data, f, indent=4)

    def run(self):
        while True:
            self.aggregate()
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    aggregator = HourlyVoiceEmotionAggregator()
    aggregator.run()