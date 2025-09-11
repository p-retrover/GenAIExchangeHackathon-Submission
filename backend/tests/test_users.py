import pytest
from httpx import AsyncClient
from fastapi import status

# Mark all tests in this file as async
pytestmark = pytest.mark.asyncio

async def test_register_user_success(async_client: AsyncClient):
    """
    Tests successful user registration with all fields provided.
    """
    response = await async_client.post(
        "/api/v1/users/",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "a-strong-password"
        }
    )
    # Check that the request was successful
    assert response.status_code == status.HTTP_201_CREATED
    
    # Check that the returned data is correct and complete
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
    assert "id" in data
    
    # NEW: Verify that the new timestamp fields are present in the response
    assert "created_at" in data
    assert "updated_at" in data
    assert isinstance(data["created_at"], str) # Check that it's a string (ISO 8601 format)

async def test_register_user_success_no_name(async_client: AsyncClient):
    """
    Tests successful user registration when the optional 'name' field is omitted.
    """
    response = await async_client.post(
        "/api/v1/users/",
        json={
            "email": "test-no-name@example.com",
            "password": "a-strong-password"
        }
    )
    assert response.status_code == status.HTTP_201_CREATED
    
    data = response.json()
    assert data["email"] == "test-no-name@example.com"
    
    # NEW: Verify that the name is null (or None) as expected
    assert data["name"] is None
    assert "id" in data
    assert "created_at" in data

async def test_register_user_duplicate_email(async_client: AsyncClient):
    """
    Tests that registering a user with a duplicate email fails.
    This test's logic does not need to change.
    """
    # First, create a user
    await async_client.post(
        "/api/v1/users/",
        json={
            "email": "duplicate@example.com",
            "name": "Test User",
            "password": "a-strong-password"
        }
    )
    
    # Then, try to create another user with the same email
    response = await async_client.post(
        "/api/v1/users/",
        json={
            "email": "duplicate@example.com",
            "name": "Another User",
            "password": "another-password"
        }
    )
    
    # Check that the server correctly returns a 400 Bad Request error
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "A user with this email already exists" in response.json()["detail"]