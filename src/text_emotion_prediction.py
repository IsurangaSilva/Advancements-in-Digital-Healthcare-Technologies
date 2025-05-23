from datetime import datetime
import time
import logging
import pandas as pd
import json
import re
import numpy as np
from sklearn.preprocessing import LabelEncoder
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
import os
import sys
from config import TRAIN_TEXT_DATASET, TEST_TEXT_DATASET, VAL_TEXT_DATASET, TEXT_MODEL_PATH, TEMP_TEXT_PREDICTION_RESULT_CSV, TEMP_TEXT_PREDICTION_RESULT_JSON 
import json
import logging
from db_connection import MongoDBConnection  # Import the MongoDB connection
from model_manager import ModelManager  # Import the model manager

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(os.path.join("logs", "text_prediction.log"), mode='a'),
                              logging.StreamHandler()])
logger = logging.getLogger("TextPrediction")

# MongoDB connection (singleton)
mongo_connection = MongoDBConnection()
collection = mongo_connection.get_collection("text-emotion-predictions")

# Model manager instance
model_manager = ModelManager()

# Download NLTK data
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

# Load datasets
train_file_path = TRAIN_TEXT_DATASET
test_file_path = TEST_TEXT_DATASET
val_file_path = VAL_TEXT_DATASET

# Safe read CSV function with proper error handling
def safe_read_csv(file_path):
    try:
        if not os.path.exists(file_path):
            logger.warning(f"Dataset file not found: {file_path}")
            return pd.DataFrame()
        
        df = pd.read_csv(file_path)
        logger.info(f"Successfully loaded dataset from {file_path}")
        
        # Check for required columns
        if not {'Text', 'Emotion'}.issubset(df.columns):
            logger.warning(f"Dataset at {file_path} is missing required 'Text' and/or 'Emotion' columns")
            # Create empty columns if they don't exist
            for col in ['Text', 'Emotion']:
                if col not in df.columns:
                    df[col] = np.nan
                    
        return df
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        # Return empty DataFrame with required columns
        return pd.DataFrame(columns=['Text', 'Emotion'])

# Load the datasets
logger.info("Loading text emotion datasets")
df_train = safe_read_csv(train_file_path)
df_test = safe_read_csv(test_file_path)
df_val = safe_read_csv(val_file_path)

# List of DataFrames to iterate through
datasets = [('Train Dataset', df_train), ('Test Dataset', df_test), ('Validation Dataset', df_val)]

# Text preprocessing function
def preprocess_text(text):
    if not isinstance(text, str) or not text.strip():
        return ""  # Return empty string for non-string or empty inputs
    
    try:
        text = re.sub(r'[^a-zA-Z ]', '', text.lower())  # Remove non-alphabetic characters and lowercase
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [word for word in tokens if word not in stop_words]
        lemmatizer = WordNetLemmatizer()
        lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
        return ' '.join(lemmatized_tokens)
    except Exception as e:
        logger.error(f"Error preprocessing text: {e}")
        return ""  # Return empty string on error

# Sentiment Analysis (VADER)
def analyze_sentiment_vader(text):
    if not isinstance(text, str) or not text.strip():
        return 0.0  # Return neutral sentiment on invalid input
    
    try:
        analyzer = SentimentIntensityAnalyzer()
        sentiment = analyzer.polarity_scores(text.strip().lower())  
        return sentiment['compound']
    except Exception as e:
        logger.error(f"Error analyzing sentiment with VADER: {e}")
        return 0.0  # Return neutral sentiment on error

# Emotional Tone (TextBlob)
def analyze_emotional_tone(text):
    if not isinstance(text, str) or not text.strip():
        return 0.0, 0.0  # Return neutral polarity and subjectivity
    
    try:
        blob = TextBlob(text.strip().lower())  
        return blob.sentiment.polarity, blob.sentiment.subjectivity
    except Exception as e:
        logger.error(f"Error analyzing emotional tone with TextBlob: {e}")
        return 0.0, 0.0  # Return neutral values on error

