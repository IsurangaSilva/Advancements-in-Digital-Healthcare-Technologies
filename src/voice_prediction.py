# voice_prediction.py
import os
import json
import time
import logging
import numpy as np
import pandas as pd
from voice_emotion_prediction import load_emotion_model, predict_emotion, save_results_to_json
from config import AUDIO_FILE, VOICE_MODEL_PATH, TEMP_VOICE_PREDICTION_RESULT_CSV, RATE, CHUNK, CHANNELS, FORMAT

# Setup logging
log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(log_dir, 'voice_prediction.log'), mode='a', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("VoicePrediction")

# Define emotion categories
CAT6 = ['fear', 'angry', 'neutral', 'happy', 'sad', 'surprise']

def save_results_to_csv(results, output_file=TEMP_VOICE_PREDICTION_RESULT_CSV):
    """
    Saves the emotion analysis results to a CSV file.
    """
    try:
        # Prepare the data for CSV
        data = {
            "transcription": [""],  # Empty transcription for voice analysis
            "timestamp": [results["timestamp"]],
            "Prediction": [results["predicted_emotion"]],
            "Emotion Scores": [json.dumps(results["emotion_scores"])],
            "VADER Score": [0.0],  # Not applicable for voice analysis
            "Polarity": [0.0],  # Not applicable for voice analysis
            "Subjectivity": [0.0]  # Not applicable for voice analysis
        }

        # Create a DataFrame
        df = pd.DataFrame(data)

        # Append to the existing CSV file
        if os.path.exists(output_file):
            df.to_csv(output_file, mode='a', header=False, index=False)
        else:
            df.to_csv(output_file, index=False)

        logger.info(f"Results appended to {output_file}")
    except Exception as e:
        logger.error(f"Error saving results to CSV: {e}")

def analyze_audio(model, audio_path=AUDIO_FILE):
    """
    Analyzes the audio file for emotion and saves the results.
    
    Even silent audio will be processed with a default "neutral" classification
    to ensure consistent data flow through the system.
    """
    if not os.path.exists(audio_path):
        logger.error(f"Audio file not found at {audio_path}")
        return

    # Check if the audio file is too small/silent (less than 1KB)
    if os.path.getsize(audio_path) < 1024:
        logger.info(f"Audio file {audio_path} appears to be silent or too short. Using default neutral emotion.")
        # Create default predictions for silent audio (neutral)
        predicted_emotion = "neutral"
        predictions = np.zeros(len(CAT6))
        predictions[CAT6.index("neutral")] = 1.0
    else:
        # Predict emotion from audio content
        predicted_emotion, predictions = predict_emotion(model, audio_path)
        if predicted_emotion is None:
            logger.warning("Failed to predict emotion, defaulting to neutral")
            predicted_emotion = "neutral"
            predictions = np.zeros(len(CAT6))
            predictions[CAT6.index("neutral")] = 1.0

    # Prepare results
    timestamp = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Log results
    logger.info(f"Audio Analysis for: {audio_path}")
    logger.info(f"Predicted Emotion: {predicted_emotion}")
    logger.info("Emotion Scores:")
    for emotion, score in zip(CAT6, predictions):
        logger.info(f"  {emotion}: {score:.4f}")
    logger.info(f"Timestamp: {timestamp}")
    logger.info("-" * 50)

    # Format results for saving
    results = {
        "timestamp": timestamp,
        "predicted_emotion": predicted_emotion,
        "emotion_scores": {emotion: float(score) for emotion, score in zip(CAT6, predictions)}
    }

    # Save results to CSV and JSON
    save_results_to_csv(results)
    save_results_to_json(results)
    
    return results

