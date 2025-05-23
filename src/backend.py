from fastapi import FastAPI
from pydantic import BaseModel
import os
import uvicorn
import time
import logging
from model_manager import ModelManager

app = FastAPI()

# Path to the GGUF model
MODEL_PATH = os.path.abspath("models/unsloth.Q4_K_M.gguf")

# Use lazy loading for model - don't load it yet
model_manager = ModelManager()
llm = None

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("backend")

# Let startup be fast
@app.on_event("startup")
async def startup_event():
    logger.info("FastAPI backend started")

class ChatRequest(BaseModel):
    history: list[str] = []   # List of conversation history messages (e.g. "[USER]: Hi", "[ASSISTANT]: Hello")
    message: str              # The latest user message

@app.post("/chat")
async def chat(request: ChatRequest):
    global llm
    
    # Lazy load model when needed
    if llm is None:
        logger.info("Loading LLM model on first use")
        start_time = time.time()
        llm = model_manager.get_model('llm', MODEL_PATH, use_mmap=True, verbose=False)
        logger.info(f"Model loaded in {time.time() - start_time:.2f} seconds")
    
    system_prompt = (
        "You are a professional AI assistant. Provide accurate, concise responses limited to 1-2 sentences. "
        "Use clear, polite language tailored to the query. If unclear, ask for clarification briefly."
    )
    # Build the full prompt with context:
    prompt = f"[SYSTEM]: {system_prompt}\n"
    for item in request.history:
        prompt += item + "\n"
    prompt += f"[USER]: {request.message}\n[ASSISTANT]:"

    response = llm(
        prompt,
        max_tokens=50,  # Further reduced for very short responses
        temperature=0.6,  # Slightly lower for precision
        top_p=0.85,  # Tightened for focused output
        top_k=30,  # Lowered for concise word choice
        repeat_penalty=1.3,  # Increased to avoid repetition
        stop=["[USER]:", "\n[ASSISTANT]:"]
    )

    text = response["choices"][0]["text"].strip()
    return {"response": text if text else "Sorry, I couldn't respond. Try again."}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)