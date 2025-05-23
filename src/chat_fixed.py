import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import markdown
from tkhtmlview import HTMLLabel
import threading
import os
import json
from datetime import datetime
from config import AUDIO_FILE
from api import send_to_backend
from audio_handler import AudioHandler
from text_prediction import TextualPrediction
from chat_ui import create_widgets, update_scroll_region, bind_mouse_scroll
from voice_emotion_prediction import analyze_audio, load_emotion_model
import pyttsx3
import pygame
import time
import random
import os
from config import TEXT_MODEL_PATH, VOICE_MODEL_PATH
from text_emotion_prediction import initialize_model as init_text_model
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
pygame.init()

class ChatbotApp(tk.Frame):
    def __init__(self, parent, controller=None, **kwargs):
        super().__init__(parent, **kwargs)
        self.controller = controller
        self.min_chat_width = 1024
        self.configure(bg='#000D2E')

        # Conversation state
        self.conversation_paused = False

        self.top_frame = tk.Frame(self, bg='#000D2E')
        self.top_frame.pack(side=tk.TOP, fill=tk.X, padx=10, pady=(10, 0))

        title_label = tk.Label(self.top_frame, text="Voice Companion", font=("Helvetica", 30, "bold"),
                           bg='#000D2E', fg="white")
        title_label.pack(pady=(30, 10))

        # Resume/Play button with initial red color (running state)
        self.resume_play_button = tk.Button(
            self.top_frame,
            text="Pause" if not self.conversation_paused else "Resume",
            font=("Helvetica", 12),
            bg="#D32F2F",  # Red for running state (Pause)
            fg="white",
            activebackground="#4CAF50",
            command=self.toggle_conversation
        )
        self.resume_play_button.pack(pady=10)

        self.left_frame = tk.Frame(self, bg='#000D2E', width=400)
        self.left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=10, pady=10)
        self.right_frame = tk.Frame(self, bg='#000D2E')
        self.right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        self.message_count = 0
        self.conversation_history = []
        self.audio_handler = AudioHandler()
        self.text_prediction = TextualPrediction()
        self.chat_history_file = "chat_history.json"
        
        # Create UI widgets
        create_widgets(self, self.right_frame)
        
        # Load icons
        icon_size = (50, 50)
        current_dir = os.path.dirname(os.path.abspath(__file__))
        user_icon_path = os.path.join(current_dir, "profile_pictures", "profile.jpg")
        ai_icon_path = os.path.join(current_dir, "assets", "images", "chatbot.png")
        
        self.ensure_placeholder_images(user_icon_path, ai_icon_path)
        
        self.user_icon = ImageTk.PhotoImage(
            Image.open(user_icon_path).resize(icon_size, Image.LANCZOS)
        ) if os.path.exists(user_icon_path) else None
        self.ai_icon = ImageTk.PhotoImage(
            Image.open(ai_icon_path).resize(icon_size, Image.LANCZOS)
        ) if os.path.exists(ai_icon_path) else None
        
        if not self.user_icon:
            print(f"Warning: User icon not found at {user_icon_path}")
        if not self.ai_icon:
            print(f"Warning: AI icon not found at {ai_icon_path}")
        
        # Bind events
        self.messages_frame.bind("<Configure>", lambda event: update_scroll_region(self))
        self.chat_canvas.bind("<Configure>", lambda event: update_scroll_region(self))
        bind_mouse_scroll(self)
        
        # Initialize 2D model
        self.init_2d_model()
        
        # Initialize models
        self.initialize_models()
        
        # Add welcome message
        self.add_message("AI", "Hello! How can I help you today?")
        
        # Load model in background
        threading.Thread(target=self.load_model, daemon=True).start()
        
        # Start recording if not paused
        if not self.conversation_paused:
            self.start_background_recording()
        
    def ensure_placeholder_images(self, user_icon_path, ai_icon_path):
        """Create placeholder images if they don't exist."""
        if not os.path.exists(user_icon_path):
            try:
                os.makedirs(os.path.dirname(user_icon_path), exist_ok=True)
                img = Image.new('RGB', (100, 100), color=(73, 109, 137))
                img.save(user_icon_path)
                print(f"Created placeholder user icon at {user_icon_path}")
            except Exception as e:
                print(f"Failed to create user icon: {e}")
                
        if not os.path.exists(ai_icon_path):
            try:
                os.makedirs(os.path.dirname(ai_icon_path), exist_ok=True)
                img = Image.new('RGB', (100, 100), color=(0, 128, 0))
                img.save(ai_icon_path)
                print(f"Created placeholder AI icon at {ai_icon_path}")
            except Exception as e:
                print(f"Failed to create AI icon: {e}")
                
    def create_fallback_surface(self, color):
        """Create a colored rectangle as a fallback for missing images."""
        surface = pygame.Surface((400, 450))
        surface.fill(color)
        return surface
        
    def init_2d_model(self):
        """Initialize the 2D animated face in the left frame."""
        self.model_canvas = tk.Canvas(self.left_frame, width=400, height=450, bg='#000D2E', highlightthickness=0)
        self.model_canvas.pack(pady=20)

        current_dir = os.path.dirname(os.path.abspath(__file__))
        assets_dir = os.path.join(current_dir, "assets", "images")
        
        try:
            self.mouth_open = pygame.transform.scale(pygame.image.load(os.path.join(assets_dir, "eyeeopen_mouthopen.png")), (400, 450))
            self.mouth_closed = pygame.transform.scale(pygame.image.load(os.path.join(assets_dir, "eyesopen_mouthclosed.png")), (400, 450))
            self.eyes_closed = pygame.transform.scale(pygame.image.load(os.path.join(assets_dir, "eyesclosed_mouthclosed.png")), (400, 450))
        except pygame.error as e:
            print(f"Error loading animation assets: {e}")
            print(f"Looking for assets in: {assets_dir}")
            self.mouth_open = self.create_fallback_surface((0, 0, 255))
            self.mouth_closed = self.create_fallback_surface((0, 255, 0))
            self.eyes_closed = self.create_fallback_surface((255, 0, 0))

        self.animation_running = False
        self.current_image = self.mouth_closed
        self.update_model_display()

    def update_model_display(self):
        """Update the 2D model display on the Tkinter canvas."""
        raw_data = pygame.image.tostring(self.current_image, "RGBA")
        pil_image = Image.frombytes("RGBA", (400, 450), raw_data)
        self.model_image = ImageTk.PhotoImage(pil_image)
        self.model_canvas.create_image(200, 225, image=self.model_image)

    def animate_face(self, text):
        """Animate the 2D face while speaking."""
        self.animation_running = True
        engine = pyttsx3.init()
        engine.setProperty("rate", 160)

        def _animate():
            while self.animation_running:
                if random.randint(0, 50) > 48:
                    self.current_image = self.eyes_closed
                else:
                    self.current_image = self.mouth_open if random.randint(0, 1) else self.mouth_closed
                self.after(0, self.update_model_display)
                time.sleep(0.2)
                
        anim_thread = threading.Thread(target=_animate, daemon=True)
        anim_thread.start()
        engine.say(text)
        engine.runAndWait()
        self.animation_running = False
        self.current_image = self.mouth_closed
        self.after(0, self.update_model_display)
        
    def append_to_chat_history(self, sender, message, timestamp):
        """Append message to chat history file."""
        entry = {"sender": sender, "message": message, "timestamp": timestamp}
        try:
            with open(self.chat_history_file, "a") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception as e:
            print(f"Error appending chat history: {e}")
            
    def speak_ai(self, text):
        """Speak AI response with animation."""
        if not self.conversation_paused:
            threading.Thread(target=self.animate_face, args=(text,), daemon=True).start()
        
    def start_background_recording(self):
        """Start background audio recording if not paused."""
        if not self.conversation_paused:
            self.audio_handler.is_recording = True
            self.recording_thread = threading.Thread(target=self.audio_handler.record_audio, daemon=True)
            self.recording_thread.start()
            self.check_recording_status()
        
    def check_recording_status(self):
        """Check recording status and process audio if not paused."""
        if self.conversation_paused:
            return
        
        if not self.recording_thread.is_alive():
            if os.path.exists(AUDIO_FILE):
                text = self.audio_handler.transcribe_audio(AUDIO_FILE)
                if (text.strip() and 
                    text != "Error: Could not understand the audio." and
                    not text.startswith("[Silence]") and
                    not text.startswith("[Service unavailable]") and
                    not text.startswith("Error:") and
                    not text.startswith("Transcription error:")):
                    
                    self.user_input.delete(0, tk.END)
                    self.user_input.insert(0, text)
                    self.send_message()
            self.start_background_recording()
        else:
            self.after(1000, self.check_recording_status)

    def toggle_conversation(self):
        """Toggle conversation state between paused and running."""
        try:
            if self.conversation_paused:
                # Resume conversation
                self.conversation_paused = False
                self.resume_play_button.config(text="Pause", bg="#D32F2F")  # Red for Pause
                self.start_background_recording()
                print("Conversation resumed")
            else:
                # Pause conversation
                self.conversation_paused = True
                self.resume_play_button.config(text="Resume", bg="#4CAF50")  # Green for Resume
                self.audio_handler.is_recording = False
                if hasattr(self, 'recording_thread') and self.recording_thread.is_alive():
                    self.recording_thread.join(timeout=1.0)
                print("Conversation paused")
        except Exception as e:
            print(f"Error toggling conversation: {e}")
            messagebox.showerror("Error", f"Failed to toggle conversation: {str(e)}")

    def add_message(self, sender, message):
        """Add a message to the chat interface."""
        html_content = markdown.markdown(message, extensions=["fenced_code", "tables"])
        styled_html = f"""
        <div style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; border-radius: 10px; padding: 10px;">
            {html_content}
        </div>
        """
        container = tk.Frame(self.messages_frame, bg='#000D2E')
        container.grid(row=self.message_count, column=0, sticky='ne' if sender == "User" else 'nw', padx=5, pady=5)
        msg_frame = tk.Frame(container, bg='#000D2E')
        msg_frame.pack(side='right' if sender == "User" else 'left',
                      anchor='ne' if sender == "User" else 'nw')
        
        bubble_bg = "#0d6efd" if sender == "User" else "#6c757d"
        
        if sender == "User" and self.user_icon:
            tk.Label(msg_frame, image=self.user_icon, bg='#000D2E').pack(side='right', padx=(5, 0))
            bubble_frame = tk.Frame(msg_frame, bg=bubble_bg)
            bubble_frame.pack(side='right')
            bubble_label = HTMLLabel(bubble_frame, html=styled_html, background=bubble_bg, width=80)
            bubble_label.pack(side='right', padx=10, pady=5)
            bubble_label.fit_height()
        elif sender == "AI" and self.ai_icon:
            tk.Label(msg_frame, image=self.ai_icon, bg='#000D2E').pack(side='left', padx=(0, 5))
            bubble_frame = tk.Frame(msg_frame, bg=bubble_bg)
            bubble_frame.pack(side='left')
            bubble_label = HTMLLabel(bubble_frame, html=styled_html, background=bubble_bg, width=80)
            bubble_label.pack(side='left', padx=10, pady=5)
            bubble_label.fit_height()
        else:
            bubble_frame = tk.Frame(msg_frame, bg=bubble_bg)
            bubble_frame.pack(side='right' if sender == "User" else 'left')
            bubble_label = HTMLLabel(bubble_frame, html=styled_html, background=bubble_bg, width=80)
            bubble_label.pack(side='right' if sender == "User" else 'left', padx=10, pady=5)
            bubble_label.fit_height()

        self.message_count += 1
        self.chat_canvas.yview_moveto(1.0)

        timestamp = datetime.now().strftime("%Y-%m-d %H:%M:%S")
        self.append_to_chat_history(sender, message, timestamp)

        if sender == "AI":
            self.speak_ai(message)    
            
    def load_model(self):
        """Load models and report status."""
        result = self.audio_handler.load_model()
        
        try:
            init_text_model()
            voice_model = load_emotion_model(VOICE_MODEL_PATH)
            if voice_model:
                result += " | Voice and text models loaded successfully"
            else:
                result += " | Warning: Voice model could not be loaded"
        except Exception as e:
            print(f"Error initializing prediction models: {e}")
            result += f" | Warning: Error loading prediction models: {str(e)}"
            
        self.add_message("AI", result)
        
    def send_message(self):
        """Send user message and get AI response."""
        if self.conversation_paused:
            return
        
        user_text = self.user_input.get().strip()
        if not user_text:
            return
        self.add_message("User", user_text)
        self.conversation_history.append(f"[USER]: {user_text}")
        self.user_input.delete(0, tk.END)
        self.user_input.config(state=tk.DISABLED)
        threading.Thread(target=self.get_ai_response, args=(user_text,), daemon=True).start()
        
    def initialize_models(self):
        """Initialize text and voice emotion models."""
        try:
            init_text_model()
            voice_model = load_emotion_model(VOICE_MODEL_PATH)
            if voice_model:
                print("Voice and text models loaded successfully")
            else:
                print("Warning: Voice model could not be loaded")
        except Exception as e:
            print(f"Error initializing models: {e}")
    
    def get_ai_response(self, user_text):
        """Get AI response from backend."""
        if self.conversation_paused:
            return
        
        try:
            ai_text = send_to_backend(self.conversation_history, user_text)
            self.after(0, self.add_message, "AI", ai_text)
            self.conversation_history.append(f"[ASSISTANT]: {ai_text}")
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Error", f"Failed to connect: {str(e)}"))
        finally:
            self.after(0, lambda: self.user_input.config(state=tk.NORMAL))

    def recognize_speech(self):
        """Handle speech recognition toggle."""
        if self.conversation_paused:
            self.add_message("AI", "Conversation is paused. Resume to enable speech recognition.")
            return
        
        if not self.audio_handler.is_recording:
            self.add_message("AI", "Listening... Click again to stop.")
            self.audio_handler.is_recording = True
            self.recording_thread = threading.Thread(target=self.audio_handler.record_audio, daemon=True)
            self.recording_thread.start()
            self.speak_btn.config(text="🛑 Stop")
        else:
            self.audio_handler.is_recording = False
            self.recording_thread.join()
            self.speak_btn.config(text="🎤 Speak")
            if os.path.exists(AUDIO_FILE):
                voice_model = load_emotion_model(VOICE_MODEL_PATH)
                analyze_audio(voice_model, AUDIO_FILE)
                text = self.audio_handler.transcribe_audio(AUDIO_FILE)
                self.text_prediction.prediction(text)
                if text.strip():
                    self.add_message("User", text)
                    self.user_input.delete(0, tk.END)
                    self.user_input.insert(0, text)
                    self.send_message()
                else:
                    self.add_message("AI", "I couldn't understand. Please try again.")
            else:
                self.add_message("AI", "Error: Audio file not saved properly.")

if __name__ == "__main__":
    root = tk.Tk()
    app = ChatbotApp(root)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()