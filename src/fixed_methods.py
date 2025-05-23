"""Temporary file with fixed methods to copy back into chat.py"""

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
            # Make sure we're using the configured models
            from voice_emotion_prediction import analyze_audio, load_emotion_model
            from config import VOICE_MODEL_PATH
            
            # Load voice model if needed
            voice_model = load_emotion_model(VOICE_MODEL_PATH)
            
            # Analyze audio using the loaded model
            analyze_audio(voice_model, AUDIO_FILE)
            
            # Transcribe and analyze text
            text = self.audio_handler.transcribe_audio(AUDIO_FILE)
            if text and not text.startswith('['):  # Skip if it's a status message like [Silence]
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
