# backend/app/schemas/ai.py
from pydantic import BaseModel, Field
from typing import Dict, List, Union, Literal

# --- PAYLOAD MODELS (Your existing models, slightly renamed for clarity) ---

class AIRoadmapRequest(BaseModel):
    """The request model for generating an AI learning roadmap."""
    role_title: str = Field(...)
    weeks: int = Field(12, description="The desired duration of the roadmap in weeks.")


class RoleRecommendationPayload(BaseModel):
    role_id: str
    title: str
    fit_reason: str
    pros: List[str]
    cons: List[str]
    opportunity_score: float
    feasibility_score: float

class RecommendationPayload(BaseModel):
    roles: List[RoleRecommendationPayload]

class RoadmapResourcePayload(BaseModel):
    type: str
    title: str
    url: str

class RoadmapWeekPayload(BaseModel):
    week: int
    theme: str
    objectives: List[str]
    resources: List[RoadmapResourcePayload]

class RoadmapPayload(BaseModel):
    role_title: str
    total_weeks: int
    overview: str
    weekly_plan: List[RoadmapWeekPayload]

class MentorChatPayload(BaseModel):
    reply: str

# --- THE UNIFIED WRAPPER ---
# This will now be the main response model for all successful AI endpoints.

class UnifiedAIResponse(BaseModel):
    status: Literal["success"] = "success"
    # The 'data' field will contain one of our specific payloads
    data: Union[
        RecommendationPayload,
        RoadmapPayload,
        MentorChatPayload
    ]

