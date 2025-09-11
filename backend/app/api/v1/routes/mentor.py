from fastapi import APIRouter, HTTPException
import json

from app.schemas.ai import UnifiedAIResponse, MentorChatPayload
from app.schemas.mentor import ChatRequest
from app.ai.agents.mentor_agent import mentor_chain

router = APIRouter()

@router.post("/chat", response_model=UnifiedAIResponse)
async def handle_chat(request: ChatRequest) -> UnifiedAIResponse:
    """
    Handles a chat message from the user, invokes the LangChain mentor agent,
    and returns the AI's response in our unified format.
    """
    print("\n--- MENTOR CHAT ENDPOINT TRIGGERED ---")
    try:
        print("[CHECKPOINT 1] Creating inputs dictionary...")
        inputs = {
            "user_input": request.user_input,
            "roadmap_context": json.dumps(request.roadmap_context, indent=2)
        }
        print("[CHECKPOINT 2] Inputs created. Invoking mentor_chain...")

        # Use the async 'ainvoke' method for our async endpoint
        ai_reply = await mentor_chain.ainvoke(inputs)
        print("[CHECKPOINT 3] mentor_chain invocation complete.")

        # The result from the new agent is a direct string, no .get() needed
        payload = MentorChatPayload(reply=ai_reply)
        print(f"[CHECKPOINT 4] Payload created: {payload}")

        print("[CHECKPOINT 5] UnifiedAIResponse created. Returning to user.")
        return UnifiedAIResponse(data=payload)

    except Exception as e:
        print(f"An error occurred in the mentor chat endpoint: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while processing the chat.")