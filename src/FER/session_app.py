import os
import cv2
import time
import numpy as np
import torch
import json
import tkinter as tk
from PIL import Image
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
from emotion_detector import EmotionDetector
from facenet_pytorch import InceptionResnetV1
from scipy.spatial.distance import cosine
from aggregator import EmotionAggregator

class SessionApp:
    def __init__(self, master, reference_embedding):
        self.master = master
        self.master.title("Background Processes")
        self.master.geometry("400x400")
        self.master.protocol("WM_DELETE_WINDOW", self.on_close)

        # Base directory computed relative to this file
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        self.BASE_DIR = BASE_DIR

        self.reference_embedding = reference_embedding

        # File path for minute-level data (session aggregation is now handled separately)
        self.emotion_data_path = os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        os.makedirs(os.path.dirname(self.emotion_data_path), exist_ok=True)

        # Initialize the aggregator for minute-level emotion aggregation.
        self.aggregator = EmotionAggregator(window_seconds=60, save_path=self.emotion_data_path)
        # Use the aggregator's callback only to print the minute data.
        self.aggregator.callback = self.minute_callback

        # Initialize video capture.
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise ValueError("Unable to open webcam.")

        # Load the emotion detection model.
        model_path = os.path.join(BASE_DIR, "models", "efficientnet_b2_emotion_model.pth")
        self.detector = EmotionDetector(model_path)

        # Initialize FaceNet for face embedding extraction.
        self.facenet = InceptionResnetV1(pretrained="casia-webface").eval().to(self.detector.device)

        self.similarity_threshold = 0.6
        self.delay = 1000  # update every 1 second
        self.dot_radius = 20
        self.system_status = False

        # Create UI dot indicator.
        self.canvas = tk.Canvas(master, bg="black")
        self.canvas.pack(fill="both", expand=True)

        # Start the update loop.
        self.update()

    def minute_callback(self, aggregated_emotion):
        """
        This callback is invoked by the aggregator every minute.
        It simply prints the aggregated values.
        (The aggregator is still writing data to emotion_data.json.)
        """
        print("=== Aggregated Emotion Confidence (Last Minute) ===")
        for label, value in aggregated_emotion.items():
            print(f"{label}: {value * 100:.2f}%")
        print("====================================================")

    def get_face_embedding(self, pil_image):
        try:
            img_cropped = self.detector.mtcnn(pil_image)
        except Exception as e:
            print("[ERROR] MTCNN detection error:", e)
            return None
        if img_cropped is None:
            return None
        if isinstance(img_cropped, list) and len(img_cropped) == 0:
            return None
        if hasattr(img_cropped, "shape") and img_cropped.shape[0] == 0:
            return None
        if img_cropped.ndim == 3:
            img_cropped = img_cropped.unsqueeze(0)
        img_cropped = img_cropped.to(self.detector.device)
        with torch.no_grad():
            embedding = self.facenet(img_cropped).detach().cpu().numpy().flatten()
        return embedding if embedding.shape[0] == 512 else None

    def update(self):
        ret, frame = self.cap.read()
        if not ret:
            self.system_status = False
        else:
            self.system_status = True
            results = self.detector.detect_and_predict(frame)
            if results:
                best_face = None
                best_similarity = 0
                for (box, emotion_dict) in results:
                    x1, y1, x2, y2 = box
                    face_roi = frame[y1:y2, x1:x2]
                    if face_roi.size != 0:
                        pil_face = Image.fromarray(cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB))
                        face_embedding = self.get_face_embedding(pil_face)
                        if face_embedding is not None:
                            similarity = 1 - cosine(face_embedding, self.reference_embedding)
                            if similarity > self.similarity_threshold and similarity > best_similarity:
                                best_face = (emotion_dict, similarity)
                                best_similarity = similarity
                if best_face:
                    emotion_dict, similarity = best_face
                    # Merge "Disgust" into "Sad" if needed.
                    if "Disgust" in emotion_dict and "Sad" in emotion_dict:
                        emotion_dict["Sad"] += emotion_dict["Disgust"]
                        del emotion_dict["Disgust"]
                    self.aggregator.add_emotion(emotion_dict)
        self.update_dot()
        self.master.after(self.delay, self.update)

    def update_dot(self):
        self.canvas.delete("all")
        width = self.canvas.winfo_width()
        height = self.canvas.winfo_height()
        center_x = width // 2
        center_y = height // 2
        dot_color = "green" if self.system_status else "red"
        r = self.dot_radius
        self.canvas.create_oval(center_x - r, center_y - r, center_x + r, center_y + r, fill=dot_color, outline=dot_color)

    def on_close(self):
        if self.cap.isOpened():
            self.cap.release()
        self.master.destroy()

if __name__ == "__main__":
    import numpy as np
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    ref_emb_path = os.path.join(BASE_DIR, "db", "FER", "average_embedding.npy")
    if not os.path.exists(ref_emb_path):
        raise ValueError("Reference embedding not found. Please run the capture process first.")
    reference_embedding = np.load(ref_emb_path)
    
    root = ttk.Window(themename="darkly")
    app = SessionApp(root, reference_embedding)
    root.mainloop()
