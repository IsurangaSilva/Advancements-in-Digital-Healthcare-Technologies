import os
import pandas as pd
import json
import datetime
from text_emotion_prediction import predict_emotion_level
from tensorflow.keras.models import load_model
from config import TEXT_MODEL_PATH,TEMP_TRANSCRIPTION_FILE,TEMP_TEXT_PREDICTION_RESULT_CSV,TEMP_TEXT_PREDICTION_RESULT_JSON

class TextualPrediction:
    def __init__(self):
        # Load the model and other required resources
        self.loaded_model = self.load_model()
        self.output_csv_path = TEMP_TEXT_PREDICTION_RESULT_CSV
        self.output_json_path = TEMP_TEXT_PREDICTION_RESULT_JSON

    def load_model(self):
        """Loads the pre-trained emotion detection model."""
        model_path = TEXT_MODEL_PATH
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        return load_model(model_path)

    def prediction(self, text):
        """Analyzes the transcribed text for emotions and saves the results."""
        try:
            # Create a temporary CSV file with the transcribed text
            df = pd.DataFrame({
                "transcription": [text],
                "timestamp": [datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            })

            # Save the DataFrame to a temporary CSV file
            temp_csv_path = TEMP_TRANSCRIPTION_FILE
            df.to_csv(temp_csv_path, index=False)

            # Analyze the text for emotions
            predict_emotion_level(temp_csv_path, self.loaded_model, self.output_csv_path,self.output_json_path)

            # Notify the user that emotion analysis is complete
            print("Emotion analysis completed. Results saved.")

            # Optionally, display the results
            with open(self.output_json_path, "r") as f:
                results = json.load(f)
                for result in results:
                    print(f"Emotion: {result['Prediction']}")
                    print(f"VADER Score: {result['VADER Score']}")
                    print(f"Polarity: {result['Polarity']}")
                    print(f"Subjectivity: {result['Subjectivity']}")
                    print("Emotion Scores:")
                    for emotion, score in result['Emotion Scores'].items():
                        print(f"  {emotion}: {score:.4f}")

        except Exception as e:
            print(f"Error analyzing emotions: {e}")