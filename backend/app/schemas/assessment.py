# app/schemas/assessment.py
from pydantic import BaseModel, ConfigDict
from typing import List

# --- Schemas for Reading Data (API -> Client) ---

class ChoiceOut(BaseModel):
    # This schema is needed to show choices to the user
    id: int
    text: str
    model_config = ConfigDict(from_attributes=True)

class QuestionOut(BaseModel):
    id: int
    text: str
    type: str
    category: str
    choices: List[ChoiceOut] # A question now has choices
    model_config = ConfigDict(from_attributes=True)

class AssessmentOut(BaseModel):
    id: int
    title: str
    description: str | None
    questions: List[QuestionOut] = []
    model_config = ConfigDict(from_attributes=True)

# --- Schemas for Writing Data (Client -> API) ---

class UserAnswerIn(BaseModel):
    # THE FIX: The input now expects a choice_id, not answer_text.
    question_id: int
    choice_id: int

class AssessmentSubmit(BaseModel):
    answers: List[UserAnswerIn]

# --- Schema for Submission Response ---

class SubmissionResponse(BaseModel):
    message: str
    response_id: int