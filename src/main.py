import os
import logging
import subprocess
import time
import requests
import threading
import tkinter as tk
from tkinter import ttk
from maintest import MainApplication
from config import API_URL
from FER.emotion_background import EmotionBackgroundProcessor

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# Configure logging
logging.getLogger('pymongo').setLevel(logging.INFO)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("main")

class SplashScreen(tk.Tk):
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
        self.status_var.set("Starting backend service...")
        self.status_label = tk.Label(self, textvariable=self.status_var, bg="#0B1B3F", fg="white")
        self.status_label.pack(pady=10)
        
        # Start loading process
        self.after(100, self.initialize_app)
    
    def update_progress(self, value, status_text):
        """Update progress bar and status text"""
        self.progress_var.set(value)
        self.status_var.set(status_text)
        self.update_idletasks()
        
    def initialize_app(self):
        """Initialize the application components in the background"""
        # Start backend process
        self.update_progress(10, "Starting backend service...")
        backend_process = subprocess.Popen(["python", "backend.py"])
        
        # Wait for backend to be ready
        self.update_progress(20, "Waiting for backend to initialize...")
        backend_ready = False
        for i in range(10):
            try:
                r = requests.get(API_URL)
                if r.status_code == 405:
                    backend_ready = True
                    logger.info("Backend is ready!")
                    break
            except requests.ConnectionError:
                self.update_progress(20 + i*3, f"Backend starting ({i+1}/10)...")
                time.sleep(0.5)
                
        if not backend_ready:
            self.update_progress(100, "Error: Backend failed to start. Check logs.")
            logger.error("Backend failed to start")
            time.sleep(3)
            self.destroy()
            exit(1)
            
        # Create the main application (this will be quick since we use lazy loading)
        self.update_progress(60, "Initializing user interface...")
        app = MainApplication()
        
        # Set up emotion processor with lazy loading
        self.update_progress(80, "Setting up emotion processing...")
        dummy_callback = lambda status: None
        emotion_processor = EmotionBackgroundProcessor(status_update_callback=dummy_callback, lazy_load=True)
        emotion_thread = threading.Thread(target=emotion_processor.run, daemon=True)
        
        # Finish loading
        self.update_progress(100, "Loading complete!")
        app.emotion_processor = emotion_processor
        
        # Wait a moment to show 100% then destroy splash and show main app
        self.after(500, lambda: self.finish_loading(app, emotion_thread, backend_process))
        
    def finish_loading(self, app, emotion_thread, backend_process):
        """Close splash screen and show main app"""
        emotion_thread.start()
        self.destroy()
        app.protocol("WM_DELETE_WINDOW", lambda: self.on_close(app, backend_process))
        app.mainloop()
        
    def on_close(self, app, backend_process):
        """Clean shutdown when closing the app"""
        if hasattr(app, 'emotion_processor'):
            app.emotion_processor.stop()
        backend_process.terminate()
        app.destroy()

def run_session_text_aggregation():
    while True:
        try:
            # Run the sessionTextAggregation.py script
            subprocess.run(["python", "src/sessionTextAggregate.py"], check=True)
        except subprocess.CalledProcessError as e:
            logger.error(f"Error running sessionTextAggregation.py: {e}")
        time.sleep(60)  # Run once per minute

def run_session_text_aggregation60():
    while True:
        try:
            # Run the sessionTextAggregation60.py script
            subprocess.run(["python", "src/sessionTextAggregate60.py"], check=True)
        except subprocess.CalledProcessError as e:
            logger.error(f"Error running sessionTextAggregation60.py: {e}")
        time.sleep(60)  # Run once per minute

if __name__ == "__main__":
    # Start the splash screen
    splash = SplashScreen()
    splash.mainloop()
