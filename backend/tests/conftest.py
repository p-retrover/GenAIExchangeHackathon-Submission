import pytest_asyncio
from typing import AsyncGenerator, Dict
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
    AsyncEngine,
)
import asyncpg

from app.main import app
from app.core.config import settings
from app.core.security import create_access_token
from app.core.hashing import get_password_hash
from app.db.base_class import Base
from app.db.session import get_db
from app.models.user import User


@pytest_asyncio.fixture(scope="session", autouse=True)
async def ensure_test_database():
    """
    Ensure the test database exists before running any tests.
    Creates it if missing.
    """
    # Example TEST_DATABASE_URL:
    # postgresql+asyncpg://postgres:postgres@db:5432/satori_test
    db_url = settings.TEST_DATABASE_URL

    # asyncpg doesn't understand the dialect prefix, strip "+asyncpg"
    pg_url = db_url.replace("+asyncpg", "")

    # Split out base URL and DB name
    base_url, db_name = pg_url.rsplit("/", 1)
    default_db_url = f"{base_url}/postgres"

    conn = await asyncpg.connect(default_db_url)
    exists = await conn.fetchval(
        "SELECT 1 FROM pg_database WHERE datname = $1;", db_name
    )
    if not exists:
        await conn.execute(f'CREATE DATABASE "{db_name}";')
    await conn.close()


@pytest_asyncio.fixture(scope="function")
async def db_engine() -> AsyncGenerator[AsyncEngine, None]:
    """
    Fixture that creates a new SQLAlchemy engine for each test,
    and handles creation and teardown of the database schema.
    """
    engine = create_async_engine(settings.TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def db_session(db_engine: AsyncEngine) -> AsyncGenerator[AsyncSession, None]:
    """
    Fixture that provides a database session for a single test,
    using the test-specific engine.
    """
    TestingSessionLocal = async_sessionmaker(
        autocommit=False, autoflush=False, bind=db_engine
    )
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def async_client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Fixture to create an AsyncClient that uses the test database.
    """
    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope="function")
async def test_user_auth_headers(db_session: AsyncSession) -> Dict[str, str]:
    """
    Creates a temporary user in the test database and returns valid
    authentication headers for them.
    
    This fixture depends on your `db_session` fixture, so it will use
    the same isolated database session as the test function.
    """
    # 1. Create a test user
    test_email = "test.user@example.com"
    test_password = "a-secure-password"
    
    user = User(
        email=test_email,
        hashed_password=get_password_hash(test_password),
        is_active=True
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    
    # 2. Generate an access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    # 3. Return the headers
    return {"Authorization": f"Bearer {access_token}"}
