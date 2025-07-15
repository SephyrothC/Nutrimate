from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import DietaryGoal

class UserBase(BaseModel):
    email: EmailStr
    username: str
    age: Optional[int] = None
    dietary_goal: Optional[DietaryGoal] = DietaryGoal.HEALTHY_EATING
    preferences_prompt: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    age: Optional[int] = None
    dietary_goal: Optional[DietaryGoal] = None
    preferences_prompt: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[int] = None
