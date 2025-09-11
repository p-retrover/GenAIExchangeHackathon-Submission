# app/api/v1/routes/assessments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app import crud
from app.db.session import get_db
from app.core.security import get_current_user as get_current_active_user
from app.models import User
from app.models.assessment import Assessment, Question, Choice
from app.schemas.assessment import AssessmentOut, AssessmentSubmit, SubmissionResponse

router = APIRouter()

# It is placed BEFORE the "/{assessment_id}" route to ensure it's matched correctly.
@router.get("/latest", response_model=AssessmentOut)
async def read_latest_assessment(db: AsyncSession = Depends(get_db)):
    """
    Get the most recently created assessment.
    """
    result = await db.execute(
        select(Assessment)
        .options(selectinload(Assessment.questions).selectinload(Question.choices))
        .order_by(Assessment.id.desc())
        .limit(1)
    )
    latest_assessment = result.scalars().first()
    
    if not latest_assessment:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No assessments found in the database.",
        )
    return latest_assessment

@router.get("/{assessment_id}", response_model=AssessmentOut)
async def read_assessment(
    assessment_id: int, db: AsyncSession = Depends(get_db)
):
    assessment = await crud.assessment.get_assessment_by_id(db, assessment_id=assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    return assessment


@router.post("/{assessment_id}/submit", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def submit_assessment(
    assessment_id: int,
    *,
    db: AsyncSession = Depends(get_db),
    submission_in: AssessmentSubmit,
    current_user: User = Depends(get_current_active_user),
):
    """Submit answers for an assessment for the currently authenticated user."""
    response = await crud.assessment.create_assessment_response(
        db,
        # THE FIX: This now correctly matches the new CRUD function signature
        user_id=current_user.id,
        assessment_id=assessment_id,
        answers=submission_in.answers
    )
    if not response:
        raise HTTPException(status_code=400, detail="Could not process submission.")

    return SubmissionResponse(
        message="Assessment submitted successfully.",
        response_id=response.id
    )