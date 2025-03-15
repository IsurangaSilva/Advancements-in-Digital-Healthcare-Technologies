import tkinter as tk
from tkinter import Canvas, Frame, Scrollbar
from PIL import Image, ImageTk

class ChatHistoryPage(tk.Frame):  # Change from tk.Tk to tk.Frame
    def __init__(self, parent, controller):  
        super().__init__(parent, bg="#1a2a44")  
        self.controller = controller  

        # Main chat area (Frame inside a canvas for scrolling)
        chat_container = Frame(self, bg="#1a2a44")
        chat_container.pack(fill=tk.BOTH, expand=True)  # Full-screen chat area

        # Canvas for scrolling chat messages
        self.canvas = Canvas(chat_container, bg="#1a2a44", highlightthickness=0)
        self.chat_frame = Frame(self.canvas, bg="#1a2a44")

        # Scrollbar for chat messages
        self.scrollbar = Scrollbar(chat_container, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        # Packing layout
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.canvas.create_window((0, 0), window=self.chat_frame, anchor="nw")

        # Dummy chat messages (for testing)
        dummy_messages = [
            ("Hello! How can I assist you today?", "Bot", "chatBot.png"),
            ("Hi, I need help with a project.", "User", "user.png"),
            ("Sure, I can help with that. What project is it?", "Bot", "chatBot.png"),
            ("It's about data analysis.", "User", "user.png"),
            ("Great! Let's start with the basics.", "Bot", "chatBot.png"),
            ("Can you explain what tools I should use?", "User", "user.png"),
            ("Of course! For data analysis, you might want to use Python with Pandas and NumPy.", "Bot", "chatBot.png"),
            ("That sounds good! What about visualization?", "User", "user.png"),
            ("For visualization, you can use Matplotlib or Seaborn.", "Bot", "chatBot.png"),
            ("Thanks! How do I get started with Pandas?", "User", "user.png"),
            ("Install Pandas using pip: `pip install pandas`. Then, import it in your script.", "Bot", "chatBot.png"),
            ("Got it. Can you share a simple example?", "User", "user.png"),
            ("Sure! Here's how to load a CSV file: `import pandas as pd; df = pd.read_csv('file.csv'); print(df.head())`", "Bot", "chatBot.png"),
            ("Awesome, I’ll try that out!", "User", "user.png"),
            ("Let me know if you need more help!", "Bot", "chatBot.png"),
        ]

        # Adding chat messages
        for message, role, icon_path in dummy_messages:
            self.add_chat_message(message, role, icon_path)

        # Update scroll region
        self.chat_frame.update_idletasks()
        self.canvas.config(scrollregion=self.canvas.bbox("all"))

        # Bind mouse wheel for scrolling
        self.canvas.bind_all("<MouseWheel>", self.on_mouse_wheel)

    def add_chat_message(self, message, role, icon_path):
        """Adds a chat message to the chat frame."""
        msg_frame = Frame(self.chat_frame, bg="#1a2a44", pady=5)

        # Load icon
        icon_label = tk.Label(msg_frame, bg="#1a2a44")
        icon_img = self.load_image(icon_path, (30, 30))
        if icon_img:
            icon_label.config(image=icon_img)
            icon_label.image = icon_img  # Prevent garbage collection
        else:
            icon_label.config(text="?", fg="white", font=("Arial", 12))

        # Message text
        msg_text = tk.Label(
            msg_frame, text=message, wraplength=800, justify="left",  # Increased width
            font=("Arial", 14), bg="white", fg="#333", padx=15, pady=10
        )

        # Align messages based on role
        if role == "Bot":
            icon_label.pack(side=tk.LEFT, padx=10)
            msg_text.pack(side=tk.LEFT, padx=10)
            msg_frame.pack(anchor="w", padx=20, pady=5, fill=tk.X)
        else:
            msg_text.config(bg="#d3d3d3")  # Light gray for user messages
            msg_text.pack(side=tk.RIGHT, padx=10)
            icon_label.pack(side=tk.RIGHT, padx=10)
            msg_frame.pack(anchor="e", padx=20, pady=5, fill=tk.X)

    def load_image(self, path, size=(50, 50)):  # Increased size for better visibility
        """Loads and resizes an image for profile icons."""
        try:
            img = Image.open(path)
            img = img.resize(size, Image.Resampling.LANCZOS)
            return ImageTk.PhotoImage(img)
        except IOError:
            print(f"Warning: Cannot open '{path}'. Using placeholder.")
            return None

    def on_mouse_wheel(self, event):
        """Enables scrolling with the mouse wheel."""
        self.canvas.yview_scroll(-1*(event.delta//120), "units")
