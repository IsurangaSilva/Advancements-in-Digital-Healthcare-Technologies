# api.py
import requests
from config import API_URL

def send_to_backend(history, message):
    """Sends conversation history and the latest message to the backend."""
    payload = {"history": history, "message": message}
    try:
        response = requests.post(API_URL, json=payload)
        return response.json().get("response", "Error: No response")
    except Exception as e:
        return f"Failed to connect: {str(e)}"