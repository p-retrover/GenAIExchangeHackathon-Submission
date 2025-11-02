# tests/api/test_ai_routes.py
import pytest
from httpx import AsyncClient
from typing import Dict

# --- MOCK DATA ---
MOCK_GEMINI_RECOMMENDATION = {"roles": [{"role_id": "data_analyst", "title": "Data Analyst", "fit": 0.8, "feasibility": 0.7, "opportunity": 0.9, "overall": 85, "pros": [], "cons": []}]}
MOCK_GEMINI_ROADMAP = {"role_title": "Data Scientist", "total_weeks": 4, "weekly_plan": [{"week": 1, "theme": "Mock Foundations", "objectives": [], "resources": []}]}

@pytest.mark.asyncio
async def test_create_ai_recommendations_success(
    async_client: AsyncClient, monkeypatch, test_user_auth_headers: Dict[str, str]
):
    """Tests the POST /ai/recommendations endpoint, mocking the lowest-level AI call."""
    # FIX: Mock the actual external call, not our own functions
    async def mock_generate_json_response(prompt: str):
        return MOCK_GEMINI_RECOMMENDATION
    
    from app.ai.models import gemini_client
    monkeypatch.setattr(gemini_client.gemini_client, "generate_json_response", mock_generate_json_response)
    
    # Mock the analysis service as it's a separate dependency for this endpoint
    async def mock_generate_profile(db, user):
        return {"Investigative": 4.5}
    from app.services import analysis
    monkeypatch.setattr(analysis.analysis_service, "generate_profile_from_db", mock_generate_profile)

    response = await async_client.post("/api/v1/ai/recommendations", headers=test_user_auth_headers)
    
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["roles"][0]["role_id"] == "data_analyst"

@pytest.mark.asyncio
async def test_create_ai_roadmap_success(
    async_client: AsyncClient, monkeypatch, test_user_auth_headers: Dict[str, str]
):
    """Tests the POST /ai/roadmaps endpoint, mocking the lowest-level AI call."""
    # FIX: Mock the actual external call
    async def mock_generate_json_response(prompt: str):
        return MOCK_GEMINI_ROADMAP
    
    from app.ai.models import gemini_client
    monkeypatch.setattr(gemini_client.gemini_client, "generate_json_response", mock_generate_json_response)

    request_payload = {"role_title": "Data Scientist", "weeks": 4}
    
    response = await async_client.post(
        "/api/v1/ai/roadmaps", 
        json=request_payload,
        headers=test_user_auth_headers
    )
    
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["role_title"] == "Data Scientist"