import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi import status
from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Interest, User, user_interests

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio

# Helper function from previous tests to get auth headers
async def get_auth_headers(async_client: AsyncClient) -> Dict[str, str]:
    email = "interest_test@example.com"
    password = "a-strong-password"
    
    await async_client.post(
        "/api/v1/users/",
        json={"email": email, "name": "Interest User", "password": password},
    )
    login_response = await async_client.post(
        "/api/v1/auth/login", data={"username": email, "password": password}
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest_asyncio.fixture
async def seed_interests(db_session: AsyncSession) -> List[Dict]:
    """Fixture to seed the database with some interests for testing."""
    interests_to_create = [
        Interest(name="Artificial Intelligence & ML", category="Technology"),
        Interest(name="Software Development", category="Technology"),
        Interest(name="Graphic Design & UI/UX", category="Creative"),
        Interest(name="Startups & Entrepreneurship", category="Business"),
    ]
    db_session.add_all(interests_to_create)
    await db_session.commit()

    # --- THE FIX ---
    # After committing, the objects are "expired". We need to refresh them
    # to load their new state from the DB, including the auto-generated IDs.
    for i in interests_to_create:
        await db_session.refresh(i)
    
    # Now that they are refreshed, we can safely access their attributes.
    return [
        {"id": i.id, "name": i.name, "category": i.category}
        for i in interests_to_create
    ]


async def test_read_all_interests(
    async_client: AsyncClient, seed_interests: List[Dict]
):
    """
    Tests that the public GET /interests endpoint returns the seeded list of interests.
    """
    response = await async_client.get("/api/v1/interests/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify that the number of returned interests matches what we seeded
    assert len(data) == len(seed_interests)
    # Verify the structure of the first item
    response_names = {item["name"] for item in data}
    seeded_names = {interest["name"] for interest in seed_interests} # Use dict access
    assert response_names == seeded_names


async def test_update_my_interests(
    async_client: AsyncClient, db_session: AsyncSession, seed_interests: List[Dict]
):
    """
    Tests that a logged-in user can successfully update their interests.
    """
    headers = await get_auth_headers(async_client)
    
    # Select the first and third interests to associate with the user
    interests_to_select = [seed_interests[0]["id"], seed_interests[2]["id"]]
    
    response = await async_client.put(
        "/api/v1/interests/me",
        json={"interest_ids": interests_to_select},
        headers=headers,
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    
    # Verify the response contains the two interests we selected
    assert len(data) == 2
    assert {item["id"] for item in data} == set(interests_to_select)

    # For final verification, let's query the database directly
    # to ensure the relationship was written to the junction table.
    user_result = await db_session.execute(select(User).where(User.email == "interest_test@example.com"))
    user = user_result.scalar_one()
    
    junction_result = await db_session.execute(
        select(user_interests).where(user_interests.c.user_id == user.id)
    )
    user_interest_rows = junction_result.all()
    
    assert len(user_interest_rows) == 2
    assert {row.interest_id for row in user_interest_rows} == set(interests_to_select)