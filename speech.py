import torch
import whisper
import pyaudio
import wave
import os

class SpeechRecognition:
    def __init__(self):
        self.is_recording = False
        self.audio_file = "recorded_audio.wav"
        self.model = None 

    def load_model(self):
        """Loads the Whisper model from the local models/ folder."""
        try:
            model_path = os.path.join("models", "base.pt")
            device = "cuda" if torch.cuda.is_available() else "cpu"
            if not os.path.exists(model_path):
                return "Error: Model file not found in models/ folder."
            self.model = whisper.load_model(model_path, device=device)
            return f"Whisper model loaded successfully from models/ on {device.upper()}!"
        except Exception as e:
            return f"Error loading model: {e}"

    def record_audio(self):
        """Records audio at 16kHz, 16-bit Mono and saves it as a WAV file."""
        RATE, CHUNK, FORMAT, CHANNELS = 16000, 4096, pyaudio.paInt16, 1
        mic = pyaudio.PyAudio()
        try:
            stream = mic.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
            frames = []
            while self.is_recording:
                data = stream.read(CHUNK, exception_on_overflow=False)
                frames.append(data)
            stream.stop_stream()
            stream.close()
            mic.terminate()
            with wave.open(self.audio_file, "wb") as wf:
                wf.setnchannels(CHANNELS)
                wf.setsampwidth(mic.get_sample_size(FORMAT))
                wf.setframerate(RATE)
                wf.writeframes(b''.join(frames))
        except Exception as e:
            return f"Recording error: {e}"

    def transcribe_audio(self, file_path):
        """Transcribes speech from an audio file using Whisper."""
        if self.model is None:
            return "Error: Whisper model not loaded."
        try:
            result = self.model.transcribe(file_path)
            return result["text"].strip()
        except Exception as e:
            return f"Transcription error: {e}"
