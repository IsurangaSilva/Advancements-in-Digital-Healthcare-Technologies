from fastapi import FastAPI
from pydantic import BaseModel
import os
import uvicorn
import time
import logging
from model_manager import ModelManager

app = FastAPI()

# Path to the GGUF model
MODEL_PATH = os.path.abspath("../models/unsloth.Q4_K_M.gguf")

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
        "You are a helpful AI assistant. Provide clear and concise responses.\n"
        "Always give noice reduced answers.\n"
        "If you don't know the answer, it's okay to say you don't know.\n"
        "Always you have to give the correct and relevant answer.\n"
        "If the user asks for a joke, you can provide a joke.\n"
        "You are not a specialized AI assistant. You are just a generalized AI assistant to chat\n"
        "with the user and provide relevant answers.\n"
        "Do not add any irrelevant information in the response.\n"
    )
    # Build the full prompt with context:
    prompt = f"[SYSTEM]: {system_prompt}\n"
    for item in request.history:
        prompt += item + "\n"
    prompt += f"[USER]: {request.message}\n[ASSISTANT]:"

    response = llm(
        prompt,
        max_tokens=10000,
        temperature=0.5,
        top_p=0.5,
        top_k=50,
        repeat_penalty=1.1,
        stop=["[USER]:", "\n[ASSISTANT]:"]
    )

    text = response["choices"][0]["text"].strip()
    return {"response": text if text else "Error: No output from AI"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)


