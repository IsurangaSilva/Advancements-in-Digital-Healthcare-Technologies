import os
import sys
import logging
import time
import requests
import threading
import tkinter as tk
from tkinter import ttk
from fixed_app import MainApplication
from config import API_URL
from FER.emotion_background import EmotionBackgroundProcessor
import uvicorn

# Disable TensorFlow verbose logging
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Configure logging
logging.getLogger('pymongo').setLevel(logging.INFO)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("main")

# Create necessary directories
os.makedirs(os.path.join("logs"), exist_ok=True)
os.makedirs(os.path.join("audios", "temp_audio"), exist_ok=True)
os.makedirs(os.path.join("audios", "full_audio"), exist_ok=True)
os.makedirs(os.path.join("transcriptions", "temp_transcript"), exist_ok=True)
os.makedirs(os.path.join("transcriptions", "full_transcript"), exist_ok=True)

class SplashScreen(tk.Tk):
    """Splash screen shown during application startup"""
    
    def __init__(self):
        super().__init__()
        self.title("MIRROR APP - Loading")
        self.geometry("400x300")
        self.configure(bg="#0B1B3F")
        self.overrideredirect(True)  # Remove window decorations
        
        # Center on screen
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry('{}x{}+{}+{}'.format(width, height, x, y))
        
        # Create loading UI
        tk.Label(self, text="MIRROR APP", font=("Helvetica", 24, "bold"), bg="#0B1B3F", fg="white").pack(pady=(40, 20))
        tk.Label(self, text="Initializing...", font=("Helvetica", 12), bg="#0B1B3F", fg="white").pack(pady=10)
        
        # Progress bar
        self.progress_var = tk.DoubleVar()
        self.progress = ttk.Progressbar(self, variable=self.progress_var, length=300, mode='determinate')
        self.progress.pack(pady=20)
        
        # Status text
        self.status_var = tk.StringVar()
        self.status_var.set("Starting application...")
        self.status_label = tk.Label(self, textvariable=self.status_var, bg="#0B1B3F", fg="white")
        self.status_label.pack(pady=10)
    
    def update_progress(self, value, status_text):
        """Update progress bar and status text"""
        self.progress_var.set(value)
        self.status_var.set(status_text)
        self.update_idletasks()
    
    def initialize_app(self):
        """Initialize the application"""
        self.update_progress(60, "Creating user interface...")
        
        # Create the main application
        app = MainApplication()
        
        # Set up emotion processor with lazy loading
        self.update_progress(80, "Setting up emotion processing...")
        dummy_callback = lambda status: None
        emotion_processor = EmotionBackgroundProcessor(status_update_callback=dummy_callback, lazy_load=True, no_personalization=True)
        emotion_thread = threading.Thread(target=emotion_processor.run, daemon=True)
        
        # Finish loading
        self.update_progress(100, "Loading complete!")
        app.emotion_processor = emotion_processor
        
        # Wait a moment to show 100% then destroy splash and show main app
        self.after(500, lambda: self.finish_loading(app, emotion_thread))
    
    def finish_loading(self, app, emotion_thread):
        """Close splash screen and show main app"""
        emotion_thread.start()
        self.destroy()
        
        # Handle application shutdown
        app.protocol("WM_DELETE_WINDOW", lambda: self.on_close(app))
        
        # Show the application
        app.mainloop()
    
    def on_close(self, app):
        """Clean shutdown when closing the app"""
        if hasattr(app, 'emotion_processor'):
            app.emotion_processor.stop()
        app.destroy()

def start_backend():
    """Start the backend server"""
    import backend
    port = 8000
    try:
        uvicorn.run(backend.app, host="127.0.0.1", port=port)
    except Exception as e:
        logger.error(f"Backend server error: {e}")

def check_backend_ready(splash):
    """Check if backend is ready and update splash screen"""
    backend_ready = False
    for i in range(20):  # Try for 10 seconds
        try:
            r = requests.get(API_URL)
            if r.status_code == 405:  # Method not allowed is a good sign - the server is responding
                backend_ready = True
                logger.info("Backend is ready!")
                splash.update_progress(50, "Backend initialized successfully!")
                break
        except requests.ConnectionError:
            splash.update_progress(20 + i*1.5, f"Connecting to backend ({i+1}/20)...")
            time.sleep(0.5)
    
    if not backend_ready:
        logger.error("Backend failed to start")
        splash.update_progress(100, "Error: Backend failed to start")
        time.sleep(3)
        splash.destroy()
        sys.exit(1)
    else:
        # Backend is ready, proceed to initialize the app
        splash.initialize_app()

if __name__ == "__main__":
    try:
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=start_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # Allow backend a moment to initialize
        time.sleep(0.5)
        
        # Show splash screen
        splash = SplashScreen()
        
        # Start backend check in a separate thread
        threading.Thread(target=lambda: check_backend_ready(splash), daemon=True).start()
        
        # Start mainloop
        splash.mainloop()
    except Exception as e:
        logger.error(f"Failed to initialize: {e}")
        sys.exit(1)
