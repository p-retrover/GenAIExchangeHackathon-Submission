from pydantic import BaseModel, ConfigDict
from typing import Optional

class UserProfileBase(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileInDBBase(UserProfileBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class UserProfile(UserProfileInDBBase):
    pass
