import tkinter as tk
from tkinter import Canvas, Frame, Scrollbar
from PIL import Image, ImageTk
import json
import os

class ChatHistoryPage(tk.Frame):
    def __init__(self, parent, controller, chat_history_path="./chat_history.json"):
        super().__init__(parent, bg="#000D2E")
        self.controller = controller
        self.chat_history_file = chat_history_path

      
        header_frame = tk.Frame(self, bg="#000D2E", height=60)  # Fixed height for header
        header_frame.pack(side="top", fill="x")
        header_frame.pack_propagate(True)  # Prevent header from resizing

        heading_label = tk.Label(header_frame, text="Chat History", font=("Arial", 25, "bold"),
                                fg="white", bg="#000D2E")
        heading_label.pack(pady=(60,60))  # Vertical padding for header

        
        container = tk.Frame(self, bg="#000D2E")
        container.pack(side="top", fill="both", expand=True)

        self.canvas = tk.Canvas(container, bg="#000D2E", highlightthickness=0)
        self.canvas.pack(side="left", fill="both", expand=True)

        self.scrollbar = tk.Scrollbar(container, orient="vertical", command=self.canvas.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        self.chat_frame = tk.Frame(self.canvas, bg="#000D2E")
        self.canvas.create_window((0, 0), window=self.chat_frame, anchor="nw")

        
        self.chat_frame.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
        self.canvas.bind("<Configure>", self.on_canvas_configure)
        self.canvas.bind_all("<MouseWheel>", self.on_mouse_wheel)

        self.load_chat_history()

    def on_canvas_configure(self, event):
        self.canvas.itemconfig(self.canvas.create_window((0, 0), window=self.chat_frame, anchor="nw"), 
                             width=event.width)

    def on_mouse_wheel(self, event):
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def load_chat_history(self):
        if os.path.exists(self.chat_history_file):
            try:
                with open(self.chat_history_file, "r") as f:
                    history = [json.loads(line) for line in f if line.strip() != ""]
                for entry in history:
                    sender = entry.get("sender", "Assistant")
                    message = entry.get("message", "")
                    timestamp = entry.get("timestamp", "")
                    icon_path = "./profile_pictures/profile.jpg" if sender.lower() == "user" else "./assets/images/chatbot.png"
                    self.add_chat_message(message, sender, timestamp, icon_path)
            except Exception as e:
                print(f"Error loading chat history: {e}")

    def add_chat_message(self, message, role, timestamp, icon_path):
      
        align_left = role.lower() != "user"
        frame_bg = "blue" if role.lower() == "user" else "white"
        text_color = "white" if role.lower() == "user" else "black"

       
        msg_frame = Frame(self.chat_frame, bg=frame_bg, relief="solid", bd=1, pady=2, padx=3)

        icon_label = tk.Label(msg_frame, bg=frame_bg)
        icon_img = self.load_image(icon_path, (60, 60))
        if icon_img:
            icon_label.config(image=icon_img)
            icon_label.image = icon_img
        else:
            icon_label.config(text="?", fg=text_color, font=("Arial", 12))

        text_frame = Frame(msg_frame, bg=frame_bg)
       
        if align_left:
            msg_text = tk.Label(text_frame, text=message, wraplength=850, font=("Arial", 14),
                               bg=frame_bg, fg=text_color, padx=10, pady=5,
                               anchor="w", justify="left")
        else:
            msg_text = tk.Label(text_frame, text=message, wraplength=450, font=("Arial", 14),
                               bg=frame_bg, fg=text_color, padx=10, pady=5,
                               anchor="e", justify="right")
        msg_text.pack(side=tk.TOP)

       
        timestamp_color = "white" if role.lower() == "user" else "gray"
        timestamp_anchor = "e" if role.lower() == "user" else "w"
        timestamp_label = tk.Label(text_frame, text=timestamp, font=("Arial", 10, "italic"),
                                 bg=frame_bg, fg=timestamp_color)
        timestamp_label.pack(side=tk.TOP, anchor=timestamp_anchor)

        if align_left:
            icon_label.pack(side=tk.LEFT, padx=10)
            text_frame.pack(side=tk.LEFT, padx=5)
        else:
            icon_label.pack(side=tk.RIGHT, padx=10)
            text_frame.pack(side=tk.RIGHT, padx=5)
        
        
        if align_left:
            msg_frame.pack(padx=(130,10), pady=10, anchor="w")
        else:
            msg_frame.pack(padx=(15, 170), pady=10, anchor="e")

    def load_image(self, path, size=(50, 50)):
        try:
            img = Image.open(path)
            img = img.resize(size, Image.Resampling.LANCZOS)
            return ImageTk.PhotoImage(img)
        except IOError:
            print(f"Warning: Cannot open '{path}'. Using placeholder.")
            return None