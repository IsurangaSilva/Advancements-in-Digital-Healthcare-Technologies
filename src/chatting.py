import tkinter as tk
import requests
import json
from concurrent.futures import ThreadPoolExecutor

class ChattingPage(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent, bg="#000D2E")
        
        self.executor = ThreadPoolExecutor(max_workers=5) 
        self.chat_sessions = {} 

        title_label = tk.Label(self, text="Recommendation Chat", font=("Helvetica", 30, "bold"), bg="#000D2E", fg="#F1F1F1")
        title_label.pack(pady=(40, 20), side=tk.TOP)

        chat_frame = tk.Frame(self, bg="#000D2E")
        chat_frame.pack(expand=True, fill=tk.BOTH)

        self.scrollbar = tk.Scrollbar(chat_frame)
        self.scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.chat_area = tk.Text(chat_frame, font=("Helvetica", 16), fg="white", bg="#000D2E", wrap=tk.WORD,
                                 yscrollcommand=self.scrollbar.set, height=20, padx=60, pady=30)
        self.chat_area.pack(expand=True, fill=tk.BOTH)
        self.chat_area.config(state=tk.DISABLED)  

        self.scrollbar.config(command=self.chat_area.yview)
        bottom_frame = tk.Frame(self, bg="#000D2E")
        bottom_frame.pack(side=tk.BOTTOM, fill=tk.X)
        self.message_text = tk.Entry(bottom_frame, font=("Helvetica", 20), width=40)
        self.message_text.pack(side=tk.LEFT, pady=10, padx=(420, 5))
        send_button = tk.Button(bottom_frame, text="Send", font=("Helvetica", 16), command=self.send_message, bg="green", fg="white")   
        send_button.pack(side=tk.LEFT, pady=10, padx=(5, 10))
        clear_button = tk.Button(bottom_frame, text="Clear Chat", font=("Helvetica", 16), command=self.clear_chat,bg="red", fg="white")
        clear_button.pack(side=tk.LEFT, pady=10, padx=(5, 10))

    def send_message(self):
        message = self.message_text.get()

        if message:
            self.update_chat_area("You", message)  
            self.message_text.delete(0, tk.END)

    
            session_token = self.get_session_token()
            self.executor.submit(self.get_recommendation, session_token, message)

    def get_session_token(self):
        """
        Generate or retrieve an existing session token for a chat.
        """
        return "chat_session_1"

    def get_recommendation(self, session_token, message):
        """
        Function to get recommendation from the OpenRouter API.
        This handles simultaneous requests.
        """
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": "Bearer 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", 
                "Content-Type": "application/json",
                "HTTP-Referer": "<YOUR_SITE_URL>", 
                "X-Title": "<YOUR_SITE_NAME>",
            }

            payload = {
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "user", 
                        "content": message 
                    }
                ],
            }

           
            response = requests.post(url, headers=headers, data=json.dumps(payload))

            if response.status_code == 200:
                data = response.json()
                recommendation = data.get("choices", [{}])[0].get("message", {}).get("content", "Sorry, I couldn't process your request.")
                self.update_chat_area(session_token, recommendation)
            else:
                self.update_chat_area(session_token, f"Error: {response.status_code} - {response.text}")

        except Exception as e:
            print(f"Error with OpenRouter API: {e}")
            self.update_chat_area(session_token, "Sorry, I couldn't process your request.")

    def update_chat_area(self, session_token, message):
        """
        Update the chat area with the response.
        This method is thread-safe and is used to display the response from the API.
        """
        self.chat_area.config(state=tk.NORMAL) 
        self.chat_area.insert(tk.END, f"{session_token}: {message}\n")
        self.chat_area.config(state=tk.DISABLED)  
        self.chat_area.yview(tk.END)  

    def clear_chat(self):
        """
        Clear the entire chat history from the chat area.
        """
        self.chat_area.config(state=tk.NORMAL) 
        self.chat_area.delete(1.0, tk.END)  
        self.chat_area.config(state=tk.DISABLED) 
        self.message_text.delete(0, tk.END)  

if __name__ == '__main__':
    root = tk.Tk()
    root.geometry("1920x1080")
    root.title("Chatting with AI")
    root.config(bg="#2F3A4A")
    app = ChattingPage(root, None)
    app.pack(fill=tk.BOTH, expand=True)
    root.mainloop()
