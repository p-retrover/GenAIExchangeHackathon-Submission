from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def create_llm():
    """
    Initializes the Google Gemini LLM with our specific settings.
    """
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=0.7,
    )
    return llm

# Create a single, shared instance of the LLM for the entire application
llm = create_llm()