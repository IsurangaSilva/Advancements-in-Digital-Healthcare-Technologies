import tkinter as tk
from sidebar import SidebarPage  # Import Sidebar
from profileUser import ProfilePage  # Import Profile Page
from chat_history import ChatHistoryPage  # Import Chat History Page
from report import ReportPage  # Make sure this is the correct import for the revised ReportPage
from settings import SettingsPage
from dashboard import DashboardPage



class MainApp(tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("Navigation System")
        self.geometry("1080x720")
        self.configure(bg="#0a1a2a")

        # Main container
        self.container = tk.Frame(self)
        self.container.pack(fill=tk.BOTH, expand=True)

        # Sidebar Frame (Pass reference to main controller)
        self.sidebar = SidebarPage(self.container, self)
        self.sidebar.pack(side=tk.LEFT, fill=tk.Y)

        # Content Frame (Holds all pages)
        self.content_frame = tk.Frame(self.container, bg="white")
        self.content_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        # Dictionary to store pages
        self.pages = {}
        for Page in (DashboardPage, ChatHistoryPage, ReportPage, ProfilePage, SettingsPage):
            page_name = Page.__name__
            frame = Page(parent=self.content_frame, controller=self)
            self.pages[page_name] = frame
            frame.grid(row=0, column=0, sticky="nsew")
        
        self.content_frame.grid_rowconfigure(0, weight=1)
        self.content_frame.grid_columnconfigure(0, weight=1)

        # Show default page
        self.show_page("DashboardPage")

    def show_page(self, page_name):
        """Switches the displayed content frame."""
        frame = self.pages.get(page_name)
        if frame:
            frame.tkraise()
        else:
            print(f"Error: Page '{page_name}' not found!")



if __name__ == '__main__':
    app = MainApp()
    app.mainloop()
