import tkinter as tk
import ttkbootstrap as tb
from ttkbootstrap.constants import *

def create_widgets(self):
    """Creates the chat UI."""
    main_frame = tk.Frame(self, bg='#2d2d2d')
    main_frame.pack(fill='both', expand=True)

    self.scrollbar = tb.Scrollbar(main_frame, orient='vertical')
    self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    self.chat_container = tk.Frame(main_frame, bg='#2d2d2d', width=self.min_chat_width)
    self.chat_container.place(relx=0.5, rely=0, anchor='n', relheight=1.0)
    self.chat_container.pack_propagate(False)

    self.chat_canvas = tk.Canvas(
        self.chat_container,
        bg='#2d2d2d',
        highlightthickness=0,
        bd=0,
        yscrollcommand=self.scrollbar.set
    )
    self.chat_canvas.pack(fill=tk.BOTH, expand=True)
    self.scrollbar.config(command=self.chat_canvas.yview)

    self.messages_frame = tk.Frame(self.chat_canvas, bg='#2d2d2d')
    self.canvas_window = self.chat_canvas.create_window((0, 0), window=self.messages_frame, anchor='n')
    self.messages_frame.bind("<Configure>", lambda event: self.chat_canvas.configure(scrollregion=self.chat_canvas.bbox("all")))
    self.messages_frame.grid_columnconfigure(0, minsize=self.min_chat_width)

    input_frame = tk.Frame(self.chat_container, bg='#2d2d2d')
    input_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=(0, 10), padx=10)

    self.user_input = tb.Entry(input_frame, font=('Arial', 12), bootstyle="light")
    self.user_input.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
    self.user_input.bind("<Return>", lambda e: self.send_message())

    self.speak_btn = tb.Button(input_frame, text="🎤 Speak", command=self.recognize_speech, bootstyle="warning")
    self.speak_btn.pack(side=tk.RIGHT, padx=(5, 0))

    send_btn = tb.Button(input_frame, text="Send", command=self.send_message, bootstyle="primary")
    send_btn.pack(side=tk.RIGHT)

def update_scroll_region(self, event=None):
    """Updates the scroll region of the chat canvas."""
    self.chat_canvas.configure(scrollregion=self.chat_canvas.bbox("all"))

def bind_mouse_scroll(self):
    """Ensures smooth scrolling across platforms."""
    self.chat_canvas.bind_all("<MouseWheel>", lambda e: self.chat_canvas.yview_scroll(int(-1*(e.delta/120)), "units"))
    self.chat_canvas.bind_all("<Button-4>", lambda e: self.chat_canvas.yview_scroll(-1, "units"))
    self.chat_canvas.bind_all("<Button-5>", lambda e: self.chat_canvas.yview_scroll(1, "units"))