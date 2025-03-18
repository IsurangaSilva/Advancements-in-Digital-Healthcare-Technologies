import os
import json
import time
import threading
import logging
from datetime import datetime

# File lock for thread-safe operations
file_lock = threading.Lock()

class VoiceEmotionAggregator:
    def __init__(self, interval_seconds=20, emotion_file=None, session_file=None):
        logging.info("...Initializing Voice Emotion Aggregator...")
        db_dir = os.path.join("db", "Audio")
        self.emotion_file = emotion_file or os.path.join(db_dir, "voice_prediction.json")
        self.session_file = session_file or os.path.join(db_dir, "aggregated_last_three.json")
        self.interval_seconds = interval_seconds
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
        logging.info(f"Emotion file path: {self.emotion_file}")
        logging.info(f"Session file path: {self.session_file}")

    def aggregate(self):
        logging.info(f"[{datetime.now().isoformat()}] Voice session aggregation started.")
        with file_lock:
            try:
                if os.path.exists(self.emotion_file) and os.path.getsize(self.emotion_file) > 0:
                    with open(self.emotion_file, "r") as f:
                        data = json.load(f)
                else:
                    data = []
            except Exception as e:
                logging.error(f"Error reading voice emotion data: {e}")
                return

            # Get up to the last three results
            last_three = data[-3:] if len(data) >= 3 else data
            num_entries = len(last_three)

            if not last_three:
                logging.info("No voice emotion data available for aggregation.")
                return

            # Extract emotion scores
            emotion_scores = [entry['emotion_scores'] for entry in last_three]

            # Create aggregated data structure
            aggregated_results = {
                "timestamp_aggregation": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "total_entries": len(data),
                "aggregated_entries": num_entries,
                "emotion score": emotion_scores,
                "session_aggregate": True
            }

            # Save aggregated results
            with open(self.session_file, "w") as f:
                json.dump(aggregated_results, f, indent=4)

            logging.info(f"Successfully aggregated last {num_entries} results to {self.session_file}")
            for i, entry in enumerate(last_three):
                logging.info(f"Result {i+1} - Timestamp: {entry['timestamp']}, "
                            f"Emotion: {entry['predicted_emotion']}")

    def run(self):
        while True:
            self.aggregate()
            time.sleep(self.interval_seconds)

if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    # Start aggregator
    aggregator = VoiceEmotionAggregator(interval_seconds=20)
    try:
        aggregator.run()
    except KeyboardInterrupt:
        logging.info("Shutting down...")