# backend/app/models/assessment.py

from __future__ import annotations
from sqlalchemy import ForeignKey, String, Text, DateTime, JSON, func, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import List

from app.db.base_class import Base

class Assessment(Base):
    # ... (This model is unchanged)
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    questions: Mapped[List["Question"]] = relationship(back_populates="assessment", cascade="all, delete-orphan")
    responses: Mapped[List["AssessmentResponse"]] = relationship(back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    # --- ADDED A RELATIONSHIP TO CHOICES ---
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id", ondelete="CASCADE"))
    text: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String, default="multiple_choice") # Changed default for clarity
    category: Mapped[str | None] = mapped_column(String)
    tags: Mapped[list[str] | None] = mapped_column(JSON)

    assessment: Mapped["Assessment"] = relationship(back_populates="questions")
    answers: Mapped[List["UserAnswer"]] = relationship(back_populates="question", cascade="all, delete-orphan")
    choices: Mapped[List["Choice"]] = relationship(back_populates="question", cascade="all, delete-orphan") #<-- ADD THIS

# --- NEW MODEL: CHOICE ---
class Choice(Base):
    __tablename__ = "choices"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"))
    text: Mapped[str] = mapped_column(String, nullable=False) # e.g., "Strongly Agree"
    
    # This is the core data for our analysis service
    archetype: Mapped[str] = mapped_column(String, nullable=False) # e.g., "Investigative"
    weight: Mapped[float] = mapped_column(Float, nullable=False) # e.g., 2.0

    question: Mapped["Question"] = relationship(back_populates="choices")
    user_answers: Mapped[List["UserAnswer"]] = relationship(back_populates="choice")

class AssessmentResponse(Base):
    # ... (This model is unchanged)
    __tablename__ = "assessment_responses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="assessment_responses")
    assessment: Mapped["Assessment"] = relationship(back_populates="responses")
    answers: Mapped[List["UserAnswer"]] = relationship(back_populates="response", cascade="all, delete-orphan")

class UserAnswer(Base):
    # --- UPDATED TO LINK TO A CHOICE INSTEAD OF STORING TEXT ---
    __tablename__ = "user_answers"

    response_id: Mapped[int] = mapped_column(ForeignKey("assessment_responses.id", ondelete="CASCADE"), primary_key=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id", ondelete="CASCADE"), primary_key=True)
    
    # REMOVED: answer_text: Mapped[str] = mapped_column(Text)
    choice_id: Mapped[int] = mapped_column(ForeignKey("choices.id")) # <-- ADD THIS

    response: Mapped["AssessmentResponse"] = relationship(back_populates="answers")
    question: Mapped["Question"] = relationship(back_populates="answers")
    choice: Mapped["Choice"] = relationship(back_populates="user_answers") # <-- ADD THIS
