# chat.py
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
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 
pygame.init()

class ChatbotApp(tk.Frame):
    def __init__(self, parent, controller=None, **kwargs):
        super().__init__(parent, **kwargs)
        self.controller = controller
        self.min_chat_width = 1024
        self.configure(bg='#000D2E')

        self.top_frame = tk.Frame(self, bg='#000D2E')
        self.top_frame.pack(side=tk.TOP, fill=tk.X, padx=10, pady=(10, 0))

        title_label = tk.Label(self.top_frame, text="Voice Companion", font=("Helvetica", 30, "bold"),
                           bg='#000D2E', fg="white")
        title_label.pack(pady=(30, 30)) 

        self.left_frame = tk.Frame(self, bg='#000D2E', width=400)
        self.left_frame.pack(side=tk.LEFT, fill=tk.Y, padx=10, pady=10)
    
        self.right_frame = tk.Frame(self, bg='#000D2E')
        self.right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)

        icon_size = (50, 50)
        self.user_icon = ImageTk.PhotoImage(
            Image.open("./profile_pictures/profile.jpg").resize(icon_size, Image.LANCZOS)
        ) if os.path.exists("./profile_pictures/profile.jpg") else None
        self.ai_icon = ImageTk.PhotoImage(
            Image.open("assets/images/chatbot.png").resize(icon_size, Image.LANCZOS)
        ) if os.path.exists("assets/images/chatbot.png") else None

        self.message_count = 0
        self.conversation_history = []
        self.audio_handler = AudioHandler()
        self.text_prediction = TextualPrediction()
        self.chat_history_file = "chat_history.json"

        create_widgets(self, self.right_frame)
        self.messages_frame.bind("<Configure>", lambda event: update_scroll_region(self))
        self.chat_canvas.bind("<Configure>", lambda event: update_scroll_region(self))
        bind_mouse_scroll(self)
        self.init_2d_model()
        self.add_message("AI", "Hello! How can I help you today?")
        threading.Thread(target=self.load_model, daemon=True).start()
        self.start_background_recording()

    def init_2d_model(self):
        """Initialize the 2D animated face in the left frame."""
        self.model_canvas = tk.Canvas(self.left_frame, width=400, height=450, bg='#000D2E', highlightthickness=0)
        self.model_canvas.pack(pady=20)

    
        self.mouth_open = pygame.transform.scale(pygame.image.load("assets/images/eyeeopen_mouthopen.png"), (400, 450))
        self.mouth_closed = pygame.transform.scale(pygame.image.load("assets/images/eyesopen_mouthclosed.png"), (400, 450))
        self.eyes_closed = pygame.transform.scale(pygame.image.load("assets/images/eyesclosed_mouthclosed.png"), (400, 450))

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
        engine.setProperty("rate",160)

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
        entry = {"sender": sender, "message": message, "timestamp": timestamp}
        try:
            with open(self.chat_history_file, "a") as f:
                f.write(json.dumps(entry) + "\n")
        except Exception as e:
            print(f"Error appending chat history: {e}")

    def speak_ai(self, text):
        """Speak AI response with animation."""
        threading.Thread(target=self.animate_face, args=(text,), daemon=True).start()

    def start_background_recording(self):
        self.audio_handler.is_recording = True
        self.recording_thread = threading.Thread(target=self.audio_handler.record_audio(), daemon=True)
        self.recording_thread.start()
        self.check_recording_status()

    def check_recording_status(self):
        if not self.recording_thread.is_alive():
            if os.path.exists(AUDIO_FILE):               
                    text = self.audio_handler.transcribe_audio(AUDIO_FILE)
                    if text.strip() and text != "Error: Could not understand the audio.":
                        model = load_emotion_model()
                        analyze_audio(model, AUDIO_FILE)
                        self.text_prediction.prediction(text)
                        self.user_input.delete(0, tk.END)
                        self.user_input.insert(0, text)
                        self.send_message()
   
            # Restart recording
            self.start_background_recording() 
        else:
            self.after(1000, self.check_recording_status)

    def add_message(self, sender, message):
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
        result = self.audio_handler.load_model()
        self.add_message("AI", result)

    def send_message(self):
        user_text = self.user_input.get().strip()
        if not user_text:
            return
        self.add_message("User", user_text)
        self.conversation_history.append(f"[USER]: {user_text}")
        self.user_input.delete(0, tk.END)
        self.user_input.config(state=tk.DISABLED)
        threading.Thread(target=self.get_ai_response, args=(user_text,), daemon=True).start()

    def get_ai_response(self, user_text):
        try:
            ai_text = send_to_backend(self.conversation_history, user_text)
            self.after(0, self.add_message, "AI", ai_text)
            self.conversation_history.append(f"[ASSISTANT]: {ai_text}")
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Error", f"Failed to connect: {str(e)}"))
        finally:
            self.after(0, lambda: self.user_input.config(state=tk.NORMAL))

    def recognize_speech(self):
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
                model = load_emotion_model()
            if model:
                analyze_audio(model, AUDIO_FILE)
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