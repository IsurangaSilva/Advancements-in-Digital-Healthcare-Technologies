import time
import json
import os
from datetime import datetime
import threading

# Global lock to synchronize file read/write across aggregators.
file_lock = threading.Lock()

class EmotionAggregator:
    def __init__(self, window_seconds=60, callback=None, save_path=None):
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.save_path = save_path or os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        """
        window_seconds: Aggregation window duration (60 seconds for minute-level aggregation).
        callback: Function to call with the aggregated results.
        save_path: Path to save aggregated emotions.
        """
        self.window_seconds = window_seconds
        self.start_time = time.time()
        self.emotion_records = []
        # Using six categories after merging Disgust into Sad.
        self.emotion_labels = ['Anger', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
        self.callback = callback

    def add_emotion(self, emotion_dict):
        self.emotion_records.append(emotion_dict)
        if time.time() - self.start_time >= self.window_seconds:
            aggregated = self.compute_average()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.save_to_json(timestamp, aggregated)
            if self.callback:
                self.callback(aggregated)
            else:
                print("\n=== Aggregated Emotion Confidence (Last Minute) ===")
                print(f"Timestamp: {timestamp}")
                for label, value in aggregated.items():
                    print(f"{label}: {value * 100:.2f}%")
                print("====================================================\n")
            self.start_time = time.time()
            self.emotion_records = []

    def compute_average(self):
        avg_emotions = {label: 0 for label in self.emotion_labels}
        count = len(self.emotion_records)
        if count == 0:
            return avg_emotions
        for record in self.emotion_records:
            for label in self.emotion_labels:
                avg_emotions[label] += record.get(label, 0)
        for label in avg_emotions:
            avg_emotions[label] /= count
        return avg_emotions

    def save_to_json(self, timestamp, aggregated_data):
        # Add the "session_used" flag with a default value of False.
        new_entry = {
            "timestamp": timestamp,
            "aggregated_emotions": aggregated_data,
            "session_used": False,
            "session_used_hour": True
        }
        directory = os.path.dirname(self.save_path)
        if not os.path.exists(directory):
            os.makedirs(directory)
        with file_lock:
            # Handle the case where the file might be empty.
            if os.path.exists(self.save_path) and os.path.getsize(self.save_path) > 0:
                with open(self.save_path, "r") as file:
                    try:
                        data = json.load(file)
                    except json.JSONDecodeError:
                        data = []
            else:
                data = []
            data.append(new_entry)
            with open(self.save_path, "w") as file:
                json.dump(data, file, indent=4)
