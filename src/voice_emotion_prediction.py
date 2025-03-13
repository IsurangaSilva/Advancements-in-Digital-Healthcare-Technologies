import os
import json
import numpy as np
import pandas as pd
import librosa
import logging
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
from config import AUDIO_FILE, VOICE_MODEL_PATH, TEMP_VOICE_PREDICTION_RESULT_CSV
import tensorflow as tf

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('emotion_analysis.log'),
        logging.StreamHandler()
    ]
)

# Define emotion categories
CAT6 = ['fear', 'angry', 'neutral', 'happy', 'sad', 'surprise']

# Custom GetItem layer
class GetItem(Layer):
    def __init__(self, *args, index=None, **kwargs):
        super(GetItem, self).__init__(**kwargs)
        self.index = args[0] if args and isinstance(args[0], slice) else (index if index is not None else slice(None, None, None))
        logging.debug(f"Initialized GetItem with index: {self.index}")
    
    def call(self, inputs):
        if isinstance(self.index, slice):
            return inputs[:, self.index]
        elif isinstance(self.index, int):
            return inputs[:, self.index]
        elif isinstance(self.index, (list, tuple)):
            return tf.gather(inputs, self.index, axis=1)
        else:
            raise ValueError(f"Unsupported index type: {type(self.index)}")
    
    def get_config(self):
        config = super(GetItem, self).get_config()
        if isinstance(self.index, slice):
            config['index'] = (self.index.start, self.index.stop, self.index.step)
        else:
            config['index'] = self.index
        logging.debug(f"GetItem config saved: {config}")
        return config
    
    @classmethod
    def from_config(cls, config):
        logging.debug(f"Full config received: {config}")
        index = config.pop('index', None)
        if isinstance(index, (tuple, list)) and len(index) == 3:
            index = slice(*index)
        logging.debug(f"Loading GetItem with index: {index}")
        return cls(index=index, **config)

def load_emotion_model(model_path=VOICE_MODEL_PATH):
    """Loads the emotion analysis model from the specified path."""
    try:
        logging.info(f"Loading model from: {model_path}")
        model = load_model(model_path, custom_objects={'GetItem': GetItem})
        logging.info("Model loaded successfully")
        return model
    except Exception as e:
        logging.error(f"Error loading model: {e}")
        return None

def get_mfcc(audio_path):
    """Extracts MFCC features from the audio file."""
    try:
        y, sr = librosa.load(audio_path, sr=16000)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
        mfcc = np.mean(mfcc, axis=1)
        logging.debug("MFCC features extracted successfully")
        return mfcc
    except Exception as e:
        logging.error(f"Error extracting MFCC features: {e}")
        return None

def predict_emotion(model, audio_path):
    """Predicts the emotion from the audio file using the loaded model."""
    try:
        mfcc = get_mfcc(audio_path)
        if mfcc is None:
            return None, None

        mfcc = mfcc.reshape(1, 20, 1)
        predictions = model.predict(mfcc)[0]
        predicted_emotion = CAT6[np.argmax(predictions)]
        logging.debug(f"Emotion prediction completed: {predicted_emotion}")
        return predicted_emotion, predictions
    except Exception as e:
        logging.error(f"Error predicting emotion: {e}")
        return None, None

def save_results_to_csv(results, output_file=TEMP_VOICE_PREDICTION_RESULT_CSV):
    """Saves the emotion analysis results to a CSV file."""
    try:
        data = {
            "transcription": [""],
            "timestamp": [results["timestamp"]],
            "Prediction": [results["predicted_emotion"]],
            "Emotion Scores": [json.dumps(results["emotion_scores"])],
            "VADER Score": [0.0],
            "Polarity": [0.0],
            "Subjectivity": [0.0]
        }
        df = pd.DataFrame(data)
        
        if os.path.exists(output_file):
            df.to_csv(output_file, mode='a', header=False, index=False)
        else:
            df.to_csv(output_file, index=False)
            
        logging.info(f"Results appended to {output_file}")
    except Exception as e:
        logging.error(f"Error saving results to CSV: {e}")

def save_results_to_json(results, output_file="voice_prediction.json"):
    """Saves the emotion analysis results to a JSON file."""
    try:
        output_folder = "result/Audio"
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        output_file_path = os.path.join(output_folder, output_file)
        
        if os.path.exists(output_file_path):
            with open(output_file_path, "r") as f:
                existing_data = json.load(f)
        else:
            existing_data = []
            
        existing_data.append(results)
        
        with open(output_file_path, "w") as f:
            json.dump(existing_data, f, indent=4)
            
        logging.info(f"Results saved to {output_file_path}")
    except Exception as e:
        logging.error(f"Error saving results to JSON: {e}")

def analyze_audio(model, audio_path=AUDIO_FILE):
    """Analyzes the audio file for emotion and saves the results."""
    if not os.path.exists(audio_path):
        logging.error(f"Audio file not found at {audio_path}")
        return

    predicted_emotion, predictions = predict_emotion(model, audio_path)
    if predicted_emotion is None:
        logging.error("Failed to predict emotion")
        return

    timestamp = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    logging.info(f"Audio Analysis for: {audio_path}")
    logging.info(f"Predicted Emotion: {predicted_emotion}")
    logging.info("Emotion Scores:")
    for emotion, score in zip(CAT6, predictions):
        logging.info(f"  {emotion}: {score:.4f}")
    logging.info(f"Timestamp: {timestamp}")
    logging.info("-" * 50)

    results = {
        "timestamp": timestamp,
        "predicted_emotion": predicted_emotion,
        "emotion_scores": {emotion: float(score) for emotion, score in zip(CAT6, predictions)}
    }
    
    save_results_to_csv(results)
    save_results_to_json(results)

if __name__ == "__main__":
    model = load_emotion_model()
    if model is not None:
        analyze_audio(model)