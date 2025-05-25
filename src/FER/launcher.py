import os
import tkinter as tk
from ttkbootstrap import Window
import numpy as np
from session_app import SessionApp

def launch_session_app(no_personalization=True):
    """
    Launch the FER session app without requiring personalization.
    This allows anyone to use the FER system.
    """
    main_root = Window(themename="darkly")
    app = SessionApp(main_root, no_personalization=no_personalization)
    main_root.mainloop()

# Legacy functions kept for backward compatibility but no longer used
def start_personalization(avg_embedding=None):
    print("Personalization is now disabled - launching app directly")
    launch_session_app()

def start_reference_capture():
    print("Reference capture is now disabled - launching app directly")
    launch_session_app()

if __name__ == "__main__":
    print("Starting FER application (personalization disabled)...")
    launch_session_app()