def run_continuous_analysis(interval=20):
    """
    Continuously analyze audio files at a specified interval (seconds).
    This is designed to work with the audio_handler.py which creates new
    audio files every 20 seconds.
    """
    logger.info(f"Starting continuous audio analysis at {interval} second intervals")
    
    # Load model once
    model = load_emotion_model()
    if not model:
        logger.error("Failed to load emotion model. Exiting continuous analysis.")
        return
    
    try:
        audio_dir = os.path.join("audios", "temp_audio")
        
        while True:
            # Find the most recent audio file
            files = [f for f in os.listdir(audio_dir) if f.endswith('.wav')]
            if files:
                # Sort files by modification time (newest first)
                files.sort(key=lambda x: os.path.getmtime(os.path.join(audio_dir, x)), reverse=True)
                latest_file = os.path.join(audio_dir, files[0])
                
                # Skip analysis if the file is too old (more than 2x interval)
                file_age = time.time() - os.path.getmtime(latest_file)
                if file_age < interval * 2:
                    logger.info(f"Analyzing recent audio file: {latest_file}")
                    analyze_audio(model, latest_file)
                else:
                    logger.info(f"No recent audio files found (latest is {file_age:.1f}s old)")
            else:
                logger.info("No audio files found in the temp directory")
                
            # Wait for the next interval
            time.sleep(interval)
    except KeyboardInterrupt:
        logger.info("Audio analysis stopped by user")
    except Exception as e:
        logger.error(f"Error in continuous audio analysis: {e}")

if __name__ == "__main__":
    # For one-time analysis of a specific file:
    # model = load_emotion_model()
    # if model:
    #     analyze_audio(model)
    
    # For continuous analysis
    run_continuous_analysis(interval=20)


# voice_prediction.py
# import os
# import json
# import pandas as pd
# from voice_emotion_prediction import load_emotion_model, predict_emotion
# from config import AUDIO_FILE, VOICE_MODEL_PATH, TEMP_VOICE_PREDICTION_RESULT_CSV

# def save_results_to_csv(results, output_file=TEMP_VOICE_PREDICTION_RESULT_CSV):
#     """
#     Saves the emotion analysis results to a CSV file.
#     """
#     try:
#         # Prepare the data for CSV
#         data = {
#             "transcription": [""],  # Empty transcription for voice analysis
#             "timestamp": [results["timestamp"]],
#             "Prediction": [results["predicted_emotion"]],
#             "Emotion Scores": [json.dumps(results["emotion_scores"])],
#             "VADER Score": [0.0],  # Not applicable for voice analysis
#             "Polarity": [0.0],  # Not applicable for voice analysis
#             "Subjectivity": [0.0]  # Not applicable for voice analysis
#         }

#         # Create a DataFrame
#         df = pd.DataFrame(data)

#         # Append to the existing CSV file
#         if os.path.exists(output_file):
#             df.to_csv(output_file, mode='a', header=False, index=False)
#         else:
#             df.to_csv(output_file, index=False)

#         print(f"Results appended to {output_file}")
#     except Exception as e:
#         print(f"Error saving results to CSV: {e}")

# def analyze_audio(model, audio_path=AUDIO_FILE):
#     """
#     Analyzes the audio file for emotion and saves the results.
#     """
#     if not os.path.exists(audio_path):
#         print(f"Error: Audio file not found at {audio_path}.")
#         return

#     # Predict emotion
#     predicted_emotion, predictions = predict_emotion(model, audio_path)
#     if predicted_emotion is None:
#         return

#     # Print results
#     print("\n--- Voice Emotion Analysis ---")
#     print(f"Predicted Emotion: {predicted_emotion}")
#     print("Emotion Scores:")
#     for emotion, score in zip(CAT6, predictions):
#         print(f"  {emotion}: {score:.4f}")

#     # Prepare results for saving
#     results = {
#         "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
#         "predicted_emotion": predicted_emotion,
#         "emotion_scores": {emotion: float(score) for emotion, score in zip(CAT6, predictions)}
#     }

#     # Save results to CSV
#     save_results_to_csv(results)

# if __name__ == "__main__":
#     # Load the emotion analysis model
#     model = load_emotion_model()

#     if model:
#         # Analyze the audio file
#         analyze_audio(model)