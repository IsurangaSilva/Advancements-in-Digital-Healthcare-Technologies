import tkinter as tk
import json
import os
from tkinter import font as tkfont, messagebox, filedialog
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk

class ReportPage(tk.Frame):
    def __init__(self, parent, controller, chat_history_path="chat_history.json"):
        super().__init__(parent, bg="#000D2E")
        self.chat_history_file = chat_history_path

        self.default_figsize = (0.5, 6)
        self.default_dpi = 100

        # Emotion key mapping for consistency
        self.emotion_map = {
            'anger': 'anger', 'Anger': 'anger',
            'fear': 'fear', 'Fear': 'fear',
            'happy': 'happy', 'Happy': 'happy', 'joy': 'happy',
            'neutral': 'neutral', 'Neutral': 'neutral',
            'sad': 'sad', 'Sad': 'sad', 'sadness': 'sad',
            'surprise': 'surprise', 'Surprise': 'surprise'
        }

        heading_font = tkfont.Font(family="Helvetica", size=25, weight="bold")
        label_font = tkfont.Font(family="Helvetica", size=8, weight="normal")

        header_frame = tk.Frame(self, bg="#000D2E")
        header_frame.pack(side="top", fill="x")
        
        heading_label = tk.Label(header_frame, text="Emotion Report", bg="#000D2E", fg="#F9FAFB", font=heading_font)
        heading_label.pack(pady=(20, 20), padx=(5, 50))

        container = tk.Frame(self, bg="#000D2E")
        container.pack(side="top", fill="both", expand=True)

        canvas = tk.Canvas(container, bg="#000D2E", highlightthickness=0, width=250, height=300)
        canvas.pack(side="left", fill="both", expand=True)

        v_scrollbar = tk.Scrollbar(container, orient="vertical", command=canvas.yview)
        v_scrollbar.pack(side="right", fill="y")
        canvas.configure(yscrollcommand=v_scrollbar.set)

        scrollable_frame = tk.Frame(canvas, bg="#000D2E")
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

        def on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")
        canvas.bind_all("<MouseWheel>", on_mousewheel)

        # Text-Based Emotion Chart
        text_frame = tk.Frame(scrollable_frame, bg="#1F2937", bd=2, relief=tk.GROOVE)
        text_frame.pack(fill="both", expand=True, padx=(220, 5), pady=5)
        
        fig_text, emotion_scores_text = self.create_emotion_chart(
            "./db/Text/text_emotion_data.json", 
            "Avg Text-Based Emotion",
            emotion_key="emotionScores"
        )
        canvas_text = FigureCanvasTkAgg(fig_text, master=text_frame)
        canvas_text.draw()
        canvas_text.get_tk_widget().pack(fill="both", expand=True)
        toolbar_text = NavigationToolbar2Tk(canvas_text, text_frame)
        toolbar_text.update()
        canvas_text.get_tk_widget().pack(fill="both", expand=True)
        text_label = tk.Label(
            text_frame,
            text="Avg Emotion Scores: " + str(emotion_scores_text),
            bg="#1F2937",
            fg="#E5E7EB",
            font=label_font
        )
        text_label.pack(side="bottom", pady=5)

        # Audio-Based Emotion Chart
        audio_frame = tk.Frame(scrollable_frame, bg="#1F2937", bd=2, relief=tk.GROOVE)
        audio_frame.pack(fill="both", expand=True, padx=(220, 5), pady=5)
        fig_audio, emotion_scores_audio = self.create_emotion_chart(
            "./db/Audio/audio_emotion_data.json", 
            "Avg Audio-Based Emotion",
            emotion_key="emotion_scores"
        )
        canvas_audio = FigureCanvasTkAgg(fig_audio, master=audio_frame)
        canvas_audio.draw()
        canvas_audio.get_tk_widget().pack(fill="both", expand=True)
        toolbar_audio = NavigationToolbar2Tk(canvas_audio, audio_frame)
        toolbar_audio.update()
        canvas_audio.get_tk_widget().pack(fill="both", expand=True)
        audio_label = tk.Label(
            audio_frame,
            text="Avg Emotion Scores: " + str(emotion_scores_audio),
            bg="#1F2937",
            fg="#E5E7EB",
            font=label_font
        )
        audio_label.pack(side="bottom", pady=5)

        # Video-Based Emotion Chart
        video_frame = tk.Frame(scrollable_frame, bg="#1F2937", bd=2, relief=tk.GROOVE)
        video_frame.pack(fill="both", expand=True, padx=(220, 5), pady=5)
        fig_video, emotion_scores_video = self.create_emotion_chart(
            "./db/FER/emotion_data.json", 
            "Avg Video-Based Emotion",
            emotion_key="aggregated_emotions"
        )
        canvas_video = FigureCanvasTkAgg(fig_video, master=video_frame)
        canvas_video.draw()
        canvas_video.get_tk_widget().pack(fill="both", expand=True)
        toolbar_video = NavigationToolbar2Tk(canvas_video, video_frame)
        toolbar_video.update()
        canvas_video.get_tk_widget().pack(fill="both", expand=True)
        video_label = tk.Label(
            video_frame,
            text="Avg Emotion Scores: " + str(emotion_scores_video),
            bg="#1F2937",
            fg="#E5E7EB",
            font=label_font
        )
        video_label.pack(side="bottom", pady=5)

    def load_json_data(self, filename):
        """Loads JSON data from a file, handling errors gracefully."""
        if not os.path.exists(filename):
            print(f"File '{filename}' not found.")
            return {"error": f"File '{filename}' not found."}
        try:
            with open(filename, "r") as f:
                data = json.load(f)
                print(f"Loaded JSON data from {filename}: {data}")  # Debug print
                return data
        except json.JSONDecodeError:
            print(f"Invalid JSON format in {filename}")
            return {"error": "Invalid JSON format."}
        except Exception as e:
            print(f"Error loading JSON from {filename}: {str(e)}")
            return {"error": f"Error loading JSON: {str(e)}"}

    def compute_avg_emotion_scores(self, json_path, emotion_key):
        """
        Computes the average emotion scores from a JSON file.
        Normalizes emotion keys using self.emotion_map.
        """
        raw_data = self.load_json_data(json_path)
        if isinstance(raw_data, dict) and "error" in raw_data:
            print(f"Error in compute_avg_emotion_scores: {raw_data['error']}")
            return {}

        # Ensure raw_data is a list for iteration
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
                # Normalize emotion key
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

    def create_emotion_chart(self, json_path, chart_title, emotion_key):
        """
        Creates a bar chart for average emotion scores from a JSON file.
        """
        avg_scores = self.compute_avg_emotion_scores(json_path, emotion_key)
        if not avg_scores:
            print(f"No data to plot for {chart_title}")
            fig, ax = plt.subplots(figsize=self.default_figsize, dpi=self.default_dpi)
            ax.set_title(chart_title + " (No Data)", fontsize=10)
            ax.set_xlabel("Emotions", fontsize=8)
            ax.set_ylabel("Avg Score", fontsize=8)
            ax.tick_params(axis='both', which='major', labelsize=8)
            return fig, {}

        emotions = list(avg_scores.keys())
        scores = []
        for emotion in emotions:
            try:
                scores.append(float(avg_scores[emotion]))
            except (ValueError, TypeError):
                scores.append(0)

        fig, ax = plt.subplots(figsize=self.default_figsize, dpi=self.default_dpi)
        ax.bar(emotions, scores)
        ax.set_title(chart_title, fontsize=10)
        ax.set_xlabel("Emotions", fontsize=8)
        ax.set_ylabel("Avg Score", fontsize=8)
        ax.tick_params(axis='both', which='major', labelsize=8)
        return fig, avg_scores