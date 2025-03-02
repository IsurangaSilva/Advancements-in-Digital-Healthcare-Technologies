# prediction.py
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
from config import TRAIN_TEXT_DATASET,TEST_TEXT_DATASET,VAL_TEXT_DATASET,TEXT_MODEL_PATH

# Download NLTK data
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

# Load datasets
train_file_path = TRAIN_TEXT_DATASET
test_file_path = TEST_TEXT_DATASET
val_file_path = VAL_TEXT_DATASET

# Safe read CSV function
def safe_read_csv(file_path):
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return pd.DataFrame()  # Return an empty dataframe in case of error

# Load the datasets
df_train = safe_read_csv(train_file_path)
df_test = safe_read_csv(test_file_path)
df_val = safe_read_csv(val_file_path)

# List of DataFrames to iterate through
datasets = [('Train Dataset', df_train), ('Test Dataset', df_test), ('Validation Dataset', df_val)]

# Text preprocessing function
def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z ]', '', text.lower())  # Remove non-alphabetic characters and lowercase
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
    return ' '.join(lemmatized_tokens)

# Sentiment Analysis (VADER)
def analyze_sentiment_vader(text):
    if not isinstance(text, str) or not text.strip():
        return None  # Handle non-text or empty inputs
    analyzer = SentimentIntensityAnalyzer()
    sentiment = analyzer.polarity_scores(text.strip().lower())  # Preprocessing
    return sentiment['compound']

# Emotional Tone (TextBlob)
def analyze_emotional_tone(text):
    if not isinstance(text, str) or not text.strip():
        return None, None  # Handle non-text or empty inputs
    blob = TextBlob(text.strip().lower())  # Preprocessing
    return blob.sentiment.polarity, blob.sentiment.subjectivity

