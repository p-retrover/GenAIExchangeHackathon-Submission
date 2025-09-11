import pytest
from httpx import AsyncClient
from fastapi import status
from typing import Dict

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio


async def get_auth_headers(
    async_client: AsyncClient, user_num: int = 1
) -> Dict[str, str]:
    """
    Helper function to create a user, log in, and return auth headers.
    """
    email = f"testuser{user_num}@example.com"
    password = "a-strong-password"
    
    # Ensure user exists for login
    await async_client.post(
        "/api/v1/users/",
        json={"email": email, "name": f"Test User {user_num}", "password": password},
    )

    # Log the user in to get a token using the CORRECT URL
    login_response = await async_client.post(
        "/api/v1/auth/login", data={"username": email, "password": password}
    )
    
    # This will raise an error if the login failed, giving a clearer message
    login_response.raise_for_status() 
    
    token_data = login_response.json()
    access_token = token_data["access_token"]
    
    return {"Authorization": f"Bearer {access_token}"}


async def test_read_profile_unauthenticated(async_client: AsyncClient):
    # This test is fine and should pass
    response = await async_client.get("/api/v1/profiles/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


async def test_read_own_profile_not_found_for_new_user(async_client: AsyncClient):
    """
    Tests that a new user gets a 404 for their profile.
    """
    # Use the helper to get headers for an authenticated user
    headers = await get_auth_headers(async_client, user_num=1)
    response = await async_client.get("/api/v1/profiles/me", headers=headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND


async def test_update_own_profile_creates_profile(async_client: AsyncClient):
    """
    Tests that a PUT request can CREATE a profile for a new user.
    """
    headers = await get_auth_headers(async_client, user_num=2)
    profile_data = {"display_name": "New User", "bio": "A test bio."}

    response = await async_client.put(
        "/api/v1/profiles/me", json=profile_data, headers=headers
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["display_name"] == profile_data["display_name"]


async def test_update_own_profile_updates_existing_profile(async_client: AsyncClient):
    """
    Tests that a PUT request can UPDATE an existing profile.
    """
    headers = await get_auth_headers(async_client, user_num=3)
    
    # First, create a profile
    await async_client.put(
        "/api/v1/profiles/me", json={"display_name": "Initial"}, headers=headers
    )

    # Now, update it
    updated_data = {"display_name": "Updated"}
    response = await async_client.put(
        "/api/v1/profiles/me", json=updated_data, headers=headers
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["display_name"] == "Updated"