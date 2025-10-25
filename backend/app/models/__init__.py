# app/models/__init__.py

# CORRECTED: Point to the actual location of your Base class
from app.db.base_class import Base 

# --- The rest of your models ---
from .user import User
from .user_profile import UserProfile
from .assessment import Assessment, Question, AssessmentResponse, UserAnswer
from .interest import Interest, user_interests

__all__ = [
    "Base",
    "User",
    "UserProfile",
    "Assessment",
    "Question",
    "AssessmentResponse",
    "UserAnswer",
    "Interest",
    "user_interests",
]