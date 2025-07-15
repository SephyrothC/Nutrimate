from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.menu import (
    MenuResponse, MenuCreate, MenuUpdate, MenuGenerate, MenuWithRecipes
)
from app.services.menu_service import MenuService
from app.services.recipe_service import RecipeService
from app.services.ai_service import AIService

router = APIRouter()

@router.get("/", response_model=List[MenuResponse])
def get_menus(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer tous les menus de l'utilisateur"""
    return MenuService.get_user_menus(db, current_user.id)

@router.post("/generate")
async def generate_menu(
    generate_data: MenuGenerate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Générer un menu hebdomadaire automatiquement"""
    
    # Récupérer les recettes existantes de l'utilisateur
    user_recipes = RecipeService.get_user_recipes(db, current_user.id)
    
    if len(user_recipes) < 7:  # Minimum pour une semaine basique
        raise HTTPException(
            status_code=400,
            detail="You need at least 7 recipes to generate a weekly menu. Please create more recipes first."
        )
    
    # Convertir en format pour l'IA
    recipes_data = []
    for recipe in user_recipes:
        recipes_data.append({
            "id": recipe.id,
            "title": recipe.title,
            "meal_type": recipe.meal_type.value,
            "tags": recipe.tags or []
        })
    
    # Générer le menu via IA
    menu_data = await AIService.generate_weekly_menu(
        current_user,
        recipes_data,
        generate_data.preferences
    )
    
    # Sauvegarder le menu
    menu_create = MenuCreate(
        week_start_date=generate_data.week_start_date,
        menu_data=menu_data
    )
    
    new_menu = MenuService.create_menu(db, menu_create, current_user.id)
    
    # Retourner avec détails des recettes
    return MenuService.get_menu_with_recipes(db, new_menu.id, current_user.id)

@router.post("/", response_model=MenuResponse)
def create_menu(
    menu_data: MenuCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Créer un nouveau menu manuellement"""
    return MenuService.create_menu(db, menu_data, current_user.id)

@router.get("/{menu_id}")
def get_menu_details(
    menu_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer un menu avec les détails des recettes"""
    return MenuService.get_menu_with_recipes(db, menu_id, current_user.id)

@router.put("/{menu_id}", response_model=MenuResponse)
def update_menu(
    menu_id: int,
    menu_data: MenuUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour un menu existant"""
    return MenuService.update_menu(db, menu_id, current_user.id, menu_data)
