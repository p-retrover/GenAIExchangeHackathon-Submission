# satori/backend/app/ai/agents/mentor_agent.py

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from app.core.config import settings
from app.utils.prompt_loader import load_system_prompt_from_yaml 
from pathlib import Path
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser

# --- Load the prompt from the YAML file ---
APP_DIR = Path(__file__).resolve().parent.parent.parent
PROMPT_CONFIG_PATH = APP_DIR / "ai" / "prompts" / "satori_system_prompt.yaml"
mentor_system_prompt_template = load_system_prompt_from_yaml(str(PROMPT_CONFIG_PATH))

# --- Initialize the core components ---
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0.7,
)

prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(mentor_system_prompt_template),
    MessagesPlaceholder(variable_name="chat_history"),
    HumanMessagePromptTemplate.from_template("{user_input}")
])

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# --- THIS IS THE DEBUGGING FUNCTION ---
def inspect_chain_input(data_dict):
    print("\n--- DATA GOING INTO PROMPT TEMPLATE ---")
    # We print the keys to see if 'roadmap_context' is present
    print(f"Keys available: {data_dict.keys()}")
    # We check the length of the context to see if it's empty
    if 'roadmap_context' in data_dict:
        print(f"Length of roadmap_context: {len(data_dict['roadmap_context'])}")
    print("--- END OF DATA INSPECTION ---\n")
    return data_dict # It's crucial to return the data to continue the chain

# --- NEW DEBUGGING FUNCTION TO SHOW THE FULL SYSTEM PROMPT ---
def inspect_prompt_render(inputs):
    rendered = prompt.format_prompt(**inputs)  # Fill placeholders
    message = rendered.to_messages()
    print("\n--- FULL SYSTEM PROMPT (with roadmap_context injected) ---")
    for msg in message:
        if msg.type == "system":
            print(f"\n[System Prompt]\n{msg.content}\n")
        elif msg.type == "human":
            print(f"[Human Input]\n{msg.content}\n")
    print("--- END OF PROMPT ---\n")
    return inputs  # important: return the original dict


# --- NEW: The modern LCEL Chain ---
# This chain uses the pipe operator '|' to connect the components.
# It's more explicit about how data flows through the system.
mentor_chain = (
    RunnablePassthrough.assign(
        # The 'assign' step explicitly loads memory before the prompt.
        # It takes the input dict, calls the memory's load function,
        # and adds the result to the dict under the key 'chat_history'.
        chat_history=lambda x: memory.load_memory_variables(x).get("chat_history", [])
    )
    | RunnableLambda(inspect_prompt_render) # NEW debugging step to show full prompt
    | RunnableLambda(inspect_chain_input) # Debugging step to inspect inputs
    | prompt
    | llm
    | StrOutputParser() # A simple parser that just gets the string output
)