# app/crud/assessment.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.models.assessment import Assessment, Question, Choice, AssessmentResponse, UserAnswer
from app.schemas.assessment import UserAnswerIn

async def get_assessment_by_id(db: AsyncSession, assessment_id: int) -> Assessment | None:
    """Retrieves an assessment and eagerly loads its questions and choices."""
    stmt = (
        select(Assessment)
        .where(Assessment.id == assessment_id)
        .options(selectinload(Assessment.questions).selectinload(Question.choices))
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def create_assessment_response(
    db: AsyncSession,
    *,
    user_id: int,
    assessment_id: int,
    answers: List[UserAnswerIn] # THE FIX: Expects a list of answers with choice_id
) -> AssessmentResponse:
    """Creates a new assessment response and its associated user answers."""
    db_response = AssessmentResponse(
        user_id=user_id,
        assessment_id=assessment_id
    )
    db.add(db_response)
    await db.flush() # Flush to get the ID for the answers

    for answer_in in answers:
        db_answer = UserAnswer(
            response_id=db_response.id,
            question_id=answer_in.question_id,
            choice_id=answer_in.choice_id # THE FIX: Saves the choice_id
        )
        db.add(db_answer)

    await db.commit()
    await db.refresh(db_response)
    return db_response