# Print dataset statistics
logger.info(f"Train dataset: {len(df_train)} records")
logger.info(f"Test dataset: {len(df_test)} records")
logger.info(f"Validation dataset: {len(df_val)} records")

# Filter dataset if dataframes are not empty and contain 'Emotion' column
if not df_train.empty and 'Emotion' in df_train.columns:
    df_train = df_train[df_train['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]
if not df_test.empty and 'Emotion' in df_test.columns:
    df_test = df_test[df_test['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]
if not df_val.empty and 'Emotion' in df_val.columns:
    df_val = df_val[df_val['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]

# Global variables for model-related objects
tokenizer = None
label_encoder = None
model = None
max_length = 100  # Default value, will be updated during initialization

# Initialize model, tokenizer, and label encoder
def initialize_model():
    global tokenizer, label_encoder, model, max_length
    
    try:
        logger.info("Initializing text emotion prediction model")
        
        # Check if model is already loaded via ModelManager
        if model_manager.has_model("text_emotion"):
            logger.info("Using cached text emotion model from ModelManager")
            model_data = model_manager.get_model("text_emotion")
            if model_data and "model" in model_data:
                model = model_data["model"]
                tokenizer = model_data.get("tokenizer")
                label_encoder = model_data.get("label_encoder")
                max_length = model_data.get("max_length", 100)
                return True
        
        # Check if datasets are valid and model file exists
        if df_train.empty or df_test.empty or df_val.empty:
            logger.warning("One or more datasets are empty. Model initialization skipped.")
            return False
            
        if not os.path.exists(TEXT_MODEL_PATH):
            logger.error(f"Model file not found: {TEXT_MODEL_PATH}")
            return False

        # Convert text data to sequences
        texts = []
        for dataset_name, dataset in datasets:
            if not dataset.empty and 'Text' in dataset.columns:
                preprocessed_texts = [preprocess_text(text) for text in dataset['Text'] if isinstance(text, str)]
                texts.extend(preprocessed_texts)
        
        if not texts:
            logger.warning("No valid texts found in datasets. Model initialization skipped.")
            return False
            
        # Initialize tokenizer
        tokenizer = Tokenizer()
        tokenizer.fit_on_texts(texts)
        
        # Get unique emotions
        unique_emotions = []
        for dataset_name, dataset in datasets:
            if not dataset.empty and 'Emotion' in dataset.columns:
                unique_emotions.extend(dataset['Emotion'].unique())
        
        # Initialize label encoder
        label_encoder = LabelEncoder()
        label_encoder.fit(unique_emotions)
        
        # Set max_length
        max_length = max(len(text.split()) for text in texts) if texts else 100
        
        # Load the model
        try:
            model = load_model(TEXT_MODEL_PATH)
            logger.info(f"Successfully loaded model from {TEXT_MODEL_PATH}")
            
            # Cache the model in ModelManager
            model_manager.add_model("text_emotion", {
                "model": model,
                "tokenizer": tokenizer,
                "label_encoder": label_encoder,
                "max_length": max_length
            })
            
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False
            
    except Exception as e:
        logger.error(f"Error initializing model: {e}")
        return False
        
        # Check if we have valid datasets
        if df_train.empty or 'Text' not in df_train.columns or 'Emotion' not in df_train.columns:
            logger.warning("Cannot initialize model: training dataset is empty or missing required columns")
            return False
            
        # Prepare label encoder
        label_encoder = LabelEncoder()
        if not df_train.empty and 'Emotion' in df_train.columns:
            label_encoder.fit(df_train['Emotion'].values)
            
        # Prepare tokenizer
        tokenizer = Tokenizer()
        if not df_train.empty and 'Text' in df_train.columns:
            # Filter out rows with empty text
            valid_texts = df_train['Text'].dropna().astype(str)
            if not valid_texts.empty:
                tokenizer.fit_on_texts(valid_texts)
                
        # Determine max sequence length
        if not df_train.empty and 'Text' in df_train.columns:
            train_sequences = tokenizer.texts_to_sequences(df_train['Text'].fillna('').astype(str))
            max_length = max(len(seq) for seq in train_sequences)
            if max_length == 0:  # Fallback if all sequences are empty
                max_length = 100
                
        # Load the model using ModelManager
        model = model_manager.get_model('text', TEXT_MODEL_PATH)
        if model is None:
            logger.error("Failed to load text emotion prediction model")
            return False
            
        logger.info("Text emotion prediction model initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error initializing text emotion prediction model: {e}")
        return False

# Apply preprocessing
X_train = df_train['Text'].apply(preprocess_text)
y_train = df_train['Emotion']

X_test = df_test['Text'].apply(preprocess_text)
y_test = df_test['Emotion']

X_val = df_val['Text'].apply(preprocess_text)
y_val = df_val['Emotion']

# Encoding labels
le = LabelEncoder()
y_train = le.fit_transform(y_train)
y_test = le.transform(y_test)
y_val = le.transform(y_val)

y_train = to_categorical(y_train)
y_test = to_categorical(y_test)
y_val = to_categorical(y_val)

# Tokenization
tokenizer = Tokenizer()
tokenizer.fit_on_texts(pd.concat([X_train, X_test], axis=0))

sequences_train = tokenizer.texts_to_sequences(X_train)
sequences_test = tokenizer.texts_to_sequences(X_test)
sequences_val = tokenizer.texts_to_sequences(X_val)

X_train = pad_sequences(sequences_train, maxlen=256, truncating='pre')
X_test = pad_sequences(sequences_test, maxlen=256, truncating='pre')
X_val = pad_sequences(sequences_val, maxlen=256, truncating='pre')

# Load the saved model
# loaded_model = load_model('IT20629144_TextBased_03.keras')
# loaded_model = load_model(TEXT_MODEL_PATH)
# print("Model loaded successfully.")

# Configure Logging
LOG_FOLDER = "logs"
if not os.path.exists(LOG_FOLDER):
    os.makedirs(LOG_FOLDER)

logging.basicConfig(
    level=logging.DEBUG,  # Use DEBUG for detailed logs
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(LOG_FOLDER, 'logs.log'), mode='w'),  # Save to file
        logging.StreamHandler(sys.stdout)  # Show in terminal
    ]
)

def predict_emotion_level(file_path, output_csv_path, output_json_path):
    """Predicts emotions from a CSV file containing transcriptions and saves the results."""
    global model, tokenizer, label_encoder, max_length
    
    try:
        logger.info(f"Starting emotion prediction for file: {file_path}")
        
        # Ensure model is initialized
        if model is None:
            success = initialize_model()
            if not success:
                logger.error("Failed to initialize text emotion prediction model")
                return False
        
        # Ensure output directories exist
        os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
        os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
        
        # Load the CSV file with proper error handling
        try:
            if not os.path.exists(file_path):
                logger.error(f"Transcription file not found: {file_path}")
                return False
                
            df = pd.read_csv(file_path, encoding='ISO-8859-1')
            logger.info(f"Loaded transcription file with {len(df)} entries")
            
        except Exception as e:
            logger.error(f"Error reading transcription file {file_path}: {e}")
            return False

        # Ensure the 'transcription' and 'timestamp' columns exist
        if 'transcription' not in df.columns or 'timestamp' not in df.columns:
            logger.warning("The CSV file is missing required columns. Creating default columns.")
            # Create columns if they don't exist
            if 'transcription' not in df.columns:
                df['transcription'] = ""
            if 'timestamp' not in df.columns:
                df['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Initialize results
        predictions = []
        vader_scores = []
        polarities = []
        subjectivities = []
        emotion_scores_list = []

        # Iterate through each row in the CSV
        for idx, row in df.iterrows():
            try:
                # Safely extract text and timestamp
                text = str(row.get('transcription', "")) if pd.notna(row.get('transcription', "")) else ""
                timestamp = row.get('timestamp', datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                  # Handle empty or silence indicator texts
                if not text.strip() or text.strip() in ["[Silence]", "[No speech detected]", "[Service unavailable]"]:
                    logger.info(f"Processing silence/empty text at row {idx+1}: '{text}'")
                    # For silence, we'll use neutral emotion with zero confidence
                    predictions.append("neutral (0.00)")
                    vader_scores.append(0.0)
                    polarities.append(0.0)
                    subjectivities.append(0.0)
                    # Create neutral-biased emotion scores for silent segments
                    default_scores = {emotion: 0.0 for emotion in label_encoder.classes_}
                    if "neutral" in label_encoder.classes_:
                        default_scores["neutral"] = 1.0
                    emotion_scores_list.append(default_scores)
                    continue
                
                # Preprocess text for the model
                sentence_preprocessed = preprocess_text(text)
                tokenized_sentence = tokenizer.texts_to_sequences([sentence_preprocessed])
                padded_sentence = pad_sequences(tokenized_sentence, maxlen=max_length, truncating='pre')                # Model prediction with error handling
                try:
                    prediction = model.predict(padded_sentence, verbose=0)
                    result = label_encoder.inverse_transform([np.argmax(prediction)])[0]
                    proba = np.max(prediction)
                except Exception as e:
                    logger.error(f"Error during model prediction: {e}")
                    result = "unknown"
                    proba = 0.0
                    prediction = np.zeros((1, len(label_encoder.classes_)))
                  # Emotion scores
                prediction_array = np.array(prediction[0])
                emotion_scores = {emotion: float(prediction_array[i]) for i, emotion in enumerate(label_encoder.classes_)}

                # Sentiment Analysis (VADER)
                vader_score = analyze_sentiment_vader(text)

                # Emotional Tone (TextBlob)
                polarity, subjectivity = analyze_emotional_tone(text)

                # Collect results
                vader_scores.append(vader_score)
                polarities.append(polarity)
                subjectivities.append(subjectivity)
                predictions.append(f"{result} ({proba:.2f})")
                emotion_scores_list.append(emotion_scores)

                # Current timestamp for the record
                timestampnew = datetime.now()

                # Create a document for JSON output
                document = {
                    "transcription": text,
                    "timestamp": timestampnew.strftime("%Y-%m-%d %H:%M:%S"),
                    "prediction": result,
                    "prediction_score": f"{proba:.2f}",
                    "emotionScores": emotion_scores,
                    "vaderScore": vader_score,
                    "polarity": polarity,
                    "subjectivity": subjectivity,
                }

                # Save to JSON file
                save_results_to_json(document)

                # Create a document for MongoDB
                document_db = {
                    "transcription": text,
                    "timestamp": timestampnew,
                    "prediction": result,
                    "prediction_score": f"{proba:.2f}",
                    "emotionScores": emotion_scores,
                    "vaderScore": vader_score,
                    "polarity": polarity,
                    "subjectivity": subjectivity,
                }

                # Insert into MongoDB with error handling
                try:
                    collection.insert_one(document_db)
                    logger.info(f"Inserted document for row {idx + 1} into MongoDB")
                except Exception as e:
                    logger.error(f"Error inserting into MongoDB: {e}")

                # Log prediction result
                logger.info(f"Row {idx + 1}: Prediction: {result} ({proba:.2f})")
                
            except Exception as e:
                logger.error(f"Error processing row {idx+1}: {e}")
                predictions.append("error (0.00)")
                vader_scores.append(0.0)
                polarities.append(0.0)
                subjectivities.append(0.0)
                emotion_scores_list.append({})

        # Add results to the DataFrame with error handling
        try:
            # Ensure DataFrame and result lists have the same length
            if len(df) == len(predictions):
                df['Prediction'] = predictions
                df['VADER Score'] = vader_scores
                df['Polarity'] = polarities
                df['Subjectivity'] = subjectivities
                
                # Save the updated DataFrame to CSV and JSON
                df.to_csv(output_csv_path, index=False)
                logger.info(f"Results saved to CSV: {output_csv_path}")
                
                # Convert emotion scores to string format for JSON serialization
                df['Emotion Scores'] = [json.dumps(scores) for scores in emotion_scores_list]
                df.to_json(output_json_path, orient='records', lines=True)
                logger.info(f"Results saved to JSON: {output_json_path}")
                
                return True
            else:
                logger.error(f"DataFrame length ({len(df)}) doesn't match results length ({len(predictions)})")
                return False
                
        except Exception as e:
            logger.error(f"Error saving results: {e}")
            return False

    except Exception as e:
        logger.error(f"Error in predict_emotion_level: {e}")
        return False

    except Exception as e:
        print(f"Error predicting emotions: {e}")


def save_results_to_json(document, output_file="text_emotion_data.json"):
    """Saves the emotion analysis results to a JSON file."""
    try:
        output_folder = os.path.join("db", "Text")
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        output_file_path = os.path.join(output_folder, output_file)
        
        if os.path.exists(output_file_path):
            try:
                with open(output_file_path, "r") as f:
                    existing_data = json.load(f)
            except json.JSONDecodeError:
                logger.warning(f"JSON file {output_file_path} is corrupted. Creating new file.")
                existing_data = []
        else:
            existing_data = []
            
        document_with_session_aggregate = {**document, "session_aggregate": False}
        existing_data.append(document_with_session_aggregate)
        
        with open(output_file_path, "w") as f:
            json.dump(existing_data, f, indent=4)
            
        logger.info(f"Results saved to {output_file_path}")
    except Exception as e:
        logger.error(f"Error saving results to JSON: {e}")

def predict_text_emotion(text):
    """
    Predict emotion from a single text input
    
    Args:
        text (str): Text to analyze
        
    Returns:
        dict: Prediction results including emotion, scores, and sentiment analysis
    """
    global model, tokenizer, label_encoder, max_length
    
    try:
        # Ensure model is initialized
        if model is None:
            success = initialize_model()
            if not success:
                logger.error("Failed to initialize text emotion prediction model")
                return {"error": "Model initialization failed"}
        
        # Preprocess text
        preprocessed_text = preprocess_text(text)
        if not preprocessed_text:
            logger.warning("Empty text after preprocessing")
            return {
                "prediction": "unknown",
                "confidence": 0.0,
                "emotion_scores": {},
                "vader_score": 0.0,
                "polarity": 0.0,
                "subjectivity": 0.0
            }
        
        # Tokenize and pad sequence
        tokenized_text = tokenizer.texts_to_sequences([preprocessed_text])
        padded_text = pad_sequences(tokenized_text, maxlen=max_length, truncating='pre')
        
        # Model prediction
        prediction = model.predict(padded_text, verbose=0)
        result = label_encoder.inverse_transform([np.argmax(prediction)])[0]
        confidence = float(np.max(prediction))
        
        # Emotion scores
        prediction_array = np.array(prediction[0])
        emotion_scores = {emotion: float(prediction_array[i]) for i, emotion in enumerate(label_encoder.classes_)}
        
        # Sentiment analysis
        vader_score = analyze_sentiment_vader(text)
        polarity, subjectivity = analyze_emotional_tone(text)
        
        # Return results
        return {
            "prediction": result,
            "confidence": confidence,
            "emotion_scores": emotion_scores,
            "vader_score": vader_score,
            "polarity": polarity,
            "subjectivity": subjectivity
        }
        
    except Exception as e:
        logger.error(f"Error predicting emotion from text: {e}")
        return {"error": str(e)}
    except Exception as e:
        logging.error(f"Error saving results to JSON: {e}")
