from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app import crud
from app.db.session import get_db
from app.core.security import get_current_user
from app.models import User
from app.schemas.interest import InterestRead, UserInterestUpdate

router = APIRouter()

@router.get("/", response_model=List[InterestRead])
async def read_all_interests(
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all available interests for the frontend to display.
    This is a public endpoint.
    """
    interests = await crud.interest.get_all_interests(db)
    return interests


@router.put("/me", response_model=List[InterestRead])
async def update_my_interests(
    *,
    db: AsyncSession = Depends(get_db),
    interests_in: UserInterestUpdate,
    current_user: User = Depends(get_current_user),
):
    """
    Update the interests for the currently authenticated user.
    This is a protected endpoint.
    """
    updated_user = await crud.interest.update_user_interests(
        db, user_id=current_user.id, interest_ids=interests_in.interest_ids
    )
    
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user.interests