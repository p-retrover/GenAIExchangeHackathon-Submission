from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession # Import AsyncSession

# --- Core Dependencies ---
from app.core.security import get_current_user
from app.db.session import get_db # Import the async get_db dependency

# --- Models, Schemas ---
from app.models.user import User
from app.schemas.user import UserCreate, UserRead

# --- CRUD Operations ---
from app.crud.user import get_user_by_email, create_user

router = APIRouter()

# The route must be an async function to use `await`
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)):

    """
    Register a new user.

    -  Delegates user creation to the CRUD layer.
    -  **Checks for Existing User**: Prevents duplicate registrations by checking if a user with the same email already exists.
    -  **Returns 400 on Conflict**: If the email is already in use, it returns
        a clear HTTP 400 Bad Request error.
    -  **Creates User**: If the email is unique, it proceeds to create the user.
    """
    existing_user = await get_user_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )
    
    user = await create_user(db, user_in=user_in)
    return user

@router.get("/me", response_model=UserRead)
async def read_user_me(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the currently authenticated user's details.
    - **Protected Route**: Requires a valid JWT token.
    - **Returns User Info**: Provides the user's information as per the UserRead schema.
    """
    return current_user