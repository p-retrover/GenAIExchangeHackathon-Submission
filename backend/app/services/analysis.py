# app/services/analysis.py

from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

# Import all the necessary models
from app.models.user import User
from app.models.assessment import AssessmentResponse, UserAnswer, Choice


class AnalysisService:
    """
    Analyzes a user's raw assessment answers from the database and generates
    a structured, weighted "Career Profile."
    """

    async def generate_profile_from_db(
        self, db: AsyncSession, user: User
    ) -> Dict[str, float]:
        """
        Fetches the user's latest assessment, processes the answers, and
        calculates a weighted score for each career archetype.

        Args:
            db: The async database session.
            user: The authenticated user object.

        Returns:
            A dictionary representing the user's Career Profile.
            Example: {"Investigative": 4.5, "Artistic": 2.0, ...}
        """
        # 1. Fetch the user's most recent assessment response.
        # We eagerly load the 'answers' and each answer's selected 'choice'
        # to prevent follow-up database queries inside the loop (N+1 problem).
        stmt = (
            select(AssessmentResponse)
            .where(AssessmentResponse.user_id == user.id)
            .order_by(AssessmentResponse.created_at.desc())
            .options(selectinload(AssessmentResponse.answers).selectinload(UserAnswer.choice))
            .limit(1)
        )
        result = await db.execute(stmt)
        latest_response = result.scalar_one_or_none()

        if not latest_response or not latest_response.answers:
            # Return an empty profile if no assessment is found
            return {}

        # 2. Process the answers to generate the scored profile.
        career_profile: Dict[str, float] = {}
        
        for answer in latest_response.answers:
            if not answer.choice:
                # Skip if for some reason an answer has no choice linked
                continue
            
            archetype = answer.choice.archetype
            weight = answer.choice.weight

            # Add the weight of the chosen option to the corresponding archetype's score
            career_profile[archetype] = career_profile.get(archetype, 0.0) + weight

        return career_profile


# Instantiate the service for use in our API routes
analysis_service = AnalysisService()