from __future__ import annotations
from sqlalchemy import String, Boolean, func, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from datetime import datetime

from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(50)) # Removed unique=True
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # --- Relationships for our core features ---
    profile: Mapped["UserProfile"] = relationship(
        back_populates="user", cascade="all, delete-orphan", uselist=False
    )
    assessment_responses: Mapped[List["AssessmentResponse"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    interests: Mapped[List["Interest"]] = relationship(
        secondary="user_interests", back_populates="users"
    )