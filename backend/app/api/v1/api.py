from fastapi import APIRouter
from app.api.v1 import routes # Import your other routers here


api_router = APIRouter()

api_router.include_router(routes.auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(routes.users.router, prefix="/users", tags=["users"])
# api_router.include_router(roadmaps.router, prefix="/roadmaps", tags=["roadmaps"])
api_router.include_router(routes.ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(routes.user_profile.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(routes.interests.router, prefix="/interests", tags=["interests"])
api_router.include_router(routes.assessments.router, prefix="/assessments", tags=["assessments"])
api_router.include_router(routes.mentor.router, prefix="/mentor", tags=["mentor"])