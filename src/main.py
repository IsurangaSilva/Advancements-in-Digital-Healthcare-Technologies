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
        
    app = MainApplication()
    app.mainloop()
    backend_process.terminate()