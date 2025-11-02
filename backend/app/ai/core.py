# backend/app/ai/core.py

from typing import Dict, Any
# Import the new agent
from app.ai.agents.recommendation_agent import recommendation_agent
from app.ai.agents.roadmap_agent import roadmap_agent

async def get_career_recommendations(
    career_profile: Dict[str, float], user_data: Dict[str, Any]
) -> dict:
    """
    Orchestrates the career recommendation process by invoking the specialist agent.
    """
    if not career_profile:
        return {"error": "User's career profile is not available."}

    # Delegate the complex AI task to the specialized agent
    recommendations = await recommendation_agent.run(career_profile, user_data)
    
    return recommendations

async def get_learning_roadmap(role_title: str, weeks: int = 12) -> dict:
    """
    Orchestrates the learning roadmap generation process by invoking the specialist agent.
    """
    if not role_title:
        return {"error": "Role title must be provided to generate a roadmap."}

    # Delegate the complex AI task to the specialized agent
    roadmap = await roadmap_agent.run(role_title, weeks)
    
    return roadmap

# The old `recommend_careers` function is now replaced by the one above.
# We keep `generate_roadmap` for now, to be replaced by the RoadmapAgent later.