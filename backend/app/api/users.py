from fastapi import APIRouter, Depends
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Alias pour récupérer le profil utilisateur"""
    return current_user