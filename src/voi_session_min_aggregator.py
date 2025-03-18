import time
import json
import os
from datetime import datetime, timedelta
import threading
import sys
from config import EMOTION_FILE

file_lock = threading.Lock()

class VoiceEmotionAggregator:
    def __init__(self, interval_seconds=20, emotion_file=None, session_file=None):
        print("...Initializing Voice Emotion Aggregator...")
        
        db_dir = os.path.join("db", "Audio")  
        self.emotion_file = EMOTION_FILE or os.path.join(db_dir, "voice_prediction.json")
        self.session_file = session_file or os.path.join(db_dir, "voice_session_summary_minute.json")
        self.interval_seconds = interval_seconds

        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

        print(f"Emotion file path: {self.emotion_file}") 

    def aggregate(self):
        print(f"[{datetime.now().isoformat()}] Voice session aggregation started.")
        
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

            # Get first entry with session_aggregated=False
            pending_entries = [entry for entry in data if not entry.get("session_aggregate", False)]
            if not pending_entries:
                print("No pending voice emotion data for session aggregation.")
                return

            # Aggregate all pending results
            keys = ["fear", "angry", "neutral", "happy", "sad", "surprise"]
            session_aggregate = {}
            total_entries = len(pending_entries)

            for key in keys:
                total = sum(entry["emotion_scores"].get(key, 0) for entry in pending_entries)
                session_aggregate[key] = total / total_entries  
                
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
                "session_aggregate": session_aggregate,
                "session_aggregate60min": False,
            }
            sessions.append(session_summary)

            with open(self.session_file, "w") as f:
                json.dump(sessions, f, indent=4)

            print(f"Voice session aggregated and saved: {session_aggregate}")

            # Mark processed entries as session_aggregated = True
            for entry in data:
                if not entry.get("session_aggregate", False):
                    entry["session_aggregate"] = True

            with open(self.emotion_file, "w") as f:
                json.dump(data, f, indent=4)

    def run(self):
        while True:
            self.aggregate()
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    aggregator = VoiceEmotionAggregator()
    aggregator.run()
