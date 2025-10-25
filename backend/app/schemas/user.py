from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional

#  --- User Base Schema ---
class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None

# --- Schema for User Creation ---
# Used when creating a new user via the API
class UserCreate(UserBase):
    password: str

# --- Schema for Reading User Data ---
# Used when returning user data via the API (excludes sensitive info)
class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    # Use model_config instead of class Config
    # Ensure this is present so Pydantic can read from the SQLAlchemy model
    model_config = ConfigDict(from_attributes=True)
