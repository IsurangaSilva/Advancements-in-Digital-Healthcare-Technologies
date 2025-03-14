import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk

class SettingsPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#1a2a44")
        
        # Title "Update Profile" at the top
        title_label = tk.Label(self, text="Update Profile", font=("Arial", 24, "bold"), bg="#1a2a44", fg="white")
        title_label.pack(pady=(20, 30), padx=20)

        # Horizontal layout for profile picture and form (to keep them side by side)
        content_frame = tk.Frame(self, bg="#1a2a44")
        content_frame.pack(fill=tk.BOTH, expand=True, padx=50)

        # Profile picture frame
        pic_frame = tk.Frame(content_frame, bg="#1a2a44")
        pic_frame.pack(side=tk.LEFT, padx=(0, 40), fill=tk.Y)

        # Load profile picture
        try:
            image = Image.open("user.png")
            photo = ImageTk.PhotoImage(image.resize((160, 160)))
            profile_pic = tk.Label(pic_frame, image=photo)
            profile_pic.image = photo  # Keep a reference!
        except:
            profile_pic = tk.Label(pic_frame, text="Profile Picture", font=("Arial", 16), bg="#1a2a44", fg="white")
        
        profile_pic.pack(pady=20)

        # Add New button
        add_new_btn = tk.Button(pic_frame, text="Add New", command=self.add_new_picture,
                                bg="#28a745", fg="white", font=("Arial", 16), relief=tk.RAISED, bd=2)
        add_new_btn.pack(pady=10)

        # Form frame
        form_frame = tk.Frame(content_frame, bg="#1a2a44")
        form_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        # Form fields
        self.create_form_entry(form_frame, "Name", "Sadaruwan Attanayaka")
        self.create_form_entry(form_frame, "Email", "SadaruwanAttanayaka1212@gmail.com")
        self.create_form_entry(form_frame, "Old Password", "", show="*")
        self.create_form_entry(form_frame, "New Password", "", show="*")

        # Update button
        update_btn = tk.Button(form_frame, text="Update", command=self.update_profile,
                               bg="#6f42c1", fg="white", font=("Arial", 16), relief=tk.RAISED, bd=2)
        update_btn.pack(pady=(20, 0), anchor='e')

    def create_form_entry(self, frame, label_text, default_text='', show=None):
        """Utility function to create label and entry widgets."""
        label = tk.Label(frame, text=label_text, font=("Arial", 18), bg="#1a2a44", fg="white")
        label.pack(fill=tk.X, padx=20, pady=(10, 5))
        entry = tk.Entry(frame, font=("Arial", 16), bd=2, relief=tk.SUNKEN, show=show)
        entry.insert(0, default_text)
        entry.pack(fill=tk.X, padx=20, pady=5)

    def add_new_picture(self):
        # Placeholder functionality for adding a new picture
        messagebox.showinfo("Info", "Add New picture functionality to be implemented")

    def update_profile(self):
        # Placeholder functionality for updating profile
        messagebox.showinfo("Info", "Update profile functionality to be implemented")

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1920x1080")
    app = UpdateProfilePage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()
