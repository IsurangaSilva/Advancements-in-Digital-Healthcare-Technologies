import os
import sys
import logging
from fastapi import FastAPI
import uvicorn
from fixed_app import MainApplication
import importlib
import threading
import tkinter as tk

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("main")

# Create logs directory if it doesn't exist
os.makedirs(os.path.join("..", "logs"), exist_ok=True)

def start_backend():
    """Start the backend server in a separate thread."""
    import backend
    port = 8000
    uvicorn.run(backend.app, host="127.0.0.1", port=port)

if __name__ == "__main__":
    # Start backend server in a separate thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Wait a moment for the backend to initialize
    import time
    time.sleep(1)
    
    logger.info("Backend is ready!")
    
    # Start the main application
    app = MainApplication()
    app.mainloop()
