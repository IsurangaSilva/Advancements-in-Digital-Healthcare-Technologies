import os
import pandas as pd
import json
import datetime
from config import TEXT_MODEL_PATH, TEMP_TRANSCRIPTION_FILE, TEMP_TEXT_PREDICTION_RESULT_CSV, TEMP_TEXT_PREDICTION_RESULT_JSON
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("text_prediction")

class TextualPrediction:
    def __init__(self):
        # Initialize output paths
        self.output_csv_path = TEMP_TEXT_PREDICTION_RESULT_CSV
        self.output_json_path = TEMP_TEXT_PREDICTION_RESULT_JSON
        
    def prediction(self, text):
        """Analyzes the transcribed text for emotions and saves the results."""
        try:
            logger.info("Starting text emotion analysis")
            
            # Basic validation
            if not text or not isinstance(text, str):
                logger.warning("Invalid or empty text input")
                return None
                
            # Create output directories if they don't exist
            os.makedirs(os.path.dirname(self.output_csv_path), exist_ok=True)
            os.makedirs(os.path.dirname(self.output_json_path), exist_ok=True)
            
            # Create a temporary CSV file with the transcribed text
            df = pd.DataFrame({
                "transcription": [text],
                "timestamp": [datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
            })

            # Save the DataFrame to a temporary CSV file
            os.makedirs(os.path.dirname(TEMP_TRANSCRIPTION_FILE), exist_ok=True)
            df.to_csv(TEMP_TRANSCRIPTION_FILE, index=False)
            logger.info(f"Saved transcription to {TEMP_TRANSCRIPTION_FILE}")

            # Simplified approach: Always use predict_emotion_level
            try:
                # Import here to avoid circular imports
                from text_emotion_prediction import predict_emotion_level
                
                # Call with default paths from config
                success = predict_emotion_level(
                    TEMP_TRANSCRIPTION_FILE, 
                    self.output_csv_path, 
                    self.output_json_path
                )
                
                if not success:
                    logger.warning("Prediction function returned failure status")
                    # Create a basic result
                    basic_result = [{
                        "transcription": text,
                        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "Prediction": "unknown (0.0)",
                        "VADER Score": 0.0,
                        "Polarity": 0.0,
                        "Subjectivity": 0.0,
                        "Emotion Scores": {}
                    }]
                    
                    # Save the basic result
                    with open(self.output_json_path, "w") as f:
                        json.dump(basic_result, f, indent=4)
                    return basic_result
            except Exception as e:
                logger.error(f"Error in prediction: {e}")
                # Create a fallback result
                fallback_result = [{
                    "transcription": text,
                    "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "Prediction": "error (0.0)",
                    "VADER Score": 0.0,
                    "Polarity": 0.0,
                    "Subjectivity": 0.0,
                    "Emotion Scores": {},
                    "error": str(e)
                }]
                
                # Save the fallback result
                with open(self.output_json_path, "w") as f:
                    json.dump(fallback_result, f, indent=4)
                return fallback_result

            # Notify the user that emotion analysis is complete
            logger.info("Emotion analysis completed. Results saved.")

            # Return the results
            try:
                with open(self.output_json_path, "r") as f:
                    results = json.load(f)
                    return results
            except Exception as e:
                logger.error(f"Error reading results: {e}")
                return None
        except Exception as e:
            logger.error(f"Error in text emotion prediction: {e}")
            return None

def predict_single_text_emotion(text):
    """
    Predict emotion from a single text input. This function is a bridge to 
    text_emotion_prediction.predict_text_emotion while providing fallback
    when the model is unavailable.
    
    Args:
        text (str): Text to analyze
        
    Returns:
        dict: Prediction results including emotion, scores, and sentiment analysis
    """
    try:
        # Import here to avoid circular imports
        from text_emotion_prediction import predict_text_emotion, analyze_sentiment_vader, analyze_emotional_tone
        
        # Try using the model-based prediction
        result = predict_text_emotion(text)
        if "error" not in result:
            return result
            
        # Fallback to basic sentiment analysis if model fails
        logger.warning("Model-based prediction failed, using fallback sentiment analysis")
        vader_score = analyze_sentiment_vader(text)
        polarity, subjectivity = analyze_emotional_tone(text)
        
        # Determine basic emotion from vader and polarity
        prediction = "neutral"
        if vader_score > 0.5:
            prediction = "joy"
        elif vader_score < -0.5:
            prediction = "sadness"
        elif vader_score < -0.2:
            prediction = "fear"
        elif vader_score > 0.2 and polarity > 0.3:
            prediction = "surprise"
        
        # Return basic results
        return {
            "prediction": prediction,
            "confidence": abs(vader_score),
            "emotion_scores": {
                "joy": max(0, vader_score) if vader_score > 0 else 0,
                "sadness": abs(min(0, vader_score)) if vader_score < 0 else 0,
                "fear": abs(min(0, vader_score * 0.5)) if vader_score < 0 else 0,
                "anger": abs(min(0, vader_score * 0.3)) if vader_score < 0 else 0,
                "surprise": max(0, polarity * 0.5) if polarity > 0 else 0,
                "neutral": 1 - abs(vader_score)
            },
            "vader_score": vader_score,
            "polarity": polarity,
            "subjectivity": subjectivity
        }
    except Exception as e:
        logger.error(f"Error in predict_single_text_emotion: {e}")
        return {
            "prediction": "error",
            "confidence": 0.0,
            "emotion_scores": {},
            "vader_score": 0.0,
            "polarity": 0.0,
            "subjectivity": 0.0,
            "error": str(e)
        }