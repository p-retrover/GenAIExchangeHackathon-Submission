from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.models import User, Interest
from app.crud import user as crud_user

async def get_all_interests(db: AsyncSession) -> List[Interest]:
    """
    Retrieve all interest records from the database, ordered by category and name.
    """
    result = await db.execute(
        select(Interest).order_by(Interest.category, Interest.name)
    )
    return result.scalars().all()

async def update_user_interests(
    db: AsyncSession, *, user_id: int, interest_ids: List[int]
) -> User | None:
    """
    Updates the list of interests for a specific user ID.
    """
    user = await crud_user.get_user_by_id(db, user_id)
    if user is None:
        return None
    if interest_ids:
        result = await db.execute(select(Interest).where(Interest.id.in_(interest_ids)))
        new_interests = result.scalars().all()
    else:
        new_interests = []

    # 3. Assign the new interests and commit.
    user.interests = new_interests
    db.add(user)
    await db.commit()
    
    # 4. Return the user object. Its relationships are already loaded.
    updated_user = await crud_user.get_user_by_id(db, user_id)
    return user