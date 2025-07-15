from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.shopping_list import ShoppingList
from app.models.menu import WeeklyMenu
from app.models.recipe import Recipe
from app.schemas.shopping_list import ShoppingListCreate, ShoppingListUpdate
from fastapi import HTTPException, status
from collections import defaultdict

class ShoppingService:
    @staticmethod
    def generate_from_menu(db: Session, menu_id: int, user_id: int) -> ShoppingList:
        # Récupérer le menu
        menu = db.query(WeeklyMenu).filter(
            WeeklyMenu.id == menu_id,
            WeeklyMenu.user_id == user_id
        ).first()
        
        if not menu:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        # Collecter tous les ingrédients
        all_ingredients = defaultdict(lambda: {"quantity": 0, "unit": "", "category": ""})
        
        for day, meals in menu.menu_data.items():
            for meal_type, recipe_id in meals.items():
                if recipe_id:
                    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
                    if recipe and recipe.ingredients:
                        for ingredient in recipe.ingredients:
                            name = ingredient["name"]
                            quantity = ingredient.get("quantity", "1")
                            unit = ingredient.get("unit", "")
                            
                            # Logique de consolidation simplifiée
                            if all_ingredients[name]["quantity"] == 0:
                                all_ingredients[name] = {
                                    "quantity": quantity,
                                    "unit": unit,
                                    "category": ShoppingService._categorize_ingredient(name)
                                }
                            else:
                                # Pour l'instant, on additionne simplement
                                current_qty = all_ingredients[name]["quantity"]
                                all_ingredients[name]["quantity"] = f"{current_qty} + {quantity}"
        
        # Convertir en format liste
        shopping_items = []
        for name, details in all_ingredients.items():
            shopping_items.append({
                "name": name.capitalize(),
                "quantity": details["quantity"],
                "category": details["category"],
                "checked": False
            })
        
        # Trier par catégorie
        shopping_items.sort(key=lambda x: (x["category"], x["name"]))
        
        # Supprimer l'ancienne liste active s'il y en a une
        db.query(ShoppingList).filter(
            ShoppingList.user_id == user_id,
            ShoppingList.is_active == True
        ).update({"is_active": False})
        
        # Créer la nouvelle liste
        shopping_list = ShoppingList(
            menu_id=menu_id,
            user_id=user_id,
            items=shopping_items,
            is_active=True
        )
        
        db.add(shopping_list)
        db.commit()
        db.refresh(shopping_list)
        return shopping_list
    
    @staticmethod
    def _categorize_ingredient(ingredient_name: str) -> str:
        """Catégorise un ingrédient selon son nom"""
        ingredient_lower = ingredient_name.lower()
        
        if any(word in ingredient_lower for word in ["tomate", "carotte", "oignon", "courgette", "poivron", "salade", "épinard"]):
            return "Légumes"
        elif any(word in ingredient_lower for word in ["pomme", "banane", "orange", "citron", "fraise"]):
            return "Fruits"
        elif any(word in ingredient_lower for word in ["poulet", "bœuf", "porc", "poisson", "saumon", "thon"]):
            return "Protéines"
        elif any(word in ingredient_lower for word in ["lait", "yaourt", "fromage", "beurre", "crème"]):
            return "Produits laitiers"
        elif any(word in ingredient_lower for word in ["riz", "pâtes", "pain", "farine", "quinoa"]):
            return "Féculents"
        elif any(word in ingredient_lower for word in ["huile", "vinaigre", "sel", "poivre", "ail", "persil"]):
            return "Condiments"
        else:
            return "Autres"
    
    @staticmethod
    def get_user_shopping_lists(db: Session, user_id: int) -> List[ShoppingList]:
        return db.query(ShoppingList).filter(ShoppingList.user_id == user_id).all()
    
    @staticmethod
    def update_shopping_item(
        db: Session, 
        shopping_list_id: int, 
        user_id: int, 
        item_index: int,
        checked: bool = None,
        quantity: str = None
    ) -> ShoppingList:
        shopping_list = db.query(ShoppingList).filter(
            ShoppingList.id == shopping_list_id,
            ShoppingList.user_id == user_id
        ).first()
        
        if not shopping_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Shopping list not found"
            )
        
        if item_index >= len(shopping_list.items):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid item index"
            )
        
        # Mettre à jour l'item
        if checked is not None:
            shopping_list.items[item_index]["checked"] = checked
        if quantity is not None:
            shopping_list.items[item_index]["quantity"] = quantity
        
        # Marquer comme modifié pour SQLAlchemy
        db.merge(shopping_list)
        db.commit()
        db.refresh(shopping_list)
        
        return shopping_list