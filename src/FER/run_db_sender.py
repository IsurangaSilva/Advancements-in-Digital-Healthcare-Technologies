"""
Standalone script to run the SessionDBSender.
This can be run as a separate process if you want to isolate the database sending functionality.
"""
import os
import sys
import logging
from datetime import datetime

# Add the parent directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f"db_sender_{datetime.now().strftime('%Y-%m-%d')}.log")
    ]
)
logger = logging.getLogger("db_sender")

def main():
    logger.info("Starting the SessionDBSender as a standalone process")
    try:
        from FER.session_db_sender import SessionDBSender
        sender = SessionDBSender(interval_seconds=10)
        sender.run()
    except Exception as e:
        logger.exception(f"Error running SessionDBSender: {e}")

if __name__ == "__main__":
    main()
