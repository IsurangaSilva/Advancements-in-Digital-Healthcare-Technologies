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
from emotion_aggregator_launcher import start_emotion_aggregators
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

class SplashScreen(tk.Toplevel):
    """Splash screen shown during application startup"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.title("MIRROR APP - Loading")
        self.geometry("400x300")
        self.configure(bg="#0B1B3F")
        self.overrideredirect(True)  # Remove window decorations
        self.attributes('-topmost', True)  # Keep on top of other windows
        
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

def start_backend():
    """Start the backend server"""
    import backend
    port = 8000
    
    # Preload models for faster first-time use
    try:
        logger.info("Loading emotion prediction models at startup...")
        from model_manager import ModelManager
        model_manager = ModelManager()
        text_success, voice_success = model_manager.load_prediction_models()
        logger.info(f"Models loaded: Text={text_success}, Voice={voice_success}")
    except Exception as e:
        logger.error(f"Error preloading models: {e}")
    
    # Start the backend server
    try:
        uvicorn.run(backend.app, host="127.0.0.1", port=port)
    except Exception as e:
        logger.error(f"Backend server error: {e}")

def check_backend_ready(app, splash):
    """Check if backend is ready and update splash screen"""
    try:
        r = requests.get(API_URL)
        if r.status_code == 405:  # Method not allowed is a good sign - the server is responding
            logger.info("Backend is ready!")
            splash.update_progress(50, "Backend initialized successfully!")
            finish_loading(app, splash)
            return
    except requests.ConnectionError:
        # Still connecting - update progress
        current_progress = splash.progress_var.get()
        if current_progress < 45:  # Cap at 45% until backend is ready
            splash.update_progress(current_progress + 2, f"Connecting to backend...")
    
    # Check again after a short delay (recursive with timeout check)
    check_count = getattr(check_backend_ready, 'count', 0) + 1
    setattr(check_backend_ready, 'count', check_count)
    
    if check_count > 20:  # Timeout after 10 seconds (20 * 500ms)
        logger.error("Backend failed to start")
        splash.update_progress(100, "Error: Backend failed to start")
        app.after(3000, lambda: (splash.destroy(), sys.exit(1)))
    else:
        app.after(500, lambda: check_backend_ready(app, splash))

def finish_showing_app(app, splash):
    """Finalize app loading by showing main window and destroying splash screen"""
    app.deiconify()  # Show the main window
    app.update()     # Force update to ensure everything is rendered correctly
    splash.destroy() # Close splash screen
    
    # Force app to appear as top window
    app.lift()
    app.focus_force()
    app.attributes('-topmost', True)
    app.update()
    app.attributes('-topmost', False)
    
    logger.info("Application ready and shown to user.")

def finish_loading(app, splash):
    """Initialize the main application features and close splash screen"""
    # Update progress
    splash.update_progress(55, "Creating user interface...")
    
    # Preload all models first
    try:
        splash.update_progress(60, "Loading prediction models...")
        from model_manager import ModelManager
        model_manager = ModelManager()
        text_success, voice_success = model_manager.load_prediction_models()
        
        # Load FER model
        splash.update_progress(65, "Loading facial emotion recognition model...")
        from FER.model_loader import load_fer_models
        fer_success = load_fer_models()
        
        if not all([text_success, voice_success, fer_success]):
            logger.warning(f"Not all models loaded successfully: Text={text_success}, Voice={voice_success}, FER={fer_success}")
            # We'll continue anyway but the app will show the models as unavailable
        
        app.model_status = {
            'text': text_success,
            'voice': voice_success,
            'fer': fer_success
        }
        logger.info(f"Models loaded: Text={text_success}, Voice={voice_success}, FER={fer_success}")
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        app.model_status = {'text': False, 'voice': False, 'fer': False}
    
    # Set up emotion processor with lazy loading=False since we already loaded models
    splash.update_progress(70, "Setting up emotion processing...")
    dummy_callback = lambda status: None
    emotion_processor = EmotionBackgroundProcessor(status_update_callback=dummy_callback, lazy_load=False)
    emotion_thread = threading.Thread(target=emotion_processor.run, daemon=True)
    
    # Start Text and Audio emotion aggregators
    splash.update_progress(75, "Starting emotion aggregators...")
    try:
        start_emotion_aggregators()
        logger.info("Emotion aggregators started successfully")
    except Exception as e:
        logger.error(f"Failed to start emotion aggregators: {e}")
    
    # Start audio handler with continuous recording
    splash.update_progress(85, "Setting up audio handling...")
    try:
        from audio_handler import AudioHandler
        audio_handler = AudioHandler()
        audio_handler.start_continuous_recording(segment_duration=20)
        app.audio_handler = audio_handler  # Store reference for cleanup later
        logger.info("Audio handler with continuous recording started")
    except Exception as e:
        logger.error(f"Failed to start audio handler: {e}")
    
    # Set up app references
    splash.update_progress(95, "Finalizing application setup...")
    app.emotion_processor = emotion_processor
    
    # Start emotion processor thread
    emotion_thread.start()
    
    # Final loading
    splash.update_progress(100, "Loading complete!")
    
    # Show main window with a brief delay to ensure all UI elements are ready
    app.after(800, lambda: finish_showing_app(app, splash))

if __name__ == "__main__":
    try:
        # Create the main application (hidden initially)
        app = MainApplication()
        app.withdraw()  # Hide the main window initially
        
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=start_backend)
        backend_thread.daemon = True
        backend_thread.start()
        
        # Show splash screen
        splash = SplashScreen(app)
        
        # Start backend check with timer
        app.after(500, lambda: check_backend_ready(app, splash))
        
        # Set up clean shutdown
        def on_close():
            logger.info("Application shutdown initiated")
            
            # Stop emotion processor if it exists
            if hasattr(app, 'emotion_processor'):
                logger.info("Stopping emotion processor")
                app.emotion_processor.stop()
                
            # Stop audio handler if it exists
            if hasattr(app, 'audio_handler'):
                logger.info("Stopping audio handler")
                app.audio_handler.stop_continuous_recording()
                
            logger.info("Application shutdown complete")
            app.destroy()
            
        app.protocol("WM_DELETE_WINDOW", on_close)
        
        # Start the main loop
        app.mainloop()
        
    except Exception as e:
        logger.error(f"Failed to initialize: {e}")
        sys.exit(1)
