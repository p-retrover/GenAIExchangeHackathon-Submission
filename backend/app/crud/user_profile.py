from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate, UserProfileUpdate

# CRUD stubs
async def get_by_user_id(db: AsyncSession, user_id: int) -> UserProfile | None:
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    return result.scalar_one_or_none()

async def create(db: AsyncSession, user_id: int, obj_in: UserProfileCreate) -> UserProfile:
    db_obj = UserProfile(user_id=user_id, **obj_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def update(db: AsyncSession, db_obj: UserProfile, obj_in: UserProfileUpdate) -> UserProfile:
    for field, value in obj_in.model_dump(exclude_unset=True).items():
        setattr(db_obj, field, value)
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
# You can add more CRUD operations as needed
