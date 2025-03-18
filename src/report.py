import tkinter as tk
import json
import os
from tkinter import font as tkfont, messagebox, filedialog
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk

class ReportPage(tk.Frame):
    def __init__(self, parent, controller, chat_history_path="./chat_history.json"):
        super().__init__(parent, bg="#000D2E")
        self.chat_history_file = chat_history_path 

       
        self.default_figsize = (0.5, 6)
        self.default_dpi = 100

        
        heading_font = tkfont.Font(family="Helvetica", size=25, weight="bold")
        label_font = tkfont.Font(family="Helvetica", size=8, weight="normal")

       
        header_frame = tk.Frame(self, bg="#000D2E")
        header_frame.pack(side="top", fill="x")
        
        
        heading_label = tk.Label(header_frame, text="Emotion Report", bg="#000D2E", fg="#F9FAFB", font=heading_font)
        heading_label.pack(pady=(20, 20),padx=(5,50))

        
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
            canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        canvas.bind_all("<MouseWheel>", on_mousewheel)

       
        text_frame = tk.Frame(scrollable_frame, bg="#1F2937", bd=2, relief=tk.GROOVE)
        text_frame.pack(fill="both", expand=True, padx=(220, 5), pady=5)
        fig_text, emotion_scores_text = self.create_emotion_chart(
            "./db/Text/temp_prediction.json", 
            "Text-Based Emotion"
        )
        canvas_text = FigureCanvasTkAgg(fig_text, master=text_frame)
        canvas_text.draw()
        canvas_text.get_tk_widget().pack(fill="both", expand=True)
        toolbar_text = NavigationToolbar2Tk(canvas_text, text_frame)
        toolbar_text.update()
        canvas_text.get_tk_widget().pack(fill="both", expand=True)
        text_label = tk.Label(
            text_frame,
            text="Emotion Scores: " + str(emotion_scores_text),
            bg="#1F2937",
            fg="#E5E7EB",
            font=label_font
        )
        text_label.pack(side="bottom", pady=5)

        # --- Average Voice-Based Emotion Chart ---
        avg_voice_frame = tk.Frame(scrollable_frame, bg="#1F2937", bd=2, relief=tk.GROOVE)
        avg_voice_frame.pack(fill="both", expand=True, padx=(220, 5), pady=5)
        fig_avg_voice, avg_emotion_scores = self.create_avg_emotion_chart(
            "./db/Audio/voice_prediction.json", 
            "Avg Voice-Based Emotion"
        )
        canvas_avg_voice = FigureCanvasTkAgg(fig_avg_voice, master=avg_voice_frame)
        canvas_avg_voice.draw()
        canvas_avg_voice.get_tk_widget().pack(fill="both", expand=True)
        toolbar_avg_voice = NavigationToolbar2Tk(canvas_avg_voice, avg_voice_frame)
        toolbar_avg_voice.update()
        canvas_avg_voice.get_tk_widget().pack(fill="both", expand=True)
        avg_voice_label = tk.Label(
            avg_voice_frame,
            text="Avg Emotion Scores: " + str(avg_emotion_scores),
            bg="#1F2937",
            fg="#E5E7EB",
            font=label_font
        )
        avg_voice_label.pack(side="bottom", pady=5)

    def load_json_data(self, filename):
        """Loads JSON data from a file, handling errors gracefully."""
        if not os.path.exists(filename):
            return {"error": f"File '{filename}' not found."}
        try:
            with open(filename, "r") as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {"error": "Invalid JSON format."}
        except Exception as e:
            return {"error": f"Error loading JSON: {str(e)}"}

    def create_emotion_chart(self, json_path, chart_title):
        """
        Loads emotion prediction data from a JSON file, creates a bar chart,
        and returns the figure along with a dictionary of emotion scores.
        Expected for text-based data: JSON contains an "Emotion Scores" key.
        """
        raw_data = self.load_json_data(json_path)
        if isinstance(raw_data, dict) and "data" in raw_data:
            raw_data = raw_data["data"]
        if isinstance(raw_data, list) and len(raw_data) > 0:
            raw_data = raw_data[0]

        emotion_data = {}
        if isinstance(raw_data, dict):
            if "Emotion Scores" in raw_data:
                emotion_data = raw_data["Emotion Scores"]
            else:
                emotion_data = raw_data
        else:
            emotion_data = {}

        emotions = list(emotion_data.keys())
        scores = []
        for value in emotion_data.values():
            try:
                scores.append(float(value))
            except (ValueError, TypeError):
                scores.append(0)

        fig, ax = plt.subplots(figsize=self.default_figsize, dpi=self.default_dpi)
        ax.bar(emotions, scores)
        ax.set_title(chart_title, fontsize=10)
        ax.set_xlabel("Emotions", fontsize=8)
        ax.set_ylabel("Score", fontsize=8)
        ax.tick_params(axis='both', which='major', labelsize=8)
        return fig, {k: v for k, v in zip(emotions, scores)}

    def compute_avg_emotion_scores(self, json_path):
        """
        Computes the average emotion scores from a JSON file containing voice prediction data.
        Averages are computed over all records if the JSON is a list.
        """
        raw_data = self.load_json_data(json_path)
        if isinstance(raw_data, dict) and "data" in raw_data:
            raw_data = raw_data["data"]
        if not isinstance(raw_data, list):
            raw_data = [raw_data]
        combined = {}
        count = 0
        for record in raw_data:
            if isinstance(record, dict):
                scores = {}
                if "emotion_scores" in record:
                    scores = record["emotion_scores"]
                elif "Emotion Scores" in record:
                    scores = record["Emotion Scores"]
                for emotion, score in scores.items():
                    try:
                        score_val = float(score)
                    except (ValueError, TypeError):
                        score_val = 0
                    combined[emotion] = combined.get(emotion, 0) + score_val
                count += 1
        if count > 0:
            avg_scores = {emotion: val / count for emotion, val in combined.items()}
        else:
            avg_scores = {}
        return avg_scores

    def create_avg_emotion_chart(self, json_path, chart_title):
        """
        Creates a bar chart for the average emotion scores from voice predictions.
        """
        avg_scores = self.compute_avg_emotion_scores(json_path)
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
