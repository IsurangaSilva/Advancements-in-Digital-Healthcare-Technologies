import tkinter as tk
from PIL import Image, ImageTk
import os
import json

class ProfilePage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#000D2E")
        self.json_file_path = "./src/profile_data.json"
        

        self.image_dir = "profile_pictures"
        os.makedirs(self.image_dir, exist_ok=True)
        self.image_path = os.path.join(self.image_dir, "profile.jpg")

       
        title_label = tk.Label(self, text="User Profile", font=("Helvetica", 36, "bold"), bg="#000D2E", fg="#FFFFFF")
        title_label.pack(pady=(60, 30))
        self.profile_pic_frame = tk.Frame(self, bg="#000D2E")
        self.profile_pic_frame.pack(pady=(20, 40))

       
        self.load_profile_picture()

      
        self.display_profile_details()

    def display_profile_details(self):
    
        profile_data = self.get_profile_data()
        
        
        self.create_profile_detail("Full Name", profile_data.get("Name", "Not Available"))
        
        
        self.create_profile_detail("Email", profile_data.get("Email", "Not Available"))
        
        
        self.create_profile_detail("Phone", profile_data.get("Phone", "Not Available"))
        
        
        self.create_profile_detail("Role", profile_data.get("Role", "Not Available"))

    def create_profile_detail(self, label_text, value_text):
        detail_frame = tk.Frame(self, bg="#000D2E")
        detail_frame.pack(fill=tk.X, padx=40, pady=(10, 5))

        label = tk.Label(detail_frame, text=f"{label_text}: {value_text}", font=("Helvetica", 18), bg="#000D2E", fg="#F1F1F1")
        label.pack(fill=tk.X)

    def load_profile_picture(self):
        try:
            image = Image.open(self.image_path).convert("RGB")
            image = image.resize((150, 150), Image.LANCZOS)
            photo = ImageTk.PhotoImage(image)
        except:
            photo = None

        for widget in self.profile_pic_frame.winfo_children():
            widget.destroy()
        
        if photo:
            profile_pic = tk.Label(self.profile_pic_frame, image=photo, bg="#1F2739")
            profile_pic.image = photo  
            profile_pic.pack()
        else:
            profile_pic = tk.Label(self.profile_pic_frame, text="Profile Picture", font=("Helvetica", 16), bg="#1F2739", fg="#FFFFFF")
            profile_pic.pack()

    def get_profile_data(self):
        if os.path.exists(self.json_file_path):
            with open(self.json_file_path, "r") as json_file:
                try:
                    data = json.load(json_file)
                    return data
                except json.JSONDecodeError:
                    print("Error decoding JSON file.")
        else:
            print(f"JSON file does not exist at: {self.json_file_path}")
        return {}

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1920x1080")
    root.title("Profile Settings")
    root.config(bg="#000D2E")
    app = ProfilePage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()