# Filter dataset
df_train = df_train[df_train['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]
df_test = df_test[df_test['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]
df_val = df_val[df_val['Emotion'].isin(['sadness', 'anger', 'joy', 'fear', 'neutral', 'surprise'])]

# Ensure CSV files have 'Text' and 'Emotion' columns
if not {'Text', 'Emotion'}.issubset(df_train.columns):
    raise ValueError("CSV files must contain 'Text' and 'Emotion' columns.")

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

# # Custom prediction function for CSV
# def predict_emotion_level(file_path, model, output_csv_path, output_json_path):
#     """Predicts emotions from a CSV file containing transcriptions and saves the results."""
#     try:
#         # Load the CSV file
#         df = pd.read_csv(file_path, encoding='ISO-8859-1')

#         # Ensure the 'transcription' and 'timestamp' columns exist
#         if 'transcription' not in df.columns or 'timestamp' not in df.columns:
#             raise ValueError("The CSV file must contain both 'transcription' and 'timestamp' columns.")

#         # Initialize results
#         predictions = []
#         vader_scores = []
#         polarities = []
#         subjectivities = []
#         emotion_scores_list = []

#         # Iterate through each row in the CSV
#         for idx, (text, timestamp) in enumerate(zip(df['transcription'], df['timestamp'])):
#             # Preprocess text for the model
#             sentence_preprocessed = preprocess_text(text)
#             tokenized_sentence = tokenizer.texts_to_sequences([sentence_preprocessed])
#             padded_sentence = pad_sequences(tokenized_sentence, maxlen=256, truncating='pre')

#             # Model prediction
#             prediction = model.predict(padded_sentence)
#             result = le.inverse_transform([np.argmax(prediction)])[0]
#             proba = np.max(prediction)

#             # # Sentiment Analysis (VADER)
#             # vader_score = analyze_sentiment_vader(text)

#             # # Emotional Tone (TextBlob)
#             # polarity, subjectivity = analyze_emotional_tone(text)

#             # Emotion scores
#             emotion_scores = {emotion: prediction[0][i] for i, emotion in enumerate(le.classes_)}

#             # Collect results for the current row
#             predictions.append(f"{result} ({proba:.2f})")
#             # vader_scores.append(vader_score)
#             # polarities.append(polarity)
#             # subjectivities.append(subjectivity)
#             emotion_scores_list.append(emotion_scores)

#             # Log prediction result with timestamp
#             logging.info(f"Row {idx + 1}:")
#             logging.info(f"Text: {text}")
#             logging.info(f"Prediction: {result} ({proba:.2f})")
#             # logging.info(f"VADER Score: {vader_score}")
#             # logging.info(f"Polarity: {polarity}")
#             # logging.info(f"Subjectivity: {subjectivity}")
#             logging.info("Emotion Scores:")
#             for emotion, score in emotion_scores.items():
#                 logging.info(f"  {emotion}: {score:.4f}")
#             logging.info(f"Timestamp: {timestamp}")
#             logging.info("-" * 50)

#         # Add results to the DataFrame
#         df['Prediction'] = predictions
#         df['VADER Score'] = vader_scores
#         df['Polarity'] = polarities
#         df['Subjectivity'] = subjectivities
#         df['Emotion Scores'] = emotion_scores_list

#         # Save the updated DataFrame to a new CSV
#         df.to_csv(output_csv_path, index=False)
#         print(f"Results saved to {output_csv_path}")

#         # Save the results to a JSON file
#         df.to_json(output_json_path, orient='records', lines=True, indent=4)
#         print(f"Results saved to {output_json_path}")

#     except Exception as e:
#         print(f"Error predicting emotions: {e}")

import json
import pandas as pd
import numpy as np
import logging
from keras.preprocessing.sequence import pad_sequences

def predict_emotion_level(file_path, model, output_csv_path , output_json_path):
    """Predicts emotions from a CSV file containing transcriptions and saves the results."""
    try:
        # Load the CSV file
        df = pd.read_csv(file_path, encoding='ISO-8859-1')
        print("df",df)

        # Ensure the 'transcription' and 'timestamp' columns exist
        if 'transcription' not in df.columns or 'timestamp' not in df.columns:
            raise ValueError("The CSV file must contain both 'transcription' and 'timestamp' columns.")

        # Initialize results
        predictions = []
        vader_scores = []
        polarities = []
        subjectivities = []
        emotion_scores_list = []

        # Iterate through each row in the CSV
        for idx, (text, timestamp) in enumerate(zip(df['transcription'], df['timestamp'])):
            # Preprocess text for the model
            sentence_preprocessed = preprocess_text(text)
            tokenized_sentence = tokenizer.texts_to_sequences([sentence_preprocessed])
            padded_sentence = pad_sequences(tokenized_sentence, maxlen=256, truncating='pre')

            # Model prediction
            prediction = model.predict(padded_sentence)
            result = le.inverse_transform([np.argmax(prediction)])[0]
            proba = np.max(prediction)

            # Emotion scores
            emotion_scores = {emotion: prediction[0][i] for i, emotion in enumerate(le.classes_)}

            # # Sentiment Analysis (VADER)
            vader_score = analyze_sentiment_vader(text)

            # Emotional Tone (TextBlob)
            polarity, subjectivity = analyze_emotional_tone(text)

            vader_scores.append(vader_score)
            polarities.append(polarity)
            subjectivities.append(subjectivity)

            # Collect results for the current row
            predictions.append(f"{result} ({proba:.2f})")
            emotion_scores_list.append(emotion_scores)

            # Log prediction result with timestamp
            logging.info(f"Row {idx + 1}:")
            logging.info(f"Text: {text}")
            logging.info(f"Prediction: {result} ({proba:.2f})")
            logging.info("Emotion Scores:")
            for emotion, score in emotion_scores.items():
                logging.info(f"  {emotion}: {score:.4f}")
            logging.info(f"VADER Score: {vader_score}")
            logging.info(f"Polarity: {polarity}")
            logging.info(f"Subjectivity: {subjectivity}")    
            logging.info(f"Timestamp: {timestamp}")
            logging.info("-" * 50)

        # Add results to the DataFrame
        df['Prediction'] = predictions
        df['Emotion Scores'] = emotion_scores_list
        df['VADER Score'] = vader_scores
        df['Polarity'] = polarities
        df['Subjectivity'] = subjectivities

        # Save the updated DataFrame to a new CSV
        df.to_csv(output_csv_path, index=False)
        print(f"Results saved to {output_csv_path}")

        # # Create a new JSON file and save the results
        df.to_json(output_json_path, orient='records', lines=True, indent=4)
        print(f"Results saved to {output_json_path}")

    except Exception as e:
        print(f"Error predicting emotions: {e}")