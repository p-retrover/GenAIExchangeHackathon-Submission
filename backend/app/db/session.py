from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# --- Database Engine Setup ---
# Construct the async database URL
# Ensure the driver is asyncpg for async operations
ASYNC_SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://"
)

engine = create_async_engine(
    ASYNC_SQLALCHEMY_DATABASE_URL,
    echo=settings.DB_ECHO_LOG # Enable SQL query logging if specified in settings
)

# --- Session Factory ---
# Create a configured "AsyncSession" class
# Use async_sessionmaker for async context
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

# --- Dependency for API Routes ---

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a database session to API routes.
    Ensures the session is properly closed after use.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
