from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Import CORS

from app.core.config import settings
from app.api.v1.api import api_router # <-- THIS IS THE KEY CHANGE #1: Import the manager
from app.api.v1.routes import auth, users

app = FastAPI(title=settings.PROJECT_NAME)

# --- Add CORS Middleware ---
# This allows your React frontend (e.g., on localhost:3000) to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"], # Add your frontend origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)
# -------------------------

# --- Delegate to the V1 API Router ---
# <-- THIS IS THE KEY CHANGE #2: Include the main manager router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    # A simple root endpoint to verify the API is running
    return {"status" : "ok", "message": "Welcome to the Satori API!"}
