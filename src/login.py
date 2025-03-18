import tkinter as tk
from tkinter import ttk, messagebox
import pymongo 
from bson.objectid import ObjectId
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "your_database_name"
COLLECTION_NAME = "users"

class LoginPage(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Mirror Chat - Login")
        self.geometry("800x600")
        self.configure(bg="#0E1628") 

       
        form_frame = tk.Frame(self, bg="#1F2937", bd=2, relief="ridge")
        form_frame.place(relx=0.5, rely=0.5, anchor="center", width=400, height=400)

       
        title_label = tk.Label(form_frame, text="Mirror Chat", fg="white", bg="#1F2937", font=("Arial", 18, "bold"))
        title_label.pack(pady=(20, 10))

        
        email_label = tk.Label(form_frame, text="Your email", fg="white", bg="#1F2937", font=("Arial", 12))
        email_label.pack(pady=(10, 2))
        self.email_entry = tk.Entry(form_frame, font=("Arial", 12), bg="#374151", fg="white", bd=1, relief="solid")
        self.email_entry.pack(pady=(2, 10), ipadx=5, ipady=5, fill="x", padx=20)

       
        password_label = tk.Label(form_frame, text="Password", fg="white", bg="#1F2937", font=("Arial", 12))
        password_label.pack(pady=(10, 2))
        self.password_entry = tk.Entry(form_frame, font=("Arial", 12), bg="#374151", fg="white", bd=1, relief="solid", show="•")
        self.password_entry.pack(pady=(2, 10), ipadx=5, ipady=5, fill="x", padx=20)

       
        self.remember_var = tk.BooleanVar()
        remember_check = tk.Checkbutton(form_frame, text="Remember me", variable=self.remember_var, fg="white", 
                                        bg="#1F2937", font=("Arial", 10), selectcolor="#1F2937", activebackground="#1F2937", 
                                        activeforeground="white")
        remember_check.pack(pady=5)

        
        forgot_password_label = tk.Label(form_frame, text="Forgot password?", fg="#3B82F6", bg="#1F2937", font=("Arial", 10, "underline"), cursor="hand2")
        forgot_password_label.pack(pady=5)
        forgot_password_label.bind("<Button-1>", lambda e: messagebox.showinfo("Forgot Password", "Reset your password"))

      
        login_button = tk.Button(form_frame, text="Login", font=("Arial", 14, "bold"), bg="#3B82F6", fg="white", command=self.login)
        login_button.pack(pady=15, ipadx=50, ipady=5)

        
        signup_label = tk.Label(form_frame, text="Don’t have an account yet? Sign up", fg="#3B82F6", bg="#1F2937", font=("Arial", 10, "underline"), cursor="hand2")
        signup_label.pack(pady=5)
        signup_label.bind("<Button-1>", lambda e: messagebox.showinfo("Sign Up", "Redirect to sign up page"))

    def login(self):
        """Handles login button click."""
        email = self.email_entry.get().strip()
        password = self.password_entry.get().strip()

        if not email or not password:
            messagebox.showwarning("Login Failed", "Please enter both email and password")
            return

      
        try:
            client = MongoClient(MONGO_URI)
            db = client[DB_NAME]
            users_collection = db[COLLECTION_NAME]

            user = users_collection.find_one({"email": email, "password": password, "role": "patient"})

            if user:
                messagebox.showinfo("Login Successful", f"Welcome, {user['email']}!")
            else:
                messagebox.showerror("Login Failed", "Invalid email, password, or role is not patient")
        
        except pymongo.errors.ConnectionFailure as e:
            messagebox.showerror("Database Error", f"Could not connect to MongoDB:\n{e}")

        finally:
            client.close() 

if __name__ == "__main__":
    app = LoginPage()
    app.mainloop()
