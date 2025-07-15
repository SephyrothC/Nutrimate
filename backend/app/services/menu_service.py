from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import date
from app.models.menu import WeeklyMenu
from app.models.recipe import Recipe
from app.schemas.menu import MenuCreate, MenuUpdate
from fastapi import HTTPException, status

class MenuService:
    @staticmethod
    def get_user_menus(db: Session, user_id: int) -> List[WeeklyMenu]:
        return db.query(WeeklyMenu).filter(WeeklyMenu.user_id == user_id).all()
    
    @staticmethod
    def create_menu(db: Session, menu_data: MenuCreate, user_id: int) -> WeeklyMenu:
        db_menu = WeeklyMenu(
            **menu_data.dict(),
            user_id=user_id
        )
        db.add(db_menu)
        db.commit()
        db.refresh(db_menu)
        return db_menu
    
    @staticmethod
    def get_menu_with_recipes(db: Session, menu_id: int, user_id: int) -> Dict[str, Any]:
        menu = db.query(WeeklyMenu).filter(
            WeeklyMenu.id == menu_id,
            WeeklyMenu.user_id == user_id
        ).first()
        
        if not menu:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        # Enrichir avec les détails des recettes
        enriched_menu_data = {}
        for day, meals in menu.menu_data.items():
            enriched_menu_data[day] = {}
            for meal_type, recipe_id in meals.items():
                if recipe_id:
                    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
                    enriched_menu_data[day][meal_type] = {
                        "id": recipe.id,
                        "title": recipe.title,
                        "prep_time": recipe.prep_time,
                        "cook_time": recipe.cook_time,
                        "servings": recipe.servings
                    } if recipe else None
                else:
                    enriched_menu_data[day][meal_type] = None
        
        return {
            "id": menu.id,
            "user_id": menu.user_id,
            "week_start_date": menu.week_start_date,
            "created_at": menu.created_at,
            "menu_data": enriched_menu_data
        }
    
    @staticmethod
    def update_menu(db: Session, menu_id: int, user_id: int, menu_data: MenuUpdate) -> WeeklyMenu:
        menu = db.query(WeeklyMenu).filter(
            WeeklyMenu.id == menu_id,
            WeeklyMenu.user_id == user_id
        ).first()
        
        if not menu:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        update_data = menu_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(menu, field, value)
        
        db.commit()
        db.refresh(menu)
        return menu
