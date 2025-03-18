# chat_ui.py
import tkinter as tk

def create_widgets(app, main_frame):
    """Creates the chat UI using only standard tkinter widgets."""
    app.chat_container = tk.Frame(main_frame, bg='#000D2E', width=app.min_chat_width)
    app.chat_container.pack(fill='both', expand=True)
    app.chat_container.pack_propagate(False)

    app.scrollbar = tk.Scrollbar(main_frame, orient='vertical')
    app.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    app.chat_canvas = tk.Canvas(
        app.chat_container,
        bg='#000D2E',
        highlightthickness=0,
        bd=0,
        yscrollcommand=app.scrollbar.set,
        
    )
    app.chat_canvas.pack(fill=tk.BOTH, expand=True)
    app.scrollbar.config(command=app.chat_canvas.yview)

    app.messages_frame = tk.Frame(app.chat_canvas, bg='#000D2E')
    app.canvas_window = app.chat_canvas.create_window((0, 0), window=app.messages_frame, anchor='n')
    app.messages_frame.bind(
        "<Configure>", 
        lambda event: app.chat_canvas.configure(scrollregion=app.chat_canvas.bbox("all"))
    )
    app.messages_frame.grid_columnconfigure(0, minsize=app.min_chat_width)

    input_frame = tk.Frame(app.chat_container, bg='#000D2E')
    input_frame.pack(side=tk.BOTTOM, fill=tk.X, pady=(0, 10), padx=10)

    app.user_input = tk.Entry(
        input_frame, 
        font=('Arial',15), 
        bg='#1E1E2E', 
        fg='white', 
        insertbackground='white',
        width=75
    )
    app.user_input.pack(side=tk.LEFT, padx=(0, 5)) 
    app.user_input.bind("<Return>", lambda e: app.send_message())


    app.speak_btn = tk.Button(
        input_frame, 
        text="🎤 Speak", 
        font=('Arial', 12),
        command=app.recognize_speech, 
        bg='#EAC94F', 
        fg='white', 
        bd=0,
        activebackground='#EAC94F'
    )
    app.speak_btn.pack(side=tk.LEFT, padx=(0, 5))

    send_btn = tk.Button(
        input_frame, 
        text="Send", 
        font=('Arial', 12),
        command=app.send_message, 
        bg='#4CAF50', 
        fg='white', 
        bd=0,
        activebackground='#4CAF50'
    )
    send_btn.pack(side=tk.LEFT, padx=(0, 5))

def update_scroll_region(app, event=None):
    """Updates the scroll region of the chat canvas."""
    app.chat_canvas.configure(scrollregion=app.chat_canvas.bbox("all"))

def bind_mouse_scroll(app):
    """Ensures smooth scrolling across platforms."""
    app.chat_canvas.bind_all(
        "<MouseWheel>", 
        lambda e: app.chat_canvas.yview_scroll(int(-1*(e.delta/120)), "units")
    )
    app.chat_canvas.bind_all("<Button-4>", lambda e: app.chat_canvas.yview_scroll(-1, "units"))
    app.chat_canvas.bind_all("<Button-5>", lambda e: app.chat_canvas.yview_scroll(1, "units"))