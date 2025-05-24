import tkinter as tk
import requests
import json
from concurrent.futures import ThreadPoolExecutor
import os

class ChattingPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#000D2E")
        
        self.executor = ThreadPoolExecutor(max_workers=5) 
        self.chat_sessions = {} 
        self.avg_emotions = None  # Cache for emotion scores

        self.emotion_map = {
            'anger': 'anger', 'Anger': 'anger',
            'fear': 'fear', 'Fear': 'fear',
            'happy': 'happy', 'Happy': 'happy', 'joy': 'happy',
            'neutral': 'neutral', 'Neutral': 'neutral',
            'sad': 'sad', 'Sad': 'sad', 'sadness': 'sad',
            'surprise': 'surprise', 'Surprise': 'surprise'
        }

        self.emotion_display_names = {
            'anger': 'Anger',
            'fear': 'Fear',
            'happy': 'Happiness',
            'neutral': 'Neutral',
            'sad': 'Sadness',
            'surprise': 'Surprise'
        }

        self.emotion_files = {
            "text": "./db/Text/text_emotion_data.json",
            "audio": "./db/Audio/audio_emotion_data.json",
            "video": "./db/FER/emotion_data.json"
        }

        title_label = tk.Label(self, text="Recommendations", font=("Helvetica", 30, "bold"), bg="#000D2E", fg="#F1F1F1")
        title_label.pack(pady=(40, 10), side=tk.TOP)

        # Placeholder for emotion averages label
        self.emotion_label = tk.Label(self, text="Emotion Averages: Loading...", font=("Helvetica", 16), bg="#000D2E", fg="#F1F1F1")
        self.emotion_label.pack(pady=(10, 10), side=tk.TOP)

        chat_frame = tk.Frame(self, bg="#000D2E")
        chat_frame.pack(expand=True, fill=tk.BOTH)

        self.scrollbar = tk.Scrollbar(chat_frame)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.chat_area = tk.Text(chat_frame, font=("Helvetica", 16), fg="white", bg="#000D2E", wrap=tk.WORD,
                                 yscrollcommand=self.scrollbar.set, height=20, padx=60, pady=30)
        self.chat_area.pack(expand=True, fill=tk.BOTH)
        self.chat_area.config(state=tk.DISABLED)  

        self.scrollbar.config(command=self.chat_area.yview)
        bottom_frame = tk.Frame(self, bg="#000D2E")
        bottom_frame.pack(side=tk.BOTTOM, fill=tk.X)

        self.message_text = tk.Entry(bottom_frame, font=("Helvetica", 20), width=40)
        self.message_text.pack(side=tk.LEFT, pady=10, padx=(420, 5))

        send_button = tk.Button(bottom_frame, text="Send", font=("Helvetica", 16), command=self.send_message, bg="green", fg="white")   
        send_button.pack(side=tk.LEFT, pady=10, padx=(5, 10))

        clear_button = tk.Button(bottom_frame, text="Clear Chat", font=("Helvetica", 16), command=self.clear_chat, bg="red", fg="white")
        clear_button.pack(side=tk.LEFT, pady=10, padx=(5, 10))

        # Start computing emotion scores and initializing prompt in separate threads
        self.executor.submit(self.load_and_display_emotions)
        self.executor.submit(self.initialize_prompt)

    def load_and_display_emotions(self):
        """Load and display emotion averages in a readable format."""
        self.avg_emotions = self.get_combined_emotion_scores()
        emotion_str = ", ".join([f"{self.emotion_display_names.get(emotion, emotion.capitalize())} = {score:.2f}" 
                                 for emotion, score in sorted(self.avg_emotions.items())]) if self.avg_emotions else "No emotion data available."
        self.emotion_label.config(text=f"Emotion Averages: {emotion_str}")

    def initialize_prompt(self):
        """Send an initial prompt to the model when the page loads."""
        session_token = self.get_session_token()
        self.update_chat_area("System", "Fetching recommendations...")
        # Wait for emotion scores if not yet available
        if self.avg_emotions is None:
            self.avg_emotions = self.get_combined_emotion_scores()
        default_message = "Provide recommendations based on my emotional state."
        self.executor.submit(self.get_recommendation, session_token, default_message, self.avg_emotions)

    def load_json_data(self, filename):
        if not os.path.exists(filename):
            print(f"File '{filename}' not found.")
            return {"error": f"File '{filename}' not found."}
        try:
            with open(filename, "r") as f:
                data = json.load(f)
                print(f"Loaded JSON data from {filename}: {data}")
                return data
        except json.JSONDecodeError:
            print(f"Invalid JSON format in {filename}")
            return {"error": "Invalid JSON format."}
        except Exception as e:
            print(f"Error loading JSON from {filename}: {str(e)}")
            return {"error": f"Error loading JSON: {str(e)}"}

    def compute_avg_emotion_scores(self, json_path, emotion_key):
        raw_data = self.load_json_data(json_path)
        if isinstance(raw_data, dict) and "error" in raw_data:
            print(f"Error in compute_avg_emotion_scores: {raw_data['error']}")
            return {}

        if not isinstance(raw_data, list):
            raw_data = [raw_data]

        combined = {}
        count = 0
        for record in raw_data:
            if not isinstance(record, dict):
                print(f"Skipping invalid record: {record}")
                continue
            scores = record.get(emotion_key, {})
            if not isinstance(scores, dict):
                print(f"Skipping invalid {emotion_key} in record: {scores}")
                continue
            for emotion, score in scores.items():
                normalized_emotion = self.emotion_map.get(emotion, emotion.lower())
                try:
                    score_val = float(score)
                except (ValueError, TypeError):
                    score_val = 0
                combined[normalized_emotion] = combined.get(normalized_emotion, 0) + score_val
            count += 1

        if count > 0:
            avg_scores = {emotion: val / count for emotion, val in combined.items()}
        else:
            avg_scores = {}
            print(f"No valid records found in {json_path}")
        return avg_scores

    def get_combined_emotion_scores(self):
        emotion_keys = {
            "text": "emotionScores",
            "audio": "emotion_scores",
            "video": "aggregated_emotions"
        }
        combined = {}
        source_count = 0

        for source, path in self.emotion_files.items():
            scores = self.compute_avg_emotion_scores(path, emotion_keys[source])
            if scores:
                source_count += 1
                for emotion, score in scores.items():
                    combined[emotion] = combined.get(emotion, 0) + score

        if source_count > 0:
            avg_scores = {emotion: val / source_count for emotion, val in combined.items()}
        else:
            avg_scores = {}
            print("No valid emotion data found across sources.")
        return avg_scores

    def send_message(self):
        message = self.message_text.get()
        if message:
            self.update_chat_area("You", message)  
            self.message_text.delete(0, tk.END)
            session_token = self.get_session_token()
            # Use cached emotion scores if available
            avg_emotions = self.avg_emotions if self.avg_emotions is not None else self.get_combined_emotion_scores()
            self.executor.submit(self.get_recommendation, session_token, message, avg_emotions)

    def get_session_token(self):
        return "chat_session_1"

    def get_recommendation(self, session_token, message, avg_emotions):
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": "Bearer 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", 
                "Content-Type": "application/json",
                "HTTP-Referer": "<YOUR_SITE_URL>", 
                "X-Title": "<YOUR_SITE_NAME>",
            }

            emotion_str = ", ".join([f"{self.emotion_display_names.get(emotion, emotion.capitalize())} = {score:.2f}" 
                                     for emotion, score in sorted(avg_emotions.items())]) if avg_emotions else "No emotion data available."
            prompt = (
                f"User message: '{message}'. "
                f"Emotional state: {emotion_str}. "
                "Provide specific recommendations for activities or strategies to address this emotional state."
            )

            payload = {
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
            }

            response = requests.post(url, headers=headers, data=json.dumps(payload))

            if response.status_code == 200:
                data = response.json()
                recommendation = data.get("choices", [{}])[0].get("message", {}).get("content", "Sorry, I couldn't process your request.")
                self.update_chat_area(session_token, recommendation)
            else:
                self.update_chat_area(session_token, f"Error: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"Error with OpenRouter API: {e}")
            self.update_chat_area(session_token, "Sorry, I couldn't process your request.")

    def update_chat_area(self, session_token, message):
        self.chat_area.config(state=tk.NORMAL)
        self.chat_area.insert(tk.END, f"{session_token}: {message}\n\n")
        self.chat_area.config(state=tk.DISABLED)
        self.chat_area.update_idletasks()  # Force UI update for faster rendering
        self.chat_area.yview(tk.END)

    def clear_chat(self):
        self.chat_area.config(state=tk.NORMAL) 
        self.chat_area.delete(1.0, tk.END)  
        self.chat_area.config(state=tk.DISABLED) 
        self.message_text.delete(0, tk.END)  

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1920x1080")
    root.title("Chatting with AI")
    root.config(bg="#2F3A4A")
    app = ChattingPage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()