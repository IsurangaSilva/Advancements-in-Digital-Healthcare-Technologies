"""
Model Manager for efficient model loading and caching.
Implements singleton pattern to ensure models are only loaded once.
"""
import logging
import os
from tensorflow.keras.models import load_model
import torch
from llama_cpp import Llama

# Configure logging
# Configure absolute path to logs directory
current_dir = os.path.dirname(os.path.abspath(__file__))
logs_dir = os.path.join(current_dir, "logs")
os.makedirs(logs_dir, exist_ok=True)  # Create logs directory if it doesn't exist

logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    handlers=[logging.FileHandler(os.path.join(logs_dir, "model_manager.log"), mode='a', encoding='utf-8'),
                              logging.StreamHandler()])
logger = logging.getLogger("ModelManager")

class ModelManager:
    """
    Singleton class to manage ML models loading and caching
    """
    _instance = None
    _models = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        logger.info("ModelManager initialized")
    
    def get_model(self, model_type, model_path=None, **kwargs):
        """
        Get or load a model of the specified type.
        
        Args:
            model_type (str): Type of model ('text', 'voice', 'fer', 'llm')
            model_path (str): Path to the model file
            **kwargs: Additional arguments for model loading
            
        Returns:
            The loaded model
        """
        if model_type in self._models:
            logger.info(f"Using cached {model_type} model")
            return self._models[model_type]
        
        logger.info(f"Loading {model_type} model from {model_path}")
        
        try:
            if model_type == 'text':
                # Add custom objects if needed
                model = load_model(model_path)
            elif model_type == 'voice':
                # Voice model might need custom objects
                from voice_emotion_prediction import GetItem
                model = load_model(model_path, custom_objects={'GetItem': GetItem})
            elif model_type == 'fer':
                # FER model might be PyTorch-based
                model = torch.load(model_path, map_location=torch.device('cuda' if torch.cuda.is_available() else 'cpu'))
                model.eval()
            elif model_type == 'llm':
                # LLM model (llama-cpp)
                model = Llama(model_path=model_path, **kwargs)
            else:
                logger.error(f"Unknown model type: {model_type}")
                return None
                
            self._models[model_type] = model
            logger.info(f"Successfully loaded {model_type} model")
            return model
            
        except Exception as e:
            logger.error(f"Error loading {model_type} model: {e}")
            return None
            
    def unload_model(self, model_type):
        """
        Unload a model to free up memory
        
        Args:
            model_type (str): Type of model to unload
        """
        if model_type in self._models:
            logger.info(f"Unloading {model_type} model")
            del self._models[model_type]
            import gc
            gc.collect()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                
    def load_prediction_models(self):
        """
        Preload both text and voice prediction models
        
        Returns:
            tuple: (text_model_success, voice_model_success)
        """
        logger.info("Preloading emotion prediction models...")
        text_success = False
        voice_success = False
        
        try:
            # Load the voice model
            from config import VOICE_MODEL_PATH
            from voice_emotion_prediction import GetItem
            voice_model = self.get_model('voice', model_path=VOICE_MODEL_PATH, 
                                        custom_objects={'GetItem': GetItem})
            voice_success = voice_model is not None
            if voice_success:
                logger.info("Voice emotion model loaded successfully")
            else:
                logger.error("Failed to load voice emotion model")
        except Exception as e:
            logger.error(f"Error loading voice model: {e}")
            
        try:
            # Load the text model
            from text_emotion_prediction import initialize_model
            text_success = initialize_model()
            if text_success:
                logger.info("Text emotion model loaded successfully")
            else:
                logger.error("Failed to load text emotion model")
        except Exception as e:
            logger.error(f"Error loading text model: {e}")
            
        return (text_success, voice_success)
                
    def has_model(self, model_type):
        """
        Check if a model of the specified type is already loaded
        
        Args:
            model_type (str): Type of model to check
            
        Returns:
            bool: True if the model is loaded, False otherwise
        """
        return model_type in self._models
