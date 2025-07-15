from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.recipe import MealType
from app.schemas.recipe import (
    RecipeResponse, RecipeCreate, RecipeUpdate, RecipeGenerate
)
from app.services.recipe_service import RecipeService
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/", response_model=List[RecipeResponse])
def get_recipes(
    meal_type: Optional[MealType] = Query(None),
    is_favorite: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer les recettes de l'utilisateur avec filtres"""
    return RecipeService.get_user_recipes(
        db, current_user.id, meal_type, is_favorite, skip, limit
    )

@router.post("/generate", response_model=List[RecipeResponse])
async def generate_recipes(
    generate_data: RecipeGenerate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Générer des recettes via IA"""
    if generate_data.count < 1 or generate_data.count > 10:
        raise HTTPException(status_code=400, detail="Count must be between 1 and 10")
    
    # Générer via IA
    ai_recipes = await AIService.generate_recipes(
        current_user,
        generate_data.count,
        generate_data.meal_type,
        generate_data.additional_constraints
    )
    
    # Convertir et retourner les recettes (sans les sauvegarder automatiquement)
    recipes_response = []
    for recipe_data in ai_recipes:
        recipes_response.append(RecipeResponse(
            id=0,  # Temporaire, pas encore sauvegardé
            user_id=current_user.id,
            title=recipe_data["title"],
            ingredients=recipe_data["ingredients"],
            steps=recipe_data["steps"],
            meal_type=recipe_data["meal_type"],
            prep_time=recipe_data.get("prep_time"),
            cook_time=recipe_data.get("cook_time"),
            servings=recipe_data.get("servings", 2),
            tags=recipe_data.get("tags", []),
            is_favorite=False,
            created_at=None  # Sera défini lors de la sauvegarde
        ))
    
    return recipes_response

@router.post("/", response_model=RecipeResponse)
def create_recipe(
    recipe_data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Sauvegarder une nouvelle recette"""
    return RecipeService.create_recipe(db, recipe_data, current_user.id)

@router.get("/{recipe_id}", response_model=RecipeResponse)
def get_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer une recette spécifique"""
    return RecipeService.get_recipe(db, recipe_id, current_user.id)

@router.put("/{recipe_id}", response_model=RecipeResponse)
def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour une recette"""
    return RecipeService.update_recipe(db, recipe_id, current_user.id, recipe_data)

@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Supprimer une recette"""
    RecipeService.delete_recipe(db, recipe_id, current_user.id)
    return {"message": "Recipe deleted successfully"}

@router.put("/{recipe_id}/favorite", response_model=RecipeResponse)
def toggle_favorite(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Basculer le statut favori d'une recette"""
    return RecipeService.toggle_favorite(db, recipe_id, current_user.id)
