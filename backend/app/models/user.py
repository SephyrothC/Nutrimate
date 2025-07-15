from sqlalchemy import Column, Integer, String, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class DietaryGoal(str, enum.Enum):
    WEIGHT_LOSS = "weight_loss"
    MUSCLE_GAIN = "muscle_gain"
    MAINTENANCE = "maintenance"
    HEALTHY_EATING = "healthy_eating"
    QUICK_MEALS = "quick_meals"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    age = Column(Integer, nullable=True)
    dietary_goal = Column(Enum(DietaryGoal), default=DietaryGoal.HEALTHY_EATING)
    preferences_prompt = Column(Text, nullable=True)  # Prompt IA personnalisé
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    recipes = relationship("Recipe", back_populates="user", cascade="all, delete-orphan")
    menus = relationship("WeeklyMenu", back_populates="user", cascade="all, delete-orphan")
    shopping_lists = relationship("ShoppingList", back_populates="user", cascade="all, delete-orphan")
