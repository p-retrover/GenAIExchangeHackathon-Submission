from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user_profile import UserProfile, UserProfileCreate, UserProfileUpdate
from app import crud
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/me", response_model=UserProfile)
async def read_profile_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = await crud.user_profile.get_by_user_id(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=UserProfile)
async def update_profile_me(
    profile_in: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = await crud.user_profile.get_by_user_id(db, current_user.id)
    if not profile:
        profile = await crud.user_profile.create(db, current_user.id, UserProfileCreate(**profile_in.model_dump()))
    else:
        profile = await crud.user_profile.update(db, profile, profile_in)
    return profile
