# voice_prediction.py
import os
import json
import pandas as pd
from voice_emotion_prediction import load_emotion_model, predict_emotion
from config import AUDIO_FILE, VOICE_MODEL_PATH, TEMP_VOICE_PREDICTION_RESULT_CSV

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

        print(f"Results appended to {output_file}")
    except Exception as e:
        print(f"Error saving results to CSV: {e}")

def analyze_audio(model, audio_path=AUDIO_FILE):
    """
    Analyzes the audio file for emotion and saves the results.
    """
    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}.")
        return

    # Predict emotion
    predicted_emotion, predictions = predict_emotion(model, audio_path)
    if predicted_emotion is None:
        return

    # Print results
    print("\n--- Voice Emotion Analysis ---")
    print(f"Predicted Emotion: {predicted_emotion}")
    print("Emotion Scores:")
    for emotion, score in zip(CAT6, predictions):
        print(f"  {emotion}: {score:.4f}")

    # Prepare results for saving
    results = {
        "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
        "predicted_emotion": predicted_emotion,
        "emotion_scores": {emotion: float(score) for emotion, score in zip(CAT6, predictions)}
    }

    # Save results to CSV
    save_results_to_csv(results)

if __name__ == "__main__":
    # Load the emotion analysis model
    model = load_emotion_model()

    if model:
        # Analyze the audio file
        analyze_audio(model)