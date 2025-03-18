import tkinter as tk
from tkinter import ttk, messagebox
import pymongo 
from pymongo import MongoClient
import bcrypt
import os
import subprocess

MONGO_URI = "mongodb+srv://ravindunirmal099:9skEfhr02gOJSmnE@depressiondetection.qpzzs.mongodb.net/?retryWrites=true&w=majority&appName=DepressionDetection"
DB_NAME = "emotionDB"
COLLECTION_NAME = "users"

class LoginPage(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Mirror Chat - Login")
        self.geometry("900x700")
        self.configure(bg="#0B1B3F") 

       
        container = tk.Frame(self, bg="#1E2A44", bd=0)
        container.place(relx=0.5, rely=0.5, anchor="center", width=450, height=550)
        
        
        shadow_canvas = tk.Canvas(container, bg="#0B1B3F", highlightthickness=0)
        shadow_canvas.place(x=-5, y=-5, width=460, height=560)
        shadow_canvas.create_rectangle(5, 5, 455, 555, fill="#1E2A44", outline="")

       
        header_frame = tk.Frame(container, bg="#0B1B3F")
        header_frame.pack(fill="x")
        tk.Label(header_frame, text="Mirror Chat", font=("Helvetica", 24, "bold"), fg="white", 
                bg="#0B1B3F").pack(pady=20)

        
        form_frame = tk.Frame(container, bg="#1E2A44")
        form_frame.pack(pady=30, padx=40, fill="both", expand=True)

        
        email_label = tk.Label(form_frame, text="Email Address", fg="#A3BFFA", bg="#1E2A44", 
                             font=("Helvetica", 12, "bold"))
        email_label.pack(pady=(20, 5))
        self.email_entry = tk.Entry(form_frame, font=("Helvetica", 12), bg="#2D3B55", fg="white", 
                                  insertbackground="white", bd=0, relief="flat")
        self.email_entry.pack(pady=5, ipady=8, fill="x")
        tk.Frame(form_frame, bg="#A3BFFA", height=2).pack(fill="x")  

       
        password_label = tk.Label(form_frame, text="Password", fg="#A3BFFA", bg="#1E2A44", 
                                font=("Helvetica", 12, "bold"))
        password_label.pack(pady=(20, 5))
        self.password_entry = tk.Entry(form_frame, font=("Helvetica", 12), bg="#2D3B55", fg="white", 
                                     show="•", insertbackground="white", bd=0, relief="flat")
        self.password_entry.pack(pady=5, ipady=8, fill="x")
        tk.Frame(form_frame, bg="#A3BFFA", height=2).pack(fill="x")  
        
        options_frame = tk.Frame(form_frame, bg="#1E2A44")
        options_frame.pack(pady=15, fill="x")
        
        self.remember_var = tk.BooleanVar()
        remember_check = tk.Checkbutton(options_frame, text="Remember me", variable=self.remember_var, 
                                      fg="#D1D5DB", bg="#1E2A44", font=("Helvetica", 10), 
                                      selectcolor="#2D3B55", activebackground="#1E2A44", 
                                      activeforeground="#D1D5DB")
        remember_check.pack(side="left")
        
        forgot_password_label = tk.Label(options_frame, text="Forgot Password?", fg="#60A5FA", 
                                       bg="#1E2A44", font=("Helvetica", 10, "underline"), cursor="hand2")
        forgot_password_label.pack(side="right")
        forgot_password_label.bind("<Button-1>", lambda e: messagebox.showinfo("Forgot Password", "Reset your password"))

        
        self.login_button = tk.Button(form_frame, text="Login", font=("Helvetica", 14, "bold"), 
                                    bg="#3B82F6", fg="white", bd=0, relief="flat", 
                                    activebackground="#2563EB", activeforeground="white", 
                                    command=self.login)
        self.login_button.pack(pady=30, ipady=10, ipadx=50)
        self.login_button.bind("<Enter>", lambda e: self.login_button.config(bg="#2563EB"))
        self.login_button.bind("<Leave>", lambda e: self.login_button.config(bg="#3B82F6"))

        
        signup_frame = tk.Frame(container, bg="#1E2A44")
        signup_frame.pack(pady=10)
        signup_label = tk.Label(signup_frame, text="Don’t have an account? ", fg="#D1D5DB", 
                              bg="#1E2A44", font=("Helvetica", 10))
        signup_label.pack(side="left")
        signup_link = tk.Label(signup_frame, text="Sign Up", fg="#60A5FA", bg="#1E2A44", 
                             font=("Helvetica", 10, "underline"), cursor="hand2")
        signup_link.pack(side="left")
        signup_link.bind("<Button-1>", lambda e: messagebox.showinfo("Sign Up", "Redirect to sign up page"))

    def login(self):
        """Handles login button click with bcrypt authentication and navigation."""
        email = self.email_entry.get().strip()
        password = self.password_entry.get().strip()

        if not email or not password:
            messagebox.showwarning("Login Failed", "Please enter both email and password")
            return

        try:
            client = MongoClient(MONGO_URI)
            db = client[DB_NAME]
            users_collection = db[COLLECTION_NAME]

            
            user = users_collection.find_one({"email": email, "role": "patient"})

            if user:
        
                stored_password = user["password"]
                
                if isinstance(stored_password, str):
                    stored_password = stored_password.encode('utf-8')
                elif not isinstance(stored_password, bytes):
                    messagebox.showerror("Error", "Stored password format is invalid")
                    return

                if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                    messagebox.showinfo("Login Successful", f"Welcome, {user['email']}!")
                    self.destroy()
                    subprocess.run(["python", "src/main.py"])
                else:
                    messagebox.showerror("Login Failed", "Invalid email or password")
            else:
                messagebox.showerror("Login Failed", "Invalid email or user not found")

        except pymongo.errors.ConnectionFailure as e:
            messagebox.showerror("Database Error", f"Could not connect to MongoDB:\n{e}")
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred:\n{e}")
        finally:
            client.close()

if __name__ == "__main__":
    app = LoginPage()
    app.mainloop()