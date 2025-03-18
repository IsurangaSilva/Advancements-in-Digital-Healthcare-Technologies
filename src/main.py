import subprocess
import time
import requests
from chat import ChatbotApp
from config import API_URL
from FER.emotion_background import EmotionBackgroundProcessor
import threading

if __name__ == "__main__":
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
    app = ChatbotApp()
    
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
