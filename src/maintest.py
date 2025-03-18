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


        self.toggle_icon = PhotoImage(file="./assets/images/toggle_btn_icon.png")
        self.dashboard_icon = PhotoImage(file="./assets/images/dashboard.png")
        self.chat_icon = PhotoImage(file="./assets/images/chat.png")
        self.history_icon = PhotoImage(file="./assets/images/history.png")
        self.report_icon = PhotoImage(file="./assets/images/report.png")
        self.settings_icon = PhotoImage(file="./assets/images/settings.png")
        self.profile_icon = PhotoImage(file="./assets/images/profile.png")
        self.close_btn_icon = PhotoImage(file="./assets/images/close_btn_icon.png")

        
        self.page_frame = tk.Frame(self, bg="#000D2E")
        self.page_frame.place(relwidth=1.0, relheight=1.0, x=65)

        
        self.menu_bar_frame = tk.Frame(self, bg=self.menu_bar_color, width=68)
        self.menu_bar_frame.pack(side=tk.LEFT, fill=tk.Y, padx=3, pady=4)
        self.menu_bar_frame.pack_propagate(False)

       
        self.toggle_menu_btn = tk.Button(
            self.menu_bar_frame,
            image=self.toggle_icon,
            bg=self.inactive_button_bg,
            fg=self.button_fg,
            bd=0,
            activebackground=self.inactive_button_bg,
            command=self.extend_menu_bar
        )
        self.toggle_menu_btn.place(x=4, y=10)
        self.active_page = "dashboard"
        self.dashboard_page()
        self.setup_menu_buttons()

    def setup_menu_buttons(self):
        self.create_menu_button(self.dashboard_icon, 150, "Dashboard", self.dashboard_page)
        self.create_menu_button(self.chat_icon, 230, "Chat", self.chat_page)
        self.create_menu_button(self.history_icon, 300, "History", self.history_page)
        self.create_menu_button(self.report_icon, 370, "Report", self.report_page)
        self.create_menu_button(self.settings_icon, 650, "Settings", self.settings_page)
        self.create_menu_button(self.profile_icon, 730, "Profile", self.profile_page)

    def create_menu_button(self, icon, y_pos, text, command):
        """Create menu buttons with active state highlighting."""
        is_active = text == self.active_page
        button_bg = self.active_button_bg if is_active else self.inactive_button_bg
        indicator_bg = self.active_button_bg if is_active else self.inactive_button_bg

       
        btn = tk.Button(
            self.menu_bar_frame,
            image=icon,
            bg=button_bg,
            fg=self.button_fg,
            bd=0,
            activebackground=button_bg,
            command=command
        )
        btn.place(x=9, y=y_pos, width=50, height=50)

        
        indicator = tk.Frame(self.menu_bar_frame, bg=indicator_bg)
        indicator.place(x=3, y=y_pos, width=3, height=50)

        
        label = tk.Label(
            self.menu_bar_frame,
            text=text,
            font=("Helvetica", 15, "bold"),
            anchor="w",
            bg=self.menu_bar_color,
            fg="white",
        )
        label.place(x=65, y=y_pos, width=120, height=50)
        label.bind("<Button-1>", lambda e: command())

    def switch_page(self, page_class, page_name):
        """Switch between pages and update active menu highlight."""
        self.active_page = page_name
        for widget in self.page_frame.winfo_children():
            widget.destroy()
        page = page_class(self.page_frame, controller=self)
        page.pack(fill="both", expand=True)
        self.setup_menu_buttons()

    def dashboard_page(self):
        self.switch_page(ChatbotApp, "Dashboard")

    def profile_page(self):
        self.switch_page(ProfilePage, "Profile")

    def chat_page(self):
        self.switch_page(ChattingPage, "Chat")

    def settings_page(self):
        """Navigate to the Settings Page."""
        self.switch_page(SettingsPage, "Settings")

    def history_page(self):
        self.switch_page(ChatHistoryPage, "History")

    def report_page(self):
        self.switch_page(ReportPage, "Report")

    def extend_menu_bar(self):
        """Expands the sidebar menu."""
        self.menu_bar_frame.config(width=200)
        self.toggle_menu_btn.config(image=self.close_btn_icon, command=self.fold_menu_bar)
        self.close_btn_label = tk.Label(
          self.menu_bar_frame,
          text="MIRROR",
          font=("Helvetica", 18, "bold"),
          bg=self.menu_bar_color,
          fg="white",
          padx=15,
          pady=10
        )

        self.close_btn_label.place(x=60, y=10)
        self.toggle_menu_btn.config(image=self.close_btn_icon, command=self.fold_menu_bar)

    def fold_menu_bar(self):
        """Collapses the sidebar menu."""
        self.menu_bar_frame.config(width=65)
        if hasattr(self, "close_btn_label"):
          self.close_btn_label.place_forget()
        self.toggle_menu_btn.config(image=self.toggle_icon, command=self.extend_menu_bar)

if __name__ == "__main__":
    app = MainApplication()
    app.mainloop()
