# backend/app/db/base.py
"""
Central place for Alembic to import all models.

This file imports the Base class and all SQLAlchemy models.
That way, Alembic's `env.py` only needs to import Base here,
and it will automatically see all tables.
"""

from app.db.base_class import Base  # the declarative Base class
from app.models.user import User  # Import all your models here
from app.models.user_profile import UserProfile  # Import UserProfile model