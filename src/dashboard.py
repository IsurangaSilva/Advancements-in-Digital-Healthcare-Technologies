import tkinter as tk
import ttkbootstrap as tb
from ttkbootstrap.constants import *
from tkinter import Canvas, Frame, Scrollbar


class DashboardPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#1a2a44")
        self.controller = controller

        # Main dashboard area (Frame inside a canvas for scrolling)
        dashboard_container = Frame(self, bg="#1a2a44")
        dashboard_container.pack(fill=tk.BOTH, expand=True)  # Full-screen dashboard area

        # Canvas for scrolling dashboard widgets
        self.canvas = Canvas(dashboard_container, bg="#1a2a44", highlightthickness=0)
        self.dashboard_frame = Frame(self.canvas, bg="#1a2a44")

        # Scrollbar for the dashboard
        self.scrollbar = Scrollbar(dashboard_container, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.scrollbar.set)

        # Packing layout
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.canvas.create_window((0, 0), window=self.dashboard_frame, anchor="nw")

        # Update scroll region
        self.dashboard_frame.update_idletasks()
        self.canvas.config(scrollregion=self.canvas.bbox("all"))

        # Bind mouse wheel for scrolling
        self.canvas.bind_all("<MouseWheel>", self.on_mouse_wheel)

        # Chat UI Setup (Integrated into the dashboard)
        self.create_widgets()

    def create_widgets(self):
        """Creates the chat UI."""
        main_frame = Frame(self.dashboard_frame, bg='#2d2d2d')
        main_frame.pack(fill='both', expand=True)

        self.scrollbar = tb.Scrollbar(main_frame, orient='vertical')
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.chat_container = Frame(main_frame, bg='#2d2d2d', width=600)
        self.chat_container.place(relx=0.5, rely=0, anchor='n', relheight=1.0)
        self.chat_container.pack_propagate(False)

        self.chat_canvas = Canvas(
            self.chat_container,
            bg='#2d2d2d',
            highlightthickness=0,
            bd=0,
            yscrollcommand=self.scrollbar.set
        )
        self.chat_canvas.pack(fill=tk.BOTH, expand=True)
        self.scrollbar.config(command=self.chat_canvas.yview)

        self.messages_frame = Frame(self.chat_canvas, bg='#2d2d2d')
        self.canvas_window = self.chat_canvas.create_window((0, 0), window=self.messages_frame, anchor='n')
        self.messages_frame.bind("<Configure>", lambda event: self.chat_canvas.configure(scrollregion=self.chat_canvas.bbox("all")))
        self.messages_frame.grid_columnconfigure(0, minsize=600)

        input_frame = Frame(self.chat_container, bg='#2d2d2d')
        input_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=(0, 10), padx=10)

        self.user_input = tb.Entry(input_frame, font=('Arial', 12), bootstyle="light")
        self.user_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        self.user_input.bind("<Return>", lambda e: self.send_message())

        self.speak_btn = tb.Button(input_frame, text="🎤 Speak", command=self.recognize_speech, bootstyle="warning")
        self.speak_btn.pack(side=tk.RIGHT, padx=(5, 0))

        send_btn = tb.Button(input_frame, text="Send", command=self.send_message, bootstyle="primary")
        send_btn.pack(side=tk.RIGHT)

    def send_message(self):
        """Handle sending a message."""
        # This is just a placeholder; you can add functionality to send messages.
        pass

    def recognize_speech(self):
        """Handle speech recognition."""
        # Placeholder for speech recognition functionality.
        pass

    def update_scroll_region(self, event=None):
        """Updates the scroll region of the chat canvas."""
        self.chat_canvas.configure(scrollregion=self.chat_canvas.bbox("all"))

    def bind_mouse_scroll(self):
        """Ensures smooth scrolling across platforms."""
        self.chat_canvas.bind_all("<MouseWheel>", lambda e: self.chat_canvas.yview_scroll(int(-1*(e.delta/120)), "units"))
        self.chat_canvas.bind_all("<Button-4>", lambda e: self.chat_canvas.yview_scroll(-1, "units"))
        self.chat_canvas.bind_all("<Button-5>", lambda e: self.chat_canvas.yview_scroll(1, "units"))

    def on_mouse_wheel(self, event):
        """Enables scrolling with the mouse wheel."""
        self.canvas.yview_scroll(-1 * (event.delta // 120), "units")


if __name__ == '__main__':
    root = tk.Tk()
    root.title("Dashboard")
    root.geometry("800x600")
    app = DashboardPage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()
