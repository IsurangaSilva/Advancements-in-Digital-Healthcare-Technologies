"""
Test script to verify the SessionDBSender functionality
"""
import os
import sys
import json
from datetime import datetime
import time

# Path to the database files
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
db_dir = os.path.join(BASE_DIR, "db", "FER")
five_min_file = os.path.join(db_dir, "session_summery.json")
hour_file = os.path.join(db_dir, "session_summery1h.json")
emotion_file = os.path.join(db_dir, "emotion_data.json")

def test_add_db_status():
    """
    Test function to add db_status=False to all entries in the emotion_data.json file
    that don't already have one.
    """
    if not os.path.exists(emotion_file) or os.path.getsize(emotion_file) == 0:
        print(f"No data found in {emotion_file}")
        return
        
    try:
        with open(emotion_file, "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading {emotion_file}: {e}")
        return

    updated = False
    for entry in data:
        if "db_status" not in entry:
            entry["db_status"] = False
            updated = True
            print(f"Added db_status=False to entry with timestamp {entry.get('timestamp')}")

    if updated:
        try:
            with open(emotion_file, "w") as f:
                json.dump(data, f, indent=4)
            print(f"Updated {emotion_file} with new db_status values.")
        except Exception as e:
            print(f"Error updating {emotion_file}: {e}")
            
def print_file_stats():
    """Print stats about the database files"""
    files = [
        ("5-min session aggregates", five_min_file),
        ("1-hour session aggregates", hour_file),
        ("Emotion data", emotion_file)
    ]
    
    print("\n=== Database File Statistics ===")
    for name, path in files:
        if not os.path.exists(path):
            print(f"{name}: File not found")
            continue
            
        if os.path.getsize(path) == 0:
            print(f"{name}: Empty file")
            continue
            
        try:
            with open(path, "r") as f:
                data = json.load(f)
            total = len(data)
            unsent = sum(1 for entry in data if not entry.get("db_status", False))
            print(f"{name}: {total} total entries, {unsent} entries not sent to DB")
        except Exception as e:
            print(f"{name}: Error reading file: {e}")
    
    print("=============================\n")

if __name__ == "__main__":
    print_file_stats()
    choice = input("Do you want to add db_status=False to all entries in emotion_data.json that don't have it? (y/n): ")
    if choice.lower() == 'y':
        test_add_db_status()
        print_file_stats()
