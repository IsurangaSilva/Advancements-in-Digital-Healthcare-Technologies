import os

# Backend API URL
API_URL = "http://127.0.0.1:8000/chat"

# Model paths and settings
MODEL_PATH = os.path.join("models", "base.pt")
TEXT_MODEL_PATH = os.path.join("models", "IT20629144_TextBased_03.keras")
VOICE_MODEL_PATH = os.path.join("models", "IT21126574_VoiceBased_03.h5")

#Audio File Paths
AUDIO_FILE = "audios/temp_audio/recorded_audio.wav"

#Text File Paths
TRANSCRIPTION_FILE = "transcriptions/full_transcript/full_transcript.csv"
TEMP_TRANSCRIPTION_FILE = "transcriptions/temp_transcript/temp_transcript.csv"
TRAIN_TEXT_DATASET = 'datasets/Text_Based/2025_research_04.csv'
TEST_TEXT_DATASET = 'datasets/Text_Based/test_final_dataset.csv'
VAL_TEXT_DATASET = 'datasets/Text_Based/val_final_dataset.csv'
TEMP_TEXT_PREDICTION_RESULT_CSV = 'result/Text/temp_prediction.csv'
TEMP_TEXT_PREDICTION_RESULT_JSON = 'db/Text/temp_prediction.json'

# Emotion file paths
EMOTION_FILE = 'db/Audio/voice_prediction.json'
session_file = 'db/Audio/voice_session_summary.json'
TEMP_VOICE_PREDICTION_RESULT_CSV = 'result/Audio/voice_prediction.csv'


# Audio recording settings
RATE = 16000
CHUNK = 4096
FORMAT = 8
CHANNELS = 1