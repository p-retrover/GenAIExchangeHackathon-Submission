from pydantic import BaseModel
from typing import List, Dict, Any

class ChatRequest(BaseModel):
    user_input: str
    roadmap_context: Dict[str, Any]
