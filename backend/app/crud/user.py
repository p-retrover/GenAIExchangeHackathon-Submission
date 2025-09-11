# app/crud/user.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.hashing import get_password_hash, verify_password

# --- User Retrieval Functions ---

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Fetches a user by their email address."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    """
    [NEW] Fetches a user by their primary key (ID). This is essential for our
    JWT decoding in security.py.
    Eagerly loads their relationships to minimize DB hits.
    """
    query = (
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.profile),
            selectinload(User.interests)
        )
    )
    result = await db.execute(query)
    return result.scalars().first()

# --- User Authentication and Creation Functions ---
async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    """
    [NEW] Authenticates a user.
    1. Fetches the user by email.
    2. Verifies the provided password against the stored hash.
    Returns the user object on success, None on failure.
    """
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    """
    [REFINED] Creates a new user in the database.
    The check for an existing user is now expected to be handled in the API layer.
    """
    hashed_password = get_password_hash(user_in.password)

    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hashed_password,
        # If you have roles, you can assign default roles here
        # roles=[default_role]  # assuming you have a default_role defined
        # If you want to assign roles, you'll need to fetch them from the DB first
        # If you add new columns to User model, set them here as well
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user
