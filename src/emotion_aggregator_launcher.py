#!/usr/bin/env python3
"""
Emotion Aggregator Launcher
This module starts all the emotion aggregators in separate threads.
"""

import threading
import time
import logging
from FER.session_aggregator import SessionAggregator
from FER.aggregator import EmotionAggregator
from sessionTextAggregate import TextEmotionAggregator
from sessionTextAggregate60 import TextEmotionAggregator60
from sessionVoiceAggregate import VoiceEmotionAggregator
from sessionVoiceAggregate60 import VoiceEmotionAggregator60

# Configure logging
logger = logging.getLogger(__name__)

def run_aggregator(aggregator, interval_seconds, name):
    """Run an aggregator in a loop with specified interval"""
    logger.info(f"Starting {name} aggregator with interval: {interval_seconds} seconds")
    while True:
        try:
            aggregator.aggregate()
        except Exception as e:
            logger.error(f"Error in {name} aggregator: {e}")
        
        time.sleep(interval_seconds)

def start_emotion_aggregators():
    """
    Start all emotion aggregators in separate threads
    """
    logger.info("Initializing emotion aggregators")
    
    # Create aggregator instances
    session_aggregator = SessionAggregator(interval_seconds=300)  # 5 minutes
    emotion_aggregator = EmotionAggregator(window_seconds=60)     # 1 minute
    text_aggregator = TextEmotionAggregator(interval_seconds=20)  # 20 seconds
    text_aggregator_60 = TextEmotionAggregator60(interval_seconds=60)  # 1 minute
    voice_aggregator = VoiceEmotionAggregator(interval_seconds=20)  # 20 seconds
    voice_aggregator_60 = VoiceEmotionAggregator60(interval_seconds=60)  # 1 minute
    
    # Create and start threads for each aggregator
    threads = [
        threading.Thread(
            target=run_aggregator,
            args=(session_aggregator, 300, "Session"),
            daemon=True
        ),
        threading.Thread(
            target=run_aggregator,
            args=(emotion_aggregator, 60, "Emotion"),
            daemon=True
        ),
        threading.Thread(
            target=run_aggregator,
            args=(text_aggregator, 20, "Text"),
            daemon=True
        ),
        threading.Thread(
            target=run_aggregator,
            args=(text_aggregator_60, 60, "Text-60min"),
            daemon=True
        ),
         threading.Thread(
            target=run_aggregator,
            args=(voice_aggregator, 20, "Voice"),
            daemon=True
        ),
        threading.Thread(
            target=run_aggregator,
            args=(voice_aggregator_60, 60, "Voice-60min"),
            daemon=True
        )
    ]
    
    # Start all threads
    for thread in threads:
        thread.start()
    
    logger.info("All emotion aggregator threads started")
    
    return threads  # Return threads in case the caller wants to join them later

if __name__ == "__main__":
    # Configure logging when run directly
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    
    # Start aggregators and keep main thread alive
    threads = start_emotion_aggregators()
    
    # Keep the script running when executed directly
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Stopping aggregators due to keyboard interrupt")
