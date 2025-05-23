"""
Module for loading the FER models separately from the background processor.
This supports the improved application startup sequence.
"""

import os
import torch
import logging
import sys
from .emotion_detector import EmotionDetector
from .facenet_pytorch import InceptionResnetV1

# Configure logging
logger = logging.getLogger("fer_model_loader")

def load_fer_models():
    """
    Load FER models (emotion detector and facenet) and return True if successful.
    This function is used during application startup to preload models.
    """
    try:
        # Get base directory for model loading
        BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        model_path = os.path.join(BASE_DIR, "models", "efficientnet_b2_emotion_model.pth")
        
        # Set device
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load the emotion detector model
        logger.info("Loading FER emotion detector model...")
        detector = EmotionDetector(model_path, device)
        
        # Load the facenet model
        logger.info("Loading FER facenet model...")
        facenet = InceptionResnetV1(pretrained="casia-webface").eval().to(device)
        
        # If we reach this point, both models loaded successfully
        logger.info("FER models loaded successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error loading FER models: {e}")
        return False
