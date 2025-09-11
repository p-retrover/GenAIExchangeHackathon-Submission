from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    # Note: We're not storing the password in the DB model yet.
    # This is a placeholder for when you add the `hashed_password` column.
    db_user = User(
        email=user.email,
        name=user.name
        # hashed_password=hashed_password  <-- Add this once your User model has the column
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user