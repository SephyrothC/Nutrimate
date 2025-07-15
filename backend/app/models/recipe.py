from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class MealType(str, enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"

class Recipe(Base):
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    ingredients = Column(JSON, nullable=False)  # [{"name": "tomate", "quantity": "2", "unit": "pcs"}]
    steps = Column(JSON, nullable=False)        # ["Étape 1", "Étape 2", ...]
    meal_type = Column(Enum(MealType), nullable=False)
    prep_time = Column(Integer, nullable=True)  # en minutes
    cook_time = Column(Integer, nullable=True)  # en minutes
    servings = Column(Integer, default=2)
    tags = Column(JSON, nullable=True)          # ["rapide", "healthy", "végétarien"]
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    user = relationship("User", back_populates="recipes")
