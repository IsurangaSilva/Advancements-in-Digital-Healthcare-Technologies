import tkinter as tk
from PIL import Image, ImageTk

class ProfilePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#1a2a44")
        self.controller = controller  # Reference to main UI controller

        # Title "Profile" at the top
        title_label = tk.Label(self, text="Profile", font=("Arial", 20, "bold"), bg="#1a2a44", fg="white")
        title_label.pack(pady=20)

        # Profile Picture and Details (Horizontal Layout)
        content_frame = tk.Frame(self, bg="#1a2a44")
        content_frame.pack(pady=20)

        # Profile Picture
        profile_pic_label = tk.Label(content_frame, bg="#1a2a44")
        profile_pic = self.load_image("user.png", (160, 160))  
        if profile_pic:
            profile_pic_label.config(image=profile_pic)
            profile_pic_label.image = profile_pic  # Keep reference
        else:
            profile_pic_label.config(text="Profile Picture", fg="white", font=("Arial", 16))
        profile_pic_label.pack(side=tk.LEFT, padx=20)

        # Profile Details
        details_frame = tk.Frame(content_frame, bg="#1a2a44")
        details_frame.pack(side=tk.LEFT, padx=20)

        profile_data = [
            ("Name", "Sadaruwan Attanaya"),
            ("Gender", "Male"),
            ("Age", "35"),
            ("Email", "SadaruwanAttanaya1212@gmail.com")
        ]

        for label, value in profile_data:
            detail_label = tk.Label(details_frame, text=f"{label} : {value}", font=("Arial", 14), bg="#1a2a44", fg="white")
            detail_label.pack(anchor="w", pady=5)

    def load_image(self, path, size=(100, 100)):
        """Loads and resizes an image with Pillow"""
        try:
            img = Image.open(path)
            img = img.resize(size, Image.Resampling.LANCZOS)
            return ImageTk.PhotoImage(img)
        except IOError:
            print(f"Warning: Cannot open '{path}'. Using placeholder.")
            return None
