# backend/app/api/v1/routes/ai.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

# --- Core Application Imports ---
from app.db.session import get_db
from app.models.user import User
from app.core.security import get_current_user as get_current_active_user
from app.services.analysis import analysis_service

# --- AI Module Imports ---
from app.ai.core import get_career_recommendations, get_learning_roadmap
# --- FIX: Import the new Unified and Payload schemas ---
from app.schemas.ai import (
    UnifiedAIResponse,
    RecommendationPayload,
    RoadmapPayload,
    AIRoadmapRequest,
)

router = APIRouter()

@router.post(
    "/recommendations",
    response_model=UnifiedAIResponse, # <-- CHANGE #1: Use the unified model
    summary="Generate AI Career Recommendations",
    description="Analyzes the logged-in user's assessment and generates personalized career recommendations using a specialist AI agent.",
)
async def create_ai_recommendations(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> UnifiedAIResponse: # <-- CHANGE #2: Update the return type hint
    """
    Orchestrates the full AI recommendation pipeline.
    """
    career_profile = await analysis_service.generate_profile_from_db(
        db, user=current_user
    )
    if not career_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No assessment found. Please complete the Career Compass first.",
        )

    await db.refresh(current_user, ['profile', 'interests'])
    
    user_data = {
        "bio": current_user.profile.bio if current_user.profile else "Not provided.",
        "interests": [interest.name for interest in current_user.interests]
    }
    
    ai_result = await get_career_recommendations(career_profile, user_data)

    if "error" in ai_result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ai_result["error"],
        )
    
    # --- CHANGE #3: Wrap the result in the payload and the unified response ---
    payload = RecommendationPayload(**ai_result)
    return UnifiedAIResponse(data=payload)

@router.post(
    "/roadmaps",
    response_model=UnifiedAIResponse, # <-- CHANGE #4: Use the unified model
    summary="Generate AI Learning Roadmap",
    description="Generates a detailed, week-by-week learning roadmap for a specified career role using a specialist AI agent.",
)
async def create_ai_roadmap(
    request_body: AIRoadmapRequest,
    current_user: User = Depends(get_current_active_user),
) -> UnifiedAIResponse: # <-- CHANGE #5: Update the return type hint
    """
    Orchestrates the full AI roadmap pipeline.
    """
    ai_result = await get_learning_roadmap(
        role_title=request_body.role_title, weeks=request_body.weeks
    )

    if "error" in ai_result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ai_result["error"],
        )

    # --- CHANGE #6: Wrap the result in the payload and the unified response ---
    payload = RoadmapPayload(**ai_result)
    return UnifiedAIResponse(data=payload)

# Your deprecated endpoints can remain as they are.