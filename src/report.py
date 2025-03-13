import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from PIL import Image, ImageTk  # for handling image files in Tkinter

class ReportPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#1a2a44")

        # Left section: Profile picture and details
        left_frame = tk.Frame(self, bg="#1a2a44")
        left_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Profile picture
        try:
            image = Image.open("user.png")
            photo = ImageTk.PhotoImage(image.resize((180, 180)))
            profile_pic = tk.Label(left_frame, image=photo, bg="#1a2a44")
            profile_pic.image = photo  # keep a reference!
        except:
            profile_pic = tk.Label(left_frame, text="Profile Picture", bg="#1a2a44", fg="white", font=("Arial", 16))
        profile_pic.pack(pady=20)

        # Right section: Bar chart with heading
        right_frame = tk.Frame(self, bg="#1a2a44")
        right_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # Heading "Emotion Report"
        emotion_report_label = tk.Label(right_frame, text="Emotion Report", bg="#1a2a44", fg="white", font=("Arial", 24, "bold"))
        emotion_report_label.pack(pady=20)

        # Create the bar chart using matplotlib
        fig, ax = plt.subplots(figsize=(8, 6))
        emotions = ['Anger', 'Happiness', 'Sadness', 'Surprise', 'Fear']
        students = [40, 20, 50, 45, 35]
        bar_colors = ['red', 'green', 'blue', 'yellow', 'orange']
        ax.bar(emotions, students, color=bar_colors)
        ax.set_xlabel("Name of emotion")
        ax.set_ylabel("Percentage (%)")
        ax.set_title("Emotion Analysis")
        ax.set_ylim(0, 70)
        ax.grid(True, linestyle='--', alpha=0.7)
        ax.set_facecolor('#ffffff')
        fig.patch.set_facecolor('#ffffff')
        plt.xticks(rotation=45, ha='right')

        # Embed the chart into the Tkinter window
        canvas = FigureCanvasTkAgg(fig, master=right_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
