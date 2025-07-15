"""Script pour peupler la base de données avec des données de test"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models.user import User, DietaryGoal
from app.models.recipe import Recipe, MealType
from datetime import datetime

def seed_database():
    db = SessionLocal()
    
    try:
        # Créer un utilisateur de test
        test_user = User(
            email="test@nutrimate.com",
            username="Test User",
            password_hash=get_password_hash("password123"),
            age=25,
            dietary_goal=DietaryGoal.HEALTHY_EATING,
            preferences_prompt="J'aime les plats rapides et équilibrés, pas de fruits de mer"
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        # Créer quelques recettes de test
        sample_recipes = [
            {
                "title": "Salade de quinoa aux légumes",
                "ingredients": [
                    {"name": "quinoa", "quantity": "100", "unit": "g"},
                    {"name": "tomates cerises", "quantity": "150", "unit": "g"},
                    {"name": "concombre", "quantity": "1", "unit": "pcs"},
                    {"name": "feta", "quantity": "50", "unit": "g"}
                ],
                "steps": [
                    "Cuire le quinoa selon les instructions",
                    "Couper les légumes en dés",
                    "Mélanger tous les ingrédients",
                    "Assaisonner avec huile d'olive et citron"
                ],
                "meal_type": MealType.LUNCH,
                "prep_time": 15,
                "cook_time": 15,
                "servings": 2,
                "tags": ["healthy", "végétarien", "rapide"]
            },
            {
                "title": "Omelette aux champignons",
                "ingredients": [
                    {"name": "œufs", "quantity": "3", "unit": "pcs"},
                    {"name": "champignons", "quantity": "100", "unit": "g"},
                    {"name": "beurre", "quantity": "10", "unit": "g"},
                    {"name": "gruyère", "quantity": "30", "unit": "g"}
                ],
                "steps": [
                    "Faire revenir les champignons",
                    "Battre les œufs",
                    "Cuire l'omelette dans la poêle",
                    "Ajouter le fromage et plier"
                ],
                "meal_type": MealType.DINNER,
                "prep_time": 10,
                "cook_time": 8,
                "servings": 1,
                "tags": ["rapide", "protéiné"]
            }
        ]
        
        for recipe_data in sample_recipes:
            recipe = Recipe(
                user_id=test_user.id,
                **recipe_data
            )
            db.add(recipe)
        
        db.commit()
        print("✅ Base de données peuplée avec succès!")
        
    except Exception as e:
        print(f"❌ Erreur lors du peuplement: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()