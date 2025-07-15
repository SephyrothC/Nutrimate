from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.recipe import MealType

class IngredientBase(BaseModel):
    name: str
    quantity: str
    unit: Optional[str] = None

class RecipeBase(BaseModel):
    title: str
    ingredients: List[Dict[str, Any]]  # [{"name": "tomate", "quantity": "2", "unit": "pcs"}]
    steps: List[str]
    meal_type: MealType
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: int = 2
    tags: Optional[List[str]] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    ingredients: Optional[List[Dict[str, Any]]] = None
    steps: Optional[List[str]] = None
    meal_type: Optional[MealType] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = None

class RecipeResponse(RecipeBase):
    id: int
    user_id: int
    is_favorite: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class RecipeGenerate(BaseModel):
    count: int = 1  # Nombre de recettes à générer (1-10)
    meal_type: Optional[MealType] = None
    additional_constraints: Optional[str] = None  # Contraintes supplémentaires
