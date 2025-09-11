# tests/test_assessments.py
import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Dict

from app.models.assessment import Assessment, Question, Choice, AssessmentResponse

@pytest_asyncio.fixture(scope="function")
async def seed_assessment_with_choices(db_session: AsyncSession) -> Dict:
    """
    Seeds the DB and returns an inert dictionary of IDs.
    Uses flush() to safely populate primary keys without expiring objects.
    """
    assessment = Assessment(
        title="Test Assessment",
        questions=[
            Question(text="Q1", category="C1", choices=[
                Choice(text="C1A", weight=1.0, archetype="A"),
                Choice(text="C1B", weight=4.0, archetype="B")
            ]),
            Question(text="Q2", category="C2", choices=[
                Choice(text="C2A", weight=5.0, archetype="C")
            ])
        ]
    )
    db_session.add(assessment)
    await db_session.flush()
    return {
        "id": assessment.id,
        "questions": [
            {"id": q.id, "choices": [{"id": c.id} for c in q.choices]}
            for q in assessment.questions
        ],
    }

@pytest.mark.asyncio
async def test_submit_assessment_success(
    async_client: AsyncClient, 
    db_session: AsyncSession, 
    seed_assessment_with_choices: Dict,
    test_user_auth_headers: Dict
):
    """Tests that a logged-in user can successfully submit their answers."""
    assessment_id = seed_assessment_with_choices["id"]
    questions = seed_assessment_with_choices["questions"]
    
    choice_id_q1 = questions[0]["choices"][1]["id"]
    choice_id_q2 = questions[1]["choices"][0]["id"]

    submission_data = {"answers": [
        {"question_id": questions[0]["id"], "choice_id": choice_id_q1},
        {"question_id": questions[1]["id"], "choice_id": choice_id_q2},
    ]}
    
    response = await async_client.post(
        f"/api/v1/assessments/{assessment_id}/submit",
        json=submission_data,
        headers=test_user_auth_headers,
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Assessment submitted successfully."
    
    # THE FINAL FIX: Eagerly load the response and its 'answers' relationship
    # before performing assertions on the relationship.
    stmt = (
        select(AssessmentResponse)
        .where(AssessmentResponse.id == data["response_id"])
        .options(selectinload(AssessmentResponse.answers))
    )
    result = await db_session.execute(stmt)
    res = result.scalar_one()

    assert res is not None
    assert len(res.answers) == 2