import tkinter as tk
from tkinter import messagebox, filedialog
from PIL import Image, ImageTk
from pymongo import MongoClient
from bson import ObjectId
import os
import json
import subprocess

class SettingsPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#000D2E")
        self.controller = controller
        self.root = parent  # Store the root window reference explicitly

        # Create a canvas with scrollbar
        self.canvas = tk.Canvas(self, bg="#000D2E", highlightthickness=0)
        scrollbar = tk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = tk.Frame(self.canvas, bg="#000D2E")

        # Bind the scrollable frame to update the scroll region dynamically
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )

        # Create a window inside the canvas for the scrollable frame
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)

        # Enable mouse wheel scrolling
        self.canvas.bind_all("<MouseWheel>", self._on_mousewheel)

        # MongoDB connection setup
        self.client = MongoClient("mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection")
        self.db = self.client["emotionDB"]
        self.collection = self.db["users"]

        # Image directory setup
        self.image_dir = "profile_pictures"
        os.makedirs(self.image_dir, exist_ok=True)
        self.image_path = os.path.join(self.image_dir, "profile.jpg")
        self.json_file_path = "profile_data.json"

        # Title
        title_label = tk.Label(self.scrollable_frame, text="Settings", font=("Helvetica", 30, "bold"), bg="#000D2E", fg="#F1F1F1")
        title_label.pack(pady=(60, 60), padx=(100, 0))

        # Profile Picture Frame
        self.profile_pic_frame = tk.Frame(self.scrollable_frame, bg="#2F3A4A")
        self.profile_pic_frame.pack(pady=(20, 10), padx=(100, 0))
        self.load_profile_picture()

        # Upload Image Button
        upload_btn = tk.Button(self.scrollable_frame, text="Change Profile Picture", command=self.upload_image,
                              bg="green", fg="white", font=("Helvetica", 10, "bold"), relief=tk.RAISED, bd=0,
                              activebackground="#DAA520", activeforeground="white", padx=15, pady=8)
        upload_btn.pack(pady=(10, 40), padx=(100, 0))

        # Form frame for profile inputs
        form_frame = tk.Frame(self.scrollable_frame, bg="#1F2739", bd=2, relief="groove")
        form_frame.pack(fill=tk.BOTH, expand=True, padx=(300, 200), pady=60)

        profile_data = self.get_profile_data()
        self.name_entry = self.create_form_entry(form_frame, "Full Name", profile_data.get("Name", ""))
        self.email_entry = self.create_form_entry(form_frame, "Email", profile_data.get("Email", ""))
        self.phone_entry = self.create_form_entry(form_frame, "Phone", profile_data.get("Phone", ""))
        self.role_entry = self.create_form_entry(form_frame, "Role", profile_data.get("Role", ""))
        self.role_entry.config(state="disabled")

        # Update Profile Button
        update_btn = tk.Button(form_frame, text="Update Profile", command=self.update_profile,
                              bg="green", fg="white", font=("Helvetica", 10, "bold"), relief=tk.RAISED, bd=0,
                              activebackground="#DAA520", activeforeground="white", padx=10, pady=10)
        update_btn.pack(pady=(30, 30), padx=20, anchor='e')

        # Chat History Section
        history_frame = tk.Frame(self.scrollable_frame, bg="#000D2E")
        history_frame.pack(pady=(50, 50), fill=tk.X)
        history_label = tk.Label(history_frame, text="Chat History", font=("Helvetica", 24), bg="#000D2E", fg="white", anchor="w")
        history_label.pack(side=tk.LEFT, padx=(300, 10))
        
        clear_button = tk.Button(history_frame, text="Clear", bg="red", fg="white", command=self.confirm_clear_chat_history, font=("Helvetica", 15))
        clear_button.pack(side=tk.LEFT, padx=(50, 10))
        
        report_button = tk.Button(history_frame, text="Get Report", bg="GREEN", fg="white", command=self.download_chat_history, font=("Helvetica", 15))
        report_button.pack(side=tk.LEFT, padx=(0, 650))

        # Personalization Section
        personalization_frame = tk.Frame(self.scrollable_frame, bg="#000D2E")
        personalization_frame.pack(pady=(100, 80), fill=tk.X)
        personalization_label = tk.Label(personalization_frame, text="Personalization", font=("Helvetica", 24), bg="#000D2E", fg="white", anchor="w")
        personalization_label.pack(side=tk.LEFT, padx=(300, 10))
        personalization_input = tk.Entry(personalization_frame, bg="#444B5A", fg="white", width=30)
        personalization_input.pack(side=tk.LEFT, padx=(0, 10))
        add_button = tk.Button(personalization_frame, text="Add", bg="green", fg="white")
        add_button.pack(side=tk.LEFT, padx=(0, 10))

        # FAQ Section
        faq_canvas = tk.Canvas(self.scrollable_frame, bg="#000D2E", height=300, bd=0, highlightthickness=0)
        faq_canvas.pack(pady=(10, 0), padx=(280, 10), fill=tk.X)
        faq_canvas.create_oval(10, 10, 400, 190, outline="#444B5A", width=2)
        faq_label = tk.Label(faq_canvas, text="FAQ", font=("Helvetica", 24), bg="#000D2E", fg="white")
        faq_label.place(x=20, y=20)
        
        faq_content = (
            "Q1: What is depression detection?\n"
            "A1: Depression detection uses AI technologies like voice analysis, NLP, and facial expressions to identify emotional imbalances.\n\n"
            "Q2: How does AI help in detecting depression?\n"
            "A2: AI models analyze speech patterns, text inputs, and facial cues to offer real-time emotional insights and support.\n\n"
            "Q3: Is my data secure?\n"
            "A3: Yes, we ensure your data is encrypted and handled with strict privacy protocols to protect your information."
        )
        faq_text = tk.Label(faq_canvas, text=faq_content, font=("Helvetica", 12), bg="#000D2E", fg="white", anchor="w", justify=tk.LEFT)
        faq_text.place(x=20, y=60)

        # Privacy Section
        privacy_canvas = tk.Canvas(self.scrollable_frame, bg="#000D2E", height=200, bd=0, highlightthickness=0)
        privacy_canvas.pack(pady=(10, 20), padx=(280, 10), fill=tk.X)
        privacy_canvas.create_oval(10, 10, 400, 190, outline="#444B5A", width=2)
        privacy_label = tk.Label(privacy_canvas, text="Privacy", font=("Helvetica", 24), bg="#000D2E", fg="white")
        privacy_label.place(x=20, y=20)

        privacy_content = (
            "Privacy Notice:\n"
            "Your privacy is our top priority. We collect only the essential data required for effective depression detection. "
            "This includes speech data, textual analysis, and visual inputs from your device's camera.\n\n"
            "Data Security:\n"
            "All collected data is encrypted and stored securely. Your information will never be shared with third parties without explicit consent."
        )
        privacy_text = tk.Label(privacy_canvas, text=privacy_content, font=("Helvetica", 12), bg="#000D2E", fg="white", anchor="w", justify=tk.LEFT)
        privacy_text.place(x=20, y=60)

        # Logout Button
        logout_button = tk.Button(self.scrollable_frame, text="Logout", font=("Helvetica", 16), bg="red", fg="white", command=self.confirm_logout)
        logout_button.pack(pady=(20, 20), padx=(130, 0))

        # Pack canvas and scrollbar
        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

    def _on_mousewheel(self, event):
        """Enable scrolling with the mouse wheel."""
        self.canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

    def create_form_entry(self, frame, label_text, default_text='', show=None):
        label = tk.Label(frame, text=label_text, font=("Helvetica", 18), bg="#1F2739", fg="#F1F1F1", anchor="w")
        label.pack(fill=tk.X, padx=20, pady=(10, 5))
        entry = tk.Entry(frame, font=("Helvetica", 16), bd=2, relief="flat", show=show,
                        fg="#333", bg="#F1F1F1", insertbackground="black", highlightthickness=0, width=10)
        entry.insert(0, default_text)
        entry.pack(fill=tk.X, padx=20, pady=5)
        return entry

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
            profile_pic = tk.Label(self.profile_pic_frame, image=photo, bg="#2F3A4A")
            profile_pic.image = photo
            profile_pic.pack()
        else:
            profile_pic = tk.Label(self.profile_pic_frame, text="Profile Picture", font=("Helvetica", 16), bg="#0E1628", fg="white")
            profile_pic.pack()

    def upload_image(self):
        file_path = filedialog.askopenfilename(filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.gif")])
        if file_path:
            try:
                image = Image.open(file_path).convert("RGB")
                image = image.resize((150, 150), Image.LANCZOS)
                image.save(self.image_path, format="JPEG")
                self.load_profile_picture()
                messagebox.showinfo("Success", "Profile picture updated successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to upload image: {e}")

    def get_profile_data(self):
        if os.path.exists(self.json_file_path):
            with open(self.json_file_path, "r") as json_file:
                try:
                    return json.load(json_file)
                except json.JSONDecodeError:
                    print("Error decoding JSON file.")
        try:
            profile = self.collection.find_one({"_id": ObjectId("67d3f9703a6dac84897c2245")})
            if profile:
                return {
                    "Name": profile.get("username", "N/A"),
                    "Email": profile.get("email", "N/A"),
                    "Phone": profile.get("phone", "N/A"),
                    "Role": profile.get("role", "N/A")
                }
            return {}
        except Exception as e:
            print(f"Error fetching profile data from MongoDB: {e}")
            return {}

    def update_profile(self):
        name = self.name_entry.get()
        email = self.email_entry.get()
        phone = self.phone_entry.get()
        role = self.role_entry.get()

        try:
            result = self.collection.update_one(
                {"_id": ObjectId("67d3f9703a6dac84897c2245")},
                {"$set": {"username": name, "email": email, "phone": phone, "role": role}}
            )
            if result.modified_count > 0:
                messagebox.showinfo("Success", "Your profile has been updated successfully!")
            else:
                messagebox.showinfo("No Changes", "No changes were made to your profile.")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred while updating MongoDB: {e}")
        
        try:
            profile_data = {"Name": name, "Email": email, "Phone": phone, "Role": role}
            with open(self.json_file_path, "w") as json_file:
                json.dump(profile_data, json_file, indent=4)
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred while updating the JSON file: {e}")

    def confirm_clear_chat_history(self):
        response = messagebox.askokcancel("Clear Chat History", "Are you sure you want to clear the chat history?")
        if response:
            self.clear_chat_history()

    def clear_chat_history(self):
        chat_history_file = "./chat_history.json"
        if os.path.exists(chat_history_file):
            os.remove(chat_history_file)
            print("Chat history cleared.")
        else:
            print("No chat history file found.")

    def confirm_logout(self):
        response = messagebox.askokcancel("Logout", "Are you sure you want to log out?")
        if response:
            self.logout()

    def logout(self):
        """Close the current window and open the login page."""
        print("Logging out...")
        # Explicitly destroy the root window
        self.root.destroy()
        # Launch the login page script
        try:
            subprocess.run(["python", "src/login.py"], check=True)  # Adjust the path if needed
        except subprocess.CalledProcessError as e:
            print(f"Error launching login page: {e}")
        except FileNotFoundError:
            print("Login script not found. Ensure 'login.py' exists in the correct directory.")

    def download_chat_history(self):
        chat_history_file = "./chat_history.json"
        if not os.path.exists(chat_history_file):
            print("No chat history found.")
            return
        
        with open(chat_history_file, "r") as f:
            chat_data = [json.loads(line) for line in f if line.strip() != ""]

        if not chat_data:
            print("Chat history is empty.")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")],
            title="Save Chat History"
        )

        if file_path:
            try:
                with open(file_path, "w") as f:
                    json.dump(chat_data, f, indent=4)
                print(f"Chat history saved to {file_path}")
            except Exception as e:
                print(f"Error saving chat history: {e}")

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1920x1080")
    root.title("Profile and Settings")
    root.config(bg="#2F3A4A")
    app = SettingsPage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()