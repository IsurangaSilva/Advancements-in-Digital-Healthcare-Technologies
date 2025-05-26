import csv
import os
import pyaudio
import wave
import speech_recognition as sr 
import numpy as np
import threading
import logging
from datetime import datetime
from config import AUDIO_FILE, RATE, CHUNK, FORMAT, CHANNELS, TRANSCRIPTION_FILE
import time

# Configure logging
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'audio_handler.log'), mode='a', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("AudioHandler")

class AudioHandler:
    def __init__(self):
        self.is_recording = False
        self.continuous_recording = False
        self.recognizer = sr.Recognizer() 
        self.csv_file = TRANSCRIPTION_FILE  
        self.frames = []
        self.format = pyaudio.paInt16
        self.channels = 1
        self.rate = 16000
        self.chunk = 1024
        self.mic = pyaudio.PyAudio()
        
        # Create audio directories if they don't exist
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.temp_audio_dir = os.path.join(current_dir, "audios", "temp_audio")
        self.full_audio_dir = os.path.join(current_dir, "audios", "full_audio")
        self.transcription_dir = os.path.join(current_dir, "transcriptions", "temp_transcript")        
        os.makedirs(self.temp_audio_dir, exist_ok=True)
        os.makedirs(self.full_audio_dir, exist_ok=True)
        os.makedirs(self.transcription_dir, exist_ok=True)
        
    def load_model(self):
        """Load voice model from the specified path using ModelManager."""
        try:
            # Import here to avoid circular imports
            from voice_emotion_prediction import load_emotion_model
            from config import VOICE_MODEL_PATH
            
            # Load the voice model
            model = load_emotion_model(VOICE_MODEL_PATH)
            
            if model is not None:
                print("Voice model loaded successfully")
                return "Voice model loaded successfully"
            else:
                print("Error: Failed to load voice model")
                return "Error: Failed to load voice model"
        except Exception as e:
            print(f"Error loading voice model: {e}")
            return f"Error loading voice model: {e}"

    def record_audio(self, record_time=5):
        """Records audio at 16kHz, 16-bit Mono and saves it as a WAV file."""
        mic = pyaudio.PyAudio()
        try:
            # Create directory if it doesn't exist
            audio_dir = os.path.dirname(AUDIO_FILE)
            if not os.path.exists(audio_dir):
                os.makedirs(audio_dir, exist_ok=True)
                
            stream = mic.open(format=self.format, channels=self.channels, rate=self.rate, input=True, frames_per_buffer=self.chunk)
            frames = []
            start_time = time.time()
            while self.is_recording and time.time() - start_time < record_time:                
                data = stream.read(self.chunk, exception_on_overflow=False)
                frames.append(data)

                if not (time.time() - start_time < record_time):  
                    self.is_recording = False
            stream.stop_stream()
            stream.close()
            mic.terminate()
            with wave.open(AUDIO_FILE, "wb") as wf:
                wf.setnchannels(CHANNELS)
                wf.setsampwidth(mic.get_sample_size(FORMAT))
                wf.setframerate(RATE)
                wf.writeframes(b''.join(frames))
            print(f"Audio saved to: {AUDIO_FILE}")
            return True
        except Exception as e:
            print(f"Recording error: {e}")
            return f"Recording error: {e}"
            
    def transcribe_audio(self, file_path):
        """Transcribes speech from an audio file using Google Speech Recognition."""
        if not os.path.exists(file_path):
            print(f"Error: Audio file not found at {file_path}.")
            return f"Error: Audio file not found at {file_path}."

        try:
            # Use the recognizer to transcribe the audio file
            with sr.AudioFile(file_path) as source:
                # Adjust for ambient noise before recording
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                audio = self.recognizer.record(source)
                
                # Use language="en-US" for more reliable results
                text = self.recognizer.recognize_google(audio, language="en-US")
                print(f"Transcription successful: '{text}'")

                # Save the transcription to the CSV file
                self.save_transcription_to_csv(text)
                return text.strip()
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand the audio - likely silent or no speech detected.")
            # Save an empty string to the CSV for silent audio - this is normal and expected
            self.save_transcription_to_csv("[Silence]")
            return "[Silence]"
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            # Still save a placeholder to the CSV to maintain synchronization
            self.save_transcription_to_csv("[Service unavailable]")
            return "[Service unavailable]"
        except Exception as e:
            print(f"Transcription error: {e}")
            return f"Transcription error: {e}"
           
    ## Insert Audio Converted Text To CSV file Under Trancription  
    def save_transcription_to_csv(self, text):
        """Appends the transcribed text to the CSV file under the 'transcription' column."""
        try:       
            file_exists = os.path.exists(self.csv_file)
            file_empty = file_exists and os.path.getsize(self.csv_file) == 0

            with open(self.csv_file, mode="a", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)

                if not file_exists or file_empty:
                    writer.writerow(["transcription"]) 
                writer.writerow([text]) 

                print(f"Transcription saved to {self.csv_file}")
        except Exception as e:
            print(f"Error saving transcription to CSV: {e}")

    def start_recording(self, record_time=5):
        """Starts recording audio in a separate thread."""
        if not self.is_recording:
            self.is_recording = True
            recording_thread = threading.Thread(target=self.record_audio, args=(record_time,))
            recording_thread.start()
            return f"Recording started for {record_time} seconds..."
        else:
            return "Recording is already in progress..."

    def stop_recording(self):
        """Stops an ongoing recording."""
        if self.is_recording:
            self.is_recording = False
            return "Recording stopped."
        else:
            return "No recording in progress."

    def record_and_transcribe(self, record_time=5):
        """Records audio for the specified duration and then transcribes it."""
        try:
            # Record audio
            record_result = self.start_recording(record_time)
            print(record_result)
            
            # Wait for recording to complete
            while self.is_recording:
                time.sleep(0.1)
            
            # Give a small delay to ensure file is saved
            time.sleep(0.5)
              # Transcribe the audio
            transcription = self.transcribe_audio(AUDIO_FILE)
            return transcription
        except Exception as e:
            print(f"Error in record_and_transcribe: {e}")
            return f"Error: {e}"
            
    def start_continuous_recording(self, segment_duration=20, chunk_duration=None):
        """Starts recording audio continuously in chunks of the specified duration."""
        if self.continuous_recording:
            return "Continuous recording is already running."
        
        # Use chunk_duration if provided for backward compatibility
        duration = chunk_duration if chunk_duration is not None else segment_duration
        
        self.continuous_recording = True
        recording_thread = threading.Thread(target=self.continuous_record_loop, args=(duration,))
        recording_thread.daemon = True  # This will terminate the thread when the main program exits
        recording_thread.start()
        return f"Continuous recording started with {segment_duration} second segments."
    
    def stop_continuous_recording(self):
        """Stops the continuous recording."""
        if self.continuous_recording:
            self.continuous_recording = False
            return "Continuous recording stopped."
        else:
            return "No continuous recording in progress."
            
    def continuous_record_loop(self, segment_duration=20):
        """Records audio in continuous segments for processing."""
        try:
            logger.info(f"Starting continuous recording with {segment_duration} second segments")
            segment_count = 0
            
            while self.continuous_recording:
                segment_count += 1
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                segment_filename = os.path.join(self.temp_audio_dir, f"segment_{timestamp}.wav")
                
                logger.info(f"Recording segment {segment_count} to {segment_filename}")
                
                # Record the segment
                mic = pyaudio.PyAudio()
                stream = mic.open(format=self.format, channels=self.channels, rate=self.rate, 
                                  input=True, frames_per_buffer=self.chunk)
                
                frames = []
                start_time = time.time()
                
                # Record for the specified duration or until continuous recording is stopped
                while self.continuous_recording and (time.time() - start_time < segment_duration):
                    data = stream.read(self.chunk, exception_on_overflow=False)
                    frames.append(data)
                
                stream.stop_stream()
                stream.close()
                mic.terminate()
                
                # Save the recorded segment
                try:
                    with wave.open(segment_filename, "wb") as wf:
                        wf.setnchannels(self.channels)
                        wf.setsampwidth(mic.get_sample_size(self.format))
                        wf.setframerate(self.rate)
                        wf.writeframes(b''.join(frames))
                    
                    logger.info(f"Saved audio segment to {segment_filename}")
                    
                    # Process the segment in a separate thread
                    processing_thread = threading.Thread(
                        target=self.process_audio_segment, 
                        args=(segment_filename,)
                    )
                    processing_thread.daemon = True
                    processing_thread.start()
                    
                except Exception as e:
                    logger.error(f"Error saving audio segment: {e}")
                
            logger.info("Continuous recording loop ended")
        except Exception as e:
            logger.error(f"Error in continuous recording: {e}")
            self.continuous_recording = False

    def process_audio_segment(self, segment_file):
        """Processes a recorded audio segment for transcription and emotion analysis."""
        try:
            logger.info(f"Processing audio segment: {segment_file}")
            
            # Transcribe the audio
            transcription = self.transcribe_audio(segment_file)
            logger.info(f"Transcription: {transcription}")
            
            # Save transcription with timestamp for synchronization
            timestamp = os.path.basename(segment_file).split('_')[1].split('.')[0]  # Extract timestamp from filename
            transcription_file = os.path.join(self.transcription_dir, f"transcript_{timestamp}.csv")
            
            with open(transcription_file, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["transcription", "timestamp"])
                writer.writerow([transcription, datetime.now().strftime("%Y-%m-%d %H:%M:%S")])
            
            # Process audio for voice emotion
            try:
                from voice_emotion_prediction import analyze_audio
                analyze_audio(audio_path=segment_file)
                logger.info(f"Voice emotion analysis completed for {segment_file}")
            except Exception as e:
                logger.error(f"Error in voice emotion analysis: {e}")
            
            # Process transcription for text emotion
            if transcription and transcription not in ["[Silence]", "[Service unavailable]"]:
                try:
                    from text_emotion_prediction import predict_emotion_level
                    output_csv = os.path.join("result", "Text", "text_prediction.csv")
                    output_json = os.path.join("result", "Text", "text_prediction.json")
                    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
                    
                    predict_emotion_level(transcription_file, output_csv, output_json)
                    logger.info(f"Text emotion analysis completed for {transcription_file}")
                except Exception as e:
                    logger.error(f"Error in text emotion analysis: {e}")
            else:
                logger.info(f"Skipping text emotion analysis for empty/silent audio: {transcription}")
                
        except Exception as e:
            logger.error(f"Error processing audio segment {segment_file}: {e}")
