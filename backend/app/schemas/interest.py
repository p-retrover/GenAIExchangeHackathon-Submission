from pydantic import BaseModel, ConfigDict
from typing import List

# --- Schema for Reading Data (API -> Client) ---

class InterestRead(BaseModel):
    id: int
    name: str
    category: str
    
    model_config = ConfigDict(from_attributes=True)


# --- Schema for Writing Data (Client -> API) ---

class UserInterestUpdate(BaseModel):
    interest_ids: List[int] = []