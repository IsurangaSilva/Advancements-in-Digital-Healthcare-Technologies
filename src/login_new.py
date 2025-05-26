import tkinter as tk
from tkinter import ttk, messagebox
import pymongo 
import bcrypt
import os
import sys
import subprocess
import logging
from db_connection import MongoDBConnection

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("login")

# File to store login state
LOGIN_STATE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "login_state.txt")

class LoginPage(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Mirror Chat - Login")
        self.geometry("900x700")
        self.configure(bg="#0B1B3F") 

        # Center window on screen
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

        # Create container frame with shadow effect
        container = tk.Frame(self, bg="#1E2A44", bd=0)
        container.place(relx=0.5, rely=0.5, anchor="center", width=450, height=550)
        
        # Add shadow effect
        shadow_canvas = tk.Canvas(container, bg="#0B1B3F", highlightthickness=0)
        shadow_canvas.place(x=-5, y=-5, width=460, height=560)
        shadow_canvas.create_rectangle(5, 5, 455, 555, fill="#1E2A44", outline="")

        # Header section
        header_frame = tk.Frame(container, bg="#0B1B3F")
        header_frame.pack(fill="x")
        tk.Label(header_frame, text="Mirror Chat", font=("Helvetica", 24, "bold"), fg="white", 
                bg="#0B1B3F").pack(pady=20)

        # Form section
        form_frame = tk.Frame(container, bg="#1E2A44")
        form_frame.pack(pady=30, padx=40, fill="both", expand=True)

        # Email field
        email_label = tk.Label(form_frame, text="Email Address", fg="#A3BFFA", bg="#1E2A44", 
                             font=("Helvetica", 12, "bold"))
        email_label.pack(pady=(20, 5))
        self.email_entry = tk.Entry(form_frame, font=("Helvetica", 12), bg="#2D3B55", fg="white", 
                                  insertbackground="white", bd=0, relief="flat")
        self.email_entry.pack(pady=5, ipady=8, fill="x")
        tk.Frame(form_frame, bg="#A3BFFA", height=2).pack(fill="x")  

        # Password field
        password_label = tk.Label(form_frame, text="Password", fg="#A3BFFA", bg="#1E2A44", 
                                font=("Helvetica", 12, "bold"))
        password_label.pack(pady=(20, 5))
        self.password_entry = tk.Entry(form_frame, font=("Helvetica", 12), bg="#2D3B55", fg="white", 
                                     show="•", insertbackground="white", bd=0, relief="flat")
        self.password_entry.pack(pady=5, ipady=8, fill="x")
        tk.Frame(form_frame, bg="#A3BFFA", height=2).pack(fill="x")  
        
        # Options (remember me & forgot password)
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
        forgot_password_label.bind("<Button-1>", lambda e: messagebox.showinfo("Forgot Password", "Please contact your administrator to reset your password"))

        # Login button with hover effect
        self.login_button = tk.Button(form_frame, text="Login", font=("Helvetica", 14, "bold"), 
                                    bg="#3B82F6", fg="white", bd=0, relief="flat", 
                                    activebackground="#2563EB", activeforeground="white", 
                                    command=self.login)
        self.login_button.pack(pady=30, ipady=10, ipadx=50)
        self.login_button.bind("<Enter>", lambda e: self.login_button.config(bg="#2563EB"))
        self.login_button.bind("<Leave>", lambda e: self.login_button.config(bg="#3B82F6"))

        # Sign up link
        signup_frame = tk.Frame(container, bg="#1E2A44")
        signup_frame.pack(pady=10)
        signup_label = tk.Label(signup_frame, text="Don't have an account? ", fg="#D1D5DB", 
                              bg="#1E2A44", font=("Helvetica", 10))
        signup_label.pack(side="left")
        signup_link = tk.Label(signup_frame, text="Sign Up", fg="#60A5FA", bg="#1E2A44", 
                             font=("Helvetica", 10, "underline"), cursor="hand2")
        signup_link.pack(side="left")
        signup_link.bind("<Button-1>", self.open_signup)
          # Check if we have a saved login
        self.check_saved_login()
    
    def check_saved_login(self):
        """Check if there's a saved login state and auto-login if yes"""
        try:
            if os.path.exists(LOGIN_STATE_FILE):
                with open(LOGIN_STATE_FILE, "r") as f:
                    email = f.read().strip()
                    if email:
                        self.email_entry.insert(0, email)
                        self.remember_var.set(True)
        except Exception as e:
            logger.error(f"Error checking saved login: {e}")
    
    def save_login_state(self, email):
        """Save login state if remember me is checked"""
        try:
            if self.remember_var.get():
                # Since LOGIN_STATE_FILE is just a filename with no directory path,
                # we don't need to create directories
                with open(LOGIN_STATE_FILE, "w") as f:
                    f.write(email)
            else:
                # Delete the file if remember me is unchecked
                if os.path.exists(LOGIN_STATE_FILE):
                    os.remove(LOGIN_STATE_FILE)
        except Exception as e:
            logger.error(f"Error saving login state: {e}")

    def open_signup(self, event):
        """Handle sign up button click"""
        messagebox.showinfo("Sign Up", "Please contact your administrator to create an account")

    def login(self):
        """Handles login button click with bcrypt authentication and navigation."""
        email = self.email_entry.get().strip()
        password = self.password_entry.get().strip()

        if not email or not password:
            messagebox.showwarning("Login Failed", "Please enter both email and password")
            return

        try:
            # Use the project's MongoDB connection
            db_conn = MongoDBConnection()
            users_collection = db_conn.get_collection("users")            # Find user by email (allowing any role)
            user = users_collection.find_one({"email": email})

            if user:
                # Verify password with bcrypt
                stored_password = user["password"]
                
                # Handle different password formats
                if isinstance(stored_password, str):
                    stored_password = stored_password.encode('utf-8')
                elif not isinstance(stored_password, bytes):
                    messagebox.showerror("Error", "Stored password format is invalid")
                    return

                if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                    # Save login state if remember me is checked
                    self.save_login_state(email)
                    
                    messagebox.showinfo("Login Successful", f"Welcome, {user['email']}!")
                    self.destroy()                    # Start the main application
                    main_path = "main.py"
                    if os.path.exists(main_path):
                        try:
                            # Use current Python interpreter to run main.py
                            subprocess.run([sys.executable, main_path])
                        except Exception as e:
                            logger.error(f"Error starting main application: {e}")
                            messagebox.showerror("Error", f"Failed to start application: {e}")
                    else:
                        logger.error(f"Main file not found at {main_path}")
                        messagebox.showerror("Error", f"Could not find main application file at {main_path}")
                else:
                    messagebox.showerror("Login Failed", "Invalid password")
            else:
                messagebox.showerror("Login Failed", "Invalid email or user not found")

        except pymongo.errors.ConnectionFailure as e:
            messagebox.showerror("Database Error", f"Could not connect to MongoDB:\n{e}")
        except Exception as e:
            logger.error(f"Login error: {e}")
            messagebox.showerror("Error", f"An error occurred during login:\n{e}")

if __name__ == "__main__":
    app = LoginPage()
    app.mainloop()
