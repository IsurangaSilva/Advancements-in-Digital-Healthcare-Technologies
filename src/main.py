import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import logging
logging.getLogger('pymongo').setLevel(logging.INFO)
logging.basicConfig(level=logging.INFO)


import subprocess
import time
import requests
from maintest import MainApplication
from config import API_URL
from FER.emotion_background import EmotionBackgroundProcessor
import threading

def run_session_text_aggregation():
    while True:
        try:
            # Run the sessionTextAggregation.py script
            subprocess.run(["python", "src/sessionTextAggregate.py"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error running sessionTextAggregation.py: {e}")
        # Wait for 5 minutes (300 seconds) before running again
        # time.sleep(20)

def run_session_text_aggregation60():
    while True:
        try:
            # Run the sessionTextAggregation.py script
            subprocess.run(["python", "src/sessionTextAggregate60.py"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error running sessionTextAggregation.py: {e}")
        # Wait for 5 minutes (300 seconds) before running again
        # time.sleep(20)  



if __name__ == "__main__":
    # Start the sessionTextAggregation script in a separate thread
    aggregation_thread = threading.Thread(target=run_session_text_aggregation, daemon=True)
    aggregation60_thread = threading.Thread(target=run_session_text_aggregation60, daemon=True)
    aggregation_thread.start()
    aggregation60_thread.start()

    backend_process = subprocess.Popen(["python", "src/backend.py"])
    print("Waiting for backend to start...")
    time.sleep(5)
    backend_ready = False
    for _ in range(10):
        try:
            r = requests.get(API_URL)
            if r.status_code == 405:
                backend_ready = True
                print("Backend is ready!")
                break
        except requests.ConnectionError:
            print("Backend not ready yet, retrying...")
            time.sleep(2)
    if not backend_ready:
        print("Error: Backend failed to start. Check logs.")
        exit(1)
        
    
    # Create the chat UI first.
    app = MainApplication()
    
    # Define a callback that updates the dot in the Chat UI.
    def update_dot(status):
        app.after(0, lambda: app._update_dot(status))
    
    # Create and start the emotion background processor in main.py.
    emotion_processor = EmotionBackgroundProcessor(status_update_callback=update_dot)
    emotion_thread = threading.Thread(target=emotion_processor.run, daemon=True)
    emotion_thread.start()
    
    # Pass the emotion processor reference to ChatbotApp so it can stop it on exit.
    app.emotion_processor = emotion_processor

    app.mainloop()
    backend_process.terminate()
