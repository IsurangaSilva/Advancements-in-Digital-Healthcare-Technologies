import os
import tkinter as tk
from tkinter import PhotoImage
from settings import SettingsPage 
from profileUser import ProfilePage
from chat_history import ChatHistoryPage
from report import ReportPage
from chat import ChatbotApp
from chatting import ChattingPage
import logging

class MainApplication(tk.Tk):    def __init__(self):
        super().__init__()        self.title("MIRROR APP")
        self.geometry("1024x768")  # Default size before maximizing
        self.configure(bg="#0B1B3F")
        self.menu_bar_color = "#0B1B3F"
        self.active_button_bg = "#4CAF50"    
        self.inactive_button_bg = "#0B1B3F"  
        self.button_fg = "white"
        
        # Maximize window on startup
        self.state('zoomed')  # For Windows systems
        
        # Maximize window on startup
        self.state('zoomed')  # This is for Windows
        
        # For Linux/Mac compatibility (if needed)
        # self.attributes('-zoomed', True)  # Linux
        # self.attributes('-fullscreen', True)  # Mac alternative

        # Create main frames
        self.page_frame = tk.Frame(self, bg="#000D2E")
        self.page_frame.place(relwidth=1.0, relheight=1.0, x=65)

        self.menu_bar_frame = tk.Frame(self, bg=self.menu_bar_color, width=68)
        self.menu_bar_frame.pack(side=tk.LEFT, fill=tk.Y, padx=3, pady=4)
        self.menu_bar_frame.pack_propagate(False)

        # IMPORTANT: Store PhotoImages as instance attributes, not in a dictionary
        # This prevents them from being garbage collected
        self.load_images()
        
        # Create UI after loading images
        self.create_toggle_button()
        
        self.active_page = "dashboard"
        self.dashboard_page()
        self.setup_menu_buttons()

    def load_images(self):
        """Load all image assets with robust error handling."""
        # Get the absolute path to the assets directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Try different possible paths where images might be located
        possible_paths = [
            os.path.join(current_dir, "assets", "images"),      # src/assets/images
            os.path.join(os.path.dirname(current_dir), "assets", "images"), # ../assets/images
            os.path.join(current_dir, "..", "assets", "images") # src/../assets/images
        ]
        
        assets_dir = None
        for path in possible_paths:
            if os.path.exists(path):
                assets_dir = path
                print(f"Found images directory at: {assets_dir}")
                break
        
        if assets_dir is None:
            # Create the directory if it doesn't exist
            assets_dir = os.path.join(current_dir, "assets", "images")
            os.makedirs(assets_dir, exist_ok=True)
            print(f"Created images directory at: {assets_dir}")
        
        # CRITICAL: Store images as direct instance attributes to prevent garbage collection
        try:
            toggle_path = os.path.join(assets_dir, "toggle_btn_icon.png")
            if os.path.exists(toggle_path):
                self.toggle_icon = PhotoImage(file=toggle_path)
                print(f"Successfully loaded image: {toggle_path}")
            else:
                self.toggle_icon = None
                print(f"Image not found: {toggle_path}")
                
            dashboard_path = os.path.join(assets_dir, "dashboard.png")
            if os.path.exists(dashboard_path):
                self.dashboard_icon = PhotoImage(file=dashboard_path)
                print(f"Successfully loaded image: {dashboard_path}")
            else:
                self.dashboard_icon = None
                print(f"Image not found: {dashboard_path}")
                
            chat_path = os.path.join(assets_dir, "chat.png")
            if os.path.exists(chat_path):
                self.chat_icon = PhotoImage(file=chat_path)
                print(f"Successfully loaded image: {chat_path}")
            else:
                self.chat_icon = None
                print(f"Image not found: {chat_path}")
                
            history_path = os.path.join(assets_dir, "history.png")
            if os.path.exists(history_path):
                self.history_icon = PhotoImage(file=history_path)
                print(f"Successfully loaded image: {history_path}")
            else:
                self.history_icon = None
                print(f"Image not found: {history_path}")
                
            report_path = os.path.join(assets_dir, "report.png")
            if os.path.exists(report_path):
                self.report_icon = PhotoImage(file=report_path)
                print(f"Successfully loaded image: {report_path}")
            else:
                self.report_icon = None
                print(f"Image not found: {report_path}")
                
            settings_path = os.path.join(assets_dir, "settings.png")
            if os.path.exists(settings_path):
                self.settings_icon = PhotoImage(file=settings_path)
                print(f"Successfully loaded image: {settings_path}")
            else:
                self.settings_icon = None
                print(f"Image not found: {settings_path}")
                
            profile_path = os.path.join(assets_dir, "profile.png")
            if os.path.exists(profile_path):
                self.profile_icon = PhotoImage(file=profile_path)
                print(f"Successfully loaded image: {profile_path}")
            else:
                self.profile_icon = None
                print(f"Image not found: {profile_path}")
                
            close_path = os.path.join(assets_dir, "close_btn_icon.png")
            if os.path.exists(close_path):
                self.close_btn_icon = PhotoImage(file=close_path)
                print(f"Successfully loaded image: {close_path}")
            else:
                self.close_btn_icon = None
                print(f"Image not found: {close_path}")
                
        except Exception as e:
            print(f"Error loading images: {e}")
            # Initialize all icons to None if loading fails
            self.toggle_icon = None
            self.dashboard_icon = None
            self.chat_icon = None
            self.history_icon = None
            self.report_icon = None
            self.settings_icon = None
            self.profile_icon = None
            self.close_btn_icon = None

    def create_toggle_button(self):
        """Create toggle menu button with fallback if image is not available."""
        try:
            if self.toggle_icon is not None:
                self.toggle_menu_btn = tk.Button(
                    self.menu_bar_frame,
                    image=self.toggle_icon,
                    bg=self.inactive_button_bg,
                    bd=0,
                    activebackground=self.inactive_button_bg,
                    command=self.extend_menu_bar
                )
            else:
                self.toggle_menu_btn = tk.Button(
                    self.menu_bar_frame,
                    text="☰",
                    font=('Arial', 16),
                    fg=self.button_fg,
                    bg=self.inactive_button_bg,
                    bd=0,
                    activebackground=self.inactive_button_bg,
                    command=self.extend_menu_bar
                )
            self.toggle_menu_btn.place(x=4, y=10)
        except Exception as e:
            print(f"Error creating toggle button: {e}")
            # Create fallback button
            self.toggle_menu_btn = tk.Button(
                self.menu_bar_frame,
                text="☰",
                font=('Arial', 16),
                fg=self.button_fg,
                bg=self.inactive_button_bg,
                bd=0,
                command=self.extend_menu_bar
            )
            self.toggle_menu_btn.place(x=4, y=10)

    def create_menu_button(self, icon, y_pos, text, command):
        """Create menu button with active state highlighting and fallback for missing icons."""
        try:
            is_active = text.lower() == self.active_page.lower()
            button_bg = self.active_button_bg if is_active else self.inactive_button_bg
            
            if icon is not None:
                btn = tk.Button(
                    self.menu_bar_frame,
                    image=icon,
                    bg=button_bg,
                    bd=0,
                    activebackground=button_bg,
                    command=command
                )
            else:
                # Fallback to text
                btn = tk.Button(
                    self.menu_bar_frame,
                    text=text[0].upper(),  # First letter of menu item
                    font=('Arial', 14, 'bold'),
                    fg=self.button_fg,
                    bg=button_bg,
                    bd=0,
                    activebackground=button_bg,
                    command=command
                )
            
            btn.place(x=9, y=y_pos, width=50, height=50)

            # Create active state indicator
            indicator = tk.Frame(
                self.menu_bar_frame,
                bg=self.active_button_bg if is_active else self.inactive_button_bg
            )
            indicator.place(x=3, y=y_pos, width=3, height=50)

            # Create label (for extended menu)
            label = tk.Label(
                self.menu_bar_frame,
                text=text,
                font=("Helvetica", 15, "bold"),
                bg=self.menu_bar_color,
                fg=self.button_fg,
                anchor="w"
            )
            label.place(x=65, y=y_pos + 15)  # Adjusted y position for better alignment
            label.bind("<Button-1>", lambda e: command())

        except Exception as e:
            print(f"Error creating menu button {text}: {e}")
            # Create fallback button with text only
            btn = tk.Button(
                self.menu_bar_frame,
                text=text[0].upper(),
                font=('Arial', 14, 'bold'),
                bg=button_bg,
                fg=self.button_fg,
                bd=0,
                command=command,
                width=4,
                height=2
            )
            btn.place(x=9, y=y_pos)

    def setup_menu_buttons(self):
        """Setup all menu buttons."""
        menu_items = [
            (self.dashboard_icon, 150, "Dashboard", self.dashboard_page),
            (self.chat_icon, 230, "Chat", self.chat_page),
            (self.history_icon, 300, "History", self.history_page),
            (self.report_icon, 370, "Report", self.report_page),
            (self.settings_icon, 650, "Settings", self.settings_page),
            (self.profile_icon, 730, "Profile", self.profile_page)
        ]
        
        for icon, y_pos, text, command in menu_items:
            self.create_menu_button(icon, y_pos, text, command)

    def extend_menu_bar(self):
        """Expands the sidebar menu with fallback for missing icons."""
        try:
            self.menu_bar_frame.config(width=200)
            
            # Update toggle button
            if self.close_btn_icon is not None:
                self.toggle_menu_btn.config(image=self.close_btn_icon)
            else:
                self.toggle_menu_btn.config(text="×", font=('Arial', 20, 'bold'))
            
            self.toggle_menu_btn.config(command=self.fold_menu_bar)
            
            # Add MIRROR label
            self.close_btn_label = tk.Label(
                self.menu_bar_frame,
                text="MIRROR",
                font=("Helvetica", 18, "bold"),
                bg=self.menu_bar_color,
                fg=self.button_fg,
                padx=15,
                pady=10
            )
            self.close_btn_label.place(x=60, y=10)
            
            # Update menu button labels visibility
            for widget in self.menu_bar_frame.winfo_children():
                if isinstance(widget, tk.Label) and widget != self.close_btn_label:
                    widget.lift()  # Bring labels to front
        
        except Exception as e:
            print(f"Error extending menu bar: {e}")
            # Minimal fallback - just try to show the text
            try:
                self.menu_bar_frame.config(width=200)
                self.toggle_menu_btn.config(text="×", font=('Arial', 20, 'bold'))
                self.toggle_menu_btn.config(command=self.fold_menu_bar)
            except:
                pass

    def fold_menu_bar(self):
        """Collapses the sidebar menu with fallback for missing icons."""
        try:
            self.menu_bar_frame.config(width=65)
            if hasattr(self, "close_btn_label"):
                self.close_btn_label.place_forget()
            
            # Update toggle button
            if self.toggle_icon is not None:
                self.toggle_menu_btn.config(image=self.toggle_icon)
            else:
                self.toggle_menu_btn.config(text="☰", font=('Arial', 16))
            
            self.toggle_menu_btn.config(command=self.extend_menu_bar)
            
        except Exception as e:
            print(f"Error folding menu bar: {e}")
            # Minimal fallback - just try to collapse
            try:
                self.menu_bar_frame.config(width=65)
                self.toggle_menu_btn.config(text="☰", font=('Arial', 16))
                self.toggle_menu_btn.config(command=self.extend_menu_bar)
            except:
                pass

    def switch_page(self, page_class, page_name):
        """Switch between pages and update active menu highlight."""
        try:
            self.active_page = page_name
            for widget in self.page_frame.winfo_children():
                widget.destroy()
            page = page_class(self.page_frame, controller=self)
            page.pack(fill="both", expand=True)
            self.setup_menu_buttons()
        except Exception as e:
            print(f"Error switching to page {page_name}: {e}")

    def dashboard_page(self):
        self.switch_page(ChatbotApp, "Dashboard")

    def profile_page(self):
        self.switch_page(ProfilePage, "Profile")

    def chat_page(self):
        self.switch_page(ChattingPage, "Chat")

    def settings_page(self):
        self.switch_page(SettingsPage, "Settings")

    def history_page(self):
        self.switch_page(ChatHistoryPage, "History")

    def report_page(self):
        self.switch_page(ReportPage, "Report")
