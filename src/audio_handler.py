import csv
import os
import pyaudio
import wave
import speech_recognition as sr 
import numpy as np
from config import AUDIO_FILE, RATE, CHUNK, FORMAT, CHANNELS ,TRANSCRIPTION_FILE
import time

class AudioHandler:
    def __init__(self):
        self.is_recording = False
        self.recognizer = sr.Recognizer() 
        self.csv_file = TRANSCRIPTION_FILE
        self.silence_threshold = 500  
        self.silence_duration = 5  
        self.frames = []
        self.silence_counter = 0

    def record_audio(self):
        """Records audio at 16kHz, 16-bit Mono and saves it as a WAV file."""
        mic = pyaudio.PyAudio()
        try:
            stream = mic.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
            frames = []
            start_time = time.time()
            while self.is_recording:                
                data = stream.read(CHUNK, exception_on_overflow=False)
                frames.append(data)

                if time.time() - start_time >= 5:
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
                audio = self.recognizer.record(source)  
                text = self.recognizer.recognize_google(audio)  
                print("Transcription successful.",text)

                # Save the transcription to the CSV file
                self.save_transcription_to_csv(text)
                return text.strip()
        except sr.UnknownValueError:
            print("Google Speech Recognition could not understand the audio.")
            return "Error: Could not understand the audio."
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
            return f"Error: Could not request results from Google Speech Recognition service."
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