import tkinter as tk
from PIL import Image, ImageTk

class SidebarPage(tk.Frame):
    def __init__(self, parent=None, controller=None):
        super().__init__(parent, bg="#0a1a2a")
        self.controller = controller  # Reference to the main application
        self.pack(fill=tk.Y, side=tk.LEFT)

        # Dictionary to store image references
        self.image_refs = {}
        self.active_button = None  # Track the currently active button

        # Sidebar frame
        sidebar_frame = tk.Frame(self, bg="#0a1a2a")
        sidebar_frame.pack(fill=tk.BOTH, expand=True)

        # Sidebar title with image
        title_frame = tk.Frame(sidebar_frame, bg="#2a3a4a", padx=10, pady=10)
        title_frame.pack(fill=tk.X)

        icon_image = self.load_image("logo.png", (30, 30))  
        if icon_image:
            self.image_refs["logo"] = icon_image  # Store reference
            title_icon = tk.Label(title_frame, image=icon_image, bg="#2a3a4a")
        else:
            title_icon = tk.Label(title_frame, text="No Logo", fg="white", bg="#2a3a4a", font=("Arial", 12))
        title_icon.pack(side=tk.LEFT, padx=5)

        title_label = tk.Label(title_frame, text="MIRROR", font=("Arial", 16, "bold"), bg="#2a3a4a", fg="white")
        title_label.pack(side=tk.LEFT, padx=5)

        # Sidebar buttons with icons and navigation
        self.sidebar_buttons = []
        sidebar_items = [
            ("Dashboard", "dashboard_icon.jpg", "DashboardPage"),
            ("Chat History", "chat_icon.jpg", "ChatHistoryPage"),
            ("Report", "report_icon.jpg", "ReportPage"),
            ("Starred", "chatBot.jpg", "StarredPage"),
        ]

        for btn_text, icon_path, page_name in sidebar_items:
            button = self.create_button_with_icon(sidebar_frame, btn_text, icon_path, page_name)
            self.sidebar_buttons.append(button)

        # Spacer to push Profile and Settings to the bottom
        spacer = tk.Frame(sidebar_frame, bg="#0a1a2a")
        spacer.pack(fill=tk.BOTH, expand=True)  # Pushes everything below it down

        # Profile and Settings buttons at the bottom
        self.create_button_with_icon(sidebar_frame, "Profile", "user.jpg", "ProfilePage")
        self.create_button_with_icon(sidebar_frame, "Settings", "setting_icon.jpg", "SettingsPage")

    def create_button_with_icon(self, parent, text, icon_path, page_name):
        """Creates a sidebar button with an image that switches pages and highlights the active button."""
        btn_frame = tk.Frame(parent, bg="#0a1a2a")
        btn_frame.pack(fill=tk.X, pady=5, padx=10)

        btn_image = self.load_image(icon_path, (20, 20))  
        if btn_image:
            self.image_refs[text] = btn_image  # Store reference
            btn_icon = tk.Label(btn_frame, image=btn_image, bg="#0a1a2a")
        else:
            btn_icon = tk.Label(btn_frame, text="?", fg="white", bg="#0a1a2a", font=("Arial", 12))
        btn_icon.pack(side=tk.LEFT, padx=(5, 10))

        btn = tk.Button(
            btn_frame, text=text, font=("Arial", 12), fg="white", bg="#0a1a2a",
            relief="flat", anchor="w", padx=10, activebackground="#2a3a5a",
            command=lambda: self.set_active_button(btn, page_name)  # Page switching and highlight
        )
        btn.pack(fill=tk.X, expand=True)

        # Hover effect
        btn.bind("<Enter>", lambda event, b=btn: b.config(bg="#2a3a5a"))  # Darker hover effect
        btn.bind("<Leave>", lambda event, b=btn: self.reset_button_color(b))  # Reset color when leaving

        return btn

    def set_active_button(self, button, page_name):
        """Highlights the active button and switches the page."""
        if self.active_button:
            self.active_button.config(bg="#0a1a2a")  # Reset previous active button

        button.config(bg="#2a3a5a")  # Highlight active button
        self.active_button = button  # Store the active button

        self.controller.show_page(page_name)  # Switch pages

    def reset_button_color(self, button):
        """Resets button color when hovering away unless it's the active button."""
        if button != self.active_button:
            button.config(bg="#0a1a2a")

    def load_image(self, path, size=(30, 30)):
        """Loads and resizes an image while preventing garbage collection issues."""
        try:
            img = Image.open(path)
            img = img.resize(size, Image.Resampling.LANCZOS)
            return ImageTk.PhotoImage(img)
        except IOError:
            print(f"Warning: Cannot open '{path}'. Using placeholder image.")
            return None
