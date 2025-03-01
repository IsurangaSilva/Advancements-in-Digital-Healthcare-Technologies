import os

# Backend API URL
API_URL = "http://127.0.0.1:8000/chat"

# Model paths and settings
MODEL_PATH = os.path.join("models", "base.pt")
AUDIO_FILE = "recorded_audio.wav"
TRANSCRIPTION_FILE = "transcriptions.csv"

# Audio recording settings
RATE = 16000
CHUNK = 4096
FORMAT = 8
CHANNELS = 1