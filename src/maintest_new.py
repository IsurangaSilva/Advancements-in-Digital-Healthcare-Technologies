# filepath: e:\Temp_Repos\01\Advancements-in-Digital-Healthcare-Technologies\src\maintest_new.py
import os
import tkinter as tk
from tkinter import PhotoImage
from settings import SettingsPage 
from profileUser import ProfilePage
from chat_history import ChatHistoryPage
from report import ReportPage
from chat import ChatbotApp
from chatting import ChattingPage

class MainApplication(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("MIRROR APP")
        self.geometry("400x600")
        self.configure(bg="#0B1B3F")
        self.menu_bar_color = "#0B1B3F"
        self.active_button_bg = "#4CAF50"    
        self.inactive_button_bg = "#0B1B3F"  
        self.button_fg = "white"

        # Initialize image storage
        self.images = {}

        # Create main frames before loading images
        self.page_frame = tk.Frame(self, bg="#000D2E")
        self.page_frame.place(relwidth=1.0, relheight=1.0, x=65)

        self.menu_bar_frame = tk.Frame(self, bg=self.menu_bar_color, width=68)
        self.menu_bar_frame.pack(side=tk.LEFT, fill=tk.Y, padx=3, pady=4)
        self.menu_bar_frame.pack_propagate(False)

        # Load images and create UI
        self.load_images()
        self.create_toggle_button()
        
        self.active_page = "dashboard"
        self.dashboard_page()
        self.setup_menu_buttons()

    def load_images(self):
        """Load all image assets with robust error handling."""
        # Get the absolute path to the assets directory - try multiple locations
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Try different possible paths where images might be located
        possible_paths = [
            os.path.join(current_dir, "assets", "images"),  # src/assets/images
            os.path.join(os.path.dirname(current_dir), "assets", "images"),  # ../assets/images
            os.path.join(current_dir, "..", "assets", "images")  # src/../assets/images
        ]
        
        assets_dir = None
        for path in possible_paths:
            if os.path.exists(path):
                assets_dir = path
                print(f"Found images directory at: {path}")
                break
        
        if assets_dir is None:
            assets_dir = os.path.join(current_dir, "assets", "images")
            os.makedirs(assets_dir, exist_ok=True)
            print(f"Created images directory at: {assets_dir}")

        # Define image paths
        image_paths = {
            'toggle': "toggle_btn_icon.png",
            'dashboard': "dashboard.png",
            'chat': "chat.png",
            'history': "history.png",
            'report': "report.png",
            'settings': "settings.png",
            'profile': "profile.png",
            'close': "close_btn_icon.png"
        }
        
        # Load images with error handling
        for key, filename in image_paths.items():
            try:
                path = os.path.join(assets_dir, filename)
                if os.path.exists(path):
                    self.images[key] = PhotoImage(file=path)
                    print(f"Successfully loaded image: {path}")
                else:
                    print(f"Image file not found: {path}")
                    self.images[key] = None
            except Exception as e:
                print(f"Error loading image {filename}: {e}")
                self.images[key] = None
        
        # Set convenient references
        self.toggle_icon = self.images.get('toggle')
        self.dashboard_icon = self.images.get('dashboard')
        self.chat_icon = self.images.get('chat')
        self.history_icon = self.images.get('history')
        self.report_icon = self.images.get('report')
        self.settings_icon = self.images.get('settings')
        self.profile_icon = self.images.get('profile')
        self.close_btn_icon = self.images.get('close')

    def create_toggle_button(self):
        """Create toggle menu button with fallback if image is not available."""
        try:
            btn_args = {
                'master': self.menu_bar_frame,
                'bg': self.inactive_button_bg,
                'bd': 0,
                'activebackground': self.inactive_button_bg,
                'command': self.extend_menu_bar
            }

            if self.toggle_icon is not None:
                btn_args['image'] = self.toggle_icon
            else:
                btn_args['text'] = "☰"
                btn_args['font'] = ('Arial', 16)
                btn_args['fg'] = self.button_fg

            self.toggle_menu_btn = tk.Button(**btn_args)
            self.toggle_menu_btn.place(x=4, y=10)
        except Exception as e:
            print(f"Error creating toggle button: {e}")
            # Create fallback button
            self.toggle_menu_btn = tk.Button(
                self.menu_bar_frame,
                text="☰",
                font=('Arial', 16),
                bg=self.inactive_button_bg,
                fg=self.button_fg,
                bd=0,
                command=self.extend_menu_bar
            )
            self.toggle_menu_btn.place(x=4, y=10)

    def create_menu_button(self, icon, y_pos, text, command):
        """Create menu button with active state highlighting and fallback for missing icons."""
        try:
            is_active = text.lower() == self.active_page.lower()
            button_bg = self.active_button_bg if is_active else self.inactive_button_bg
            
            # Create button
            btn_args = {
                'master': self.menu_bar_frame,
                'bg': button_bg,
                'bd': 0,
                'activebackground': button_bg,
                'command': command,
                'width': 50,
                'height': 50
            }

            if icon is not None:
                btn_args['image'] = icon
            else:
                # Fallback to text
                btn_args['text'] = text[0].upper()  # First letter of menu item
                btn_args['font'] = ('Arial', 14, 'bold')
                btn_args['fg'] = self.button_fg

            btn = tk.Button(**btn_args)
            btn.place(x=9, y=y_pos)

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

if __name__ == "__main__":
    app = MainApplication()
    app.mainloop()
