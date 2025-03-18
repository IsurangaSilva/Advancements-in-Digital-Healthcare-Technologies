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
from datetime import datetime

# Define emotion categories
CAT6 = ['fear', 'angry', 'neutral', 'happy', 'sad', 'surprise']

# Custom GetItem layer (unchanged)
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

# Other functions remain unchanged
def load_emotion_model(model_path=VOICE_MODEL_PATH):
    try:
        logging.info(f"Loading model from: {model_path}")
        model = load_model(model_path, custom_objects={'GetItem': GetItem})
        logging.info("Model loaded successfully")
        return model
    except Exception as e:
        logging.error(f"Error loading model: {e}")
        return None

def get_mfcc(audio_path):
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
    try:
        data = {
            "timestamp": [results["timestamp"]],
            "Prediction": [results["predicted_emotion"]],
            "Emotion Scores": [json.dumps(results["emotion_scores"])]
        }
        df = pd.DataFrame(data)
        if os.path.exists(output_file):
            df.to_csv(output_file, mode='a', header=False, index=False)
        else:
            df.to_csv(output_file, index=False)
        logging.info(f"Results appended to {output_file}")
    except Exception as e:
        logging.error(f"Error saving results to CSV: {e}")

# Modified save_results_to_json function
def save_results_to_json(results, output_file='db/Audio/voice_prediction.json'):
    
    """Saves the emotion analysis results to a JSON file in db/Audio directory with 10 decimal precision."""
    try:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        formatted_results = {
            **results, "session_aggregate": False
        }
        existing_data = []
        if os.path.exists(output_file):
            with open(output_file, "r") as f:
                existing_data = json.load(f)
        existing_data.append(formatted_results)
        with open(output_file, "w") as f:
            json.dump(existing_data, f, indent=4)
        logging.info(f"Results saved to JSON: {output_file}")
    except Exception as e:
        logging.error(f"Error saving to JSON: {e}")

def analyze_audio(model, audio_path=AUDIO_FILE):
    if not os.path.exists(audio_path):
        logging.error(f"Audio file not found at {audio_path}")
        return
    predicted_emotion, predictions = predict_emotion(model, audio_path)
    if predicted_emotion is None:
        logging.error("Failed to predict emotion")
        return
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    logging.info(f"Audio Analysis for: {audio_path}")
    logging.info(f"Predicted Emotion: {predicted_emotion}")
    logging.info("Emotion Scores:")
    for emotion, score in zip(CAT6, predictions):
        logging.info(f"  {emotion}: {score:.10f}")
    logging.info(f"Timestamp: {timestamp}")
    results = {
        "timestamp": timestamp,
        "predicted_emotion": predicted_emotion,
        "emotion_scores": { emotion: float(f"{score:.10f}") for emotion, score in zip(CAT6, predictions)}

        # "emotion_scores": {emotion: float(score) for emotion, score in zip(CAT6, predictions)}
    }
    save_results_to_csv(results)
    save_results_to_json(results)


if __name__ == "__main__":
    model = load_emotion_model()
    if model is not None:
        analyze_audio(model)

