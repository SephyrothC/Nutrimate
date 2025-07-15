from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.recipe import Recipe, MealType
from app.models.user import User
from app.schemas.recipe import RecipeCreate, RecipeUpdate
from fastapi import HTTPException, status

class RecipeService:
    @staticmethod
    def get_user_recipes(
        db: Session, 
        user_id: int, 
        meal_type: Optional[MealType] = None,
        is_favorite: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Recipe]:
        query = db.query(Recipe).filter(Recipe.user_id == user_id)
        
        if meal_type:
            query = query.filter(Recipe.meal_type == meal_type)
        
        if is_favorite is not None:
            query = query.filter(Recipe.is_favorite == is_favorite)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def create_recipe(db: Session, recipe_data: RecipeCreate, user_id: int) -> Recipe:
        db_recipe = Recipe(
            **recipe_data.dict(),
            user_id=user_id
        )
        db.add(db_recipe)
        db.commit()
        db.refresh(db_recipe)
        return db_recipe
    
    @staticmethod
    def get_recipe(db: Session, recipe_id: int, user_id: int) -> Recipe:
        recipe = db.query(Recipe).filter(
            Recipe.id == recipe_id,
            Recipe.user_id == user_id
        ).first()
        
        if not recipe:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipe not found"
            )
        return recipe
    
    @staticmethod
    def update_recipe(db: Session, recipe_id: int, user_id: int, recipe_data: RecipeUpdate) -> Recipe:
        recipe = RecipeService.get_recipe(db, recipe_id, user_id)
        
        update_data = recipe_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(recipe, field, value)
        
        db.commit()
        db.refresh(recipe)
        return recipe
    
    @staticmethod
    def delete_recipe(db: Session, recipe_id: int, user_id: int):
        recipe = RecipeService.get_recipe(db, recipe_id, user_id)
        db.delete(recipe)
        db.commit()
        
    @staticmethod
    def toggle_favorite(db: Session, recipe_id: int, user_id: int) -> Recipe:
        recipe = RecipeService.get_recipe(db, recipe_id, user_id)
        recipe.is_favorite = not recipe.is_favorite
        db.commit()
        db.refresh(recipe)
        return recipe
