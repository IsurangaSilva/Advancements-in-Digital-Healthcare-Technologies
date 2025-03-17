import tkinter as tk
from tkinter import messagebox
import ttkbootstrap as tb
from ttkbootstrap.constants import *
from PIL import Image, ImageTk
import markdown
from tkhtmlview import HTMLLabel
import threading
import os
from config import AUDIO_FILE
from api import send_to_backend
from audio_handler import AudioHandler
from text_prediction import TextualPrediction
from chat_ui import create_widgets, update_scroll_region, bind_mouse_scroll 
from voice_emotion_prediction import analyze_audio, load_emotion_model 

class ChatbotApp(tb.Window):
    def __init__(self):
        super().__init__(themename="darkly")
        self.title("Mirror Chat 🤖")
        self.geometry("1920x1080")
        self.state("zoomed")
        self.min_chat_width = 1024

        icon_size = (30, 30)
        self.user_icon = ImageTk.PhotoImage(
            Image.open("assets/user_icon.png").resize(icon_size, Image.LANCZOS)
        ) if os.path.exists("assets/user_icon.png") else None
        self.ai_icon = ImageTk.PhotoImage(
            Image.open("assets/robot_icon.png").resize(icon_size, Image.LANCZOS)
        ) if os.path.exists("assets/robot_icon.png") else None

        self.message_count = 0
        self.conversation_history = []   
        self.audio_handler = AudioHandler()
        self.text_prediction = TextualPrediction()

        # Create Widget
        create_widgets(self)
        self.messages_frame.bind("<Configure>", lambda event: update_scroll_region(self))
        self.chat_canvas.bind("<Configure>", lambda event: update_scroll_region(self))
        bind_mouse_scroll(self)

        self.add_message("AI", "Hello! How can I help you today?")
        threading.Thread(target=self.load_model, daemon=True).start()
        self.start_background_recording()

    def start_background_recording(self):
        """Starts background recording and checks for user speech."""
        self.audio_handler.is_recording = True
        self.recording_thread = threading.Thread(target=self.audio_handler.record_audio(), daemon=True)
        self.recording_thread.start()
        self.check_recording_status()    

    def check_recording_status(self):
        """Checks if the recording has stopped and processes the audio."""
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
            # Check again after 1 second
            self.after(1000, self.check_recording_status)
    

    def add_message(self, sender, message):
        """Creates a chat bubble with Markdown rendering and updates conversation history."""
        html_content = markdown.markdown(message, extensions=["fenced_code", "tables"])
        styled_html = f"""
        <div style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; border-radius: 10px; padding: 10px;">
            {html_content}
        </div>
        """
        container = tk.Frame(self.messages_frame, bg='#2d2d2d')
        container.grid(row=self.message_count, column=0, sticky='ne' if sender == "User" else 'nw', padx=5, pady=5)
        msg_frame = tk.Frame(container, bg='#2d2d2d')
        msg_frame.pack(side='right' if sender == "User" else 'left', anchor='ne' if sender == "User" else 'nw')
        if sender == "User" and self.user_icon:
            tk.Label(msg_frame, image=self.user_icon, bg='#2d2d2d').pack(side='right', padx=(5, 0))
        bubble_frame = tk.Frame(msg_frame, bg="#0d6efd" if sender == "User" else "#6c757d")
        bubble_frame.pack(side='right' if sender == "User" else 'left')
        bubble_label = HTMLLabel(bubble_frame, html=styled_html, background="#0d6efd" if sender == "User" else "#6c757d", width=80)
        bubble_label.pack(side='right' if sender == "User" else 'left', padx=10, pady=5)
        bubble_label.fit_height()
        if sender == "AI" and self.ai_icon:
            tk.Label(msg_frame, image=self.ai_icon, bg='#2d2d2d').pack(side='left', padx=(0, 5))
        self.message_count += 1
        self.chat_canvas.yview_moveto(1.0)

    def load_model(self):
        """Loads the Speech Identify model from the local models/ folder asynchronously."""
        self.add_message("AI", "Loading Speech Identify model... Please wait.")
        result = self.audio_handler.load_model()  
        self.add_message("AI", result)
    
    def recognize_speech(self):
        """Toggles voice recording and transcribes speech using Whisper."""
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

    def send_message(self):
        """Sends user message along with conversation history to the backend and updates history."""
        user_text = self.user_input.get().strip()
        if not user_text:
            return
        self.add_message("User", user_text)
        self.conversation_history.append(f"[USER]: {user_text}")
        self.user_input.delete(0, tk.END)
        self.user_input.config(state=tk.DISABLED)
        threading.Thread(target=self.get_ai_response, args=(user_text,), daemon=True).start()

    def get_ai_response(self, user_text):
        """Sends conversation history and the latest message to the backend and appends the assistant response to history."""
        try:
            ai_text = send_to_backend(self.conversation_history, user_text)
            self.after(0, self.add_message, "AI", ai_text)
            self.conversation_history.append(f"[ASSISTANT]: {ai_text}")
        except Exception as e:
            self.after(0, lambda: messagebox.showerror("Error", f"Failed to connect: {str(e)}"))
        finally:
            self.after(0, lambda: self.user_input.config(state=tk.NORMAL))