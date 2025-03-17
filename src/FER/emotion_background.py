import cv2
import time
import threading
import os
import numpy as np
import torch
from scipy.spatial.distance import cosine
from PIL import Image
from .aggregator import EmotionAggregator
from .emotion_detector import EmotionDetector
from .facenet_pytorch import InceptionResnetV1
from .session_aggregator import SessionAggregator

class EmotionBackgroundProcessor:
    def __init__(self, status_update_callback, capture_interval=1.0):
        """
        status_update_callback: function(status: bool) to update dot indicator (True=working, False=not working)
        capture_interval: seconds between webcam frame captures
        """
        self.status_update_callback = status_update_callback
        self.capture_interval = capture_interval
        self.running = False

        # Initialize webcam capture
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise ValueError("Unable to open webcam for emotion detection.")

        # Load the emotion detector model.
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        model_path = os.path.join(BASE_DIR, "models", "efficientnet_b2_emotion_model.pth")
        self.detector = EmotionDetector(model_path)
        self.facenet = InceptionResnetV1(pretrained="casia-webface").eval().to(self.detector.device)

        # Initialize the aggregator (using 60-second windows as before)
        self.save_path = os.path.join(BASE_DIR, "db", "FER", "emotion_data.json")
        self.aggregator = EmotionAggregator(window_seconds=60, save_path=self.save_path)
        
        # Load reference embedding from file (if available); otherwise, use a dummy vector.
        ref_path = os.path.join(BASE_DIR, "db", "FER", "average_embedding.npy")
        if os.path.exists(ref_path):
            self.reference_embedding = np.load(ref_path)
        else:
            self.reference_embedding = np.zeros(512)
        self.similarity_threshold = 0.6

        # Initiate session aggregator in a separate daemon thread.
        self.session_aggregator = SessionAggregator(interval_seconds=300,
                                                    emotion_file=self.save_path)
        self.session_thread = threading.Thread(target=self.session_aggregator.run, daemon=True)
        self.session_thread.start()
        print("Session aggregator thread started.")

    def get_face_embedding(self, pil_image):
        try:
            img_cropped = self.detector.mtcnn(pil_image)
        except RuntimeError as e:
            if "torch.cat" in str(e):
                print("[EmotionBackgroundProcessor] MTCNN detection error:", e)
                return None
            else:
                raise e
        if img_cropped is None:
            return None
        if isinstance(img_cropped, list) and len(img_cropped) == 0:
            return None
        if img_cropped.ndim == 3:
            img_cropped = img_cropped.unsqueeze(0)
        img_cropped = img_cropped.to(self.detector.device)
        with torch.no_grad():
            embedding = self.facenet(img_cropped).detach().cpu().numpy().flatten()
        return embedding if embedding.shape[0] == 512 else None

    def process_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            self.status_update_callback(False)
            return
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
                if "Disgust" in emotion_dict and "Sad" in emotion_dict:
                    emotion_dict["Sad"] += emotion_dict["Disgust"]
                    del emotion_dict["Disgust"]
                self.aggregator.add_emotion(emotion_dict)
        self.status_update_callback(True)

    def run(self):
        self.running = True
        while self.running:
            self.process_frame()
            time.sleep(self.capture_interval)

    def stop(self):
        self.running = False
        if self.cap.isOpened():
            self.cap.release()
