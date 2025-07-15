import httpx
import json
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.models.user import User
from app.models.recipe import MealType
from fastapi import HTTPException

class AIService:
    @staticmethod
    async def generate_recipes(
        user: User, 
        count: int, 
        meal_type: Optional[MealType] = None,
        additional_constraints: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Génère des recettes via DeepSeek API"""
        
        # Construction du prompt personnalisé
        base_prompt = f"""
        Tu es un chef cuisinier expert. Génère {count} recette(s) personnalisée(s) pour :
        
        Profil utilisateur :
        - Âge : {user.age or 'non précisé'}
        - Objectif : {user.dietary_goal.value if user.dietary_goal else 'alimentation équilibrée'}
        - Préférences : {user.preferences_prompt or 'aucune préférence spéciale'}
        
        Contraintes :
        - Type de repas : {meal_type.value if meal_type else 'tout type'}
        - Contraintes supplémentaires : {additional_constraints or 'aucune'}
        
        Format de réponse OBLIGATOIRE (JSON strict) :
        {{
            "recipes": [
                {{
                    "title": "Nom de la recette",
                    "ingredients": [
                        {{"name": "ingrédient", "quantity": "quantité", "unit": "unité"}},
                        {{"name": "ingrédient2", "quantity": "quantité", "unit": "unité"}}
                    ],
                    "steps": [
                        "Étape 1 détaillée",
                        "Étape 2 détaillée"
                    ],
                    "meal_type": "{meal_type.value if meal_type else 'lunch'}",
                    "prep_time": 15,
                    "cook_time": 30,
                    "servings": 2,
                    "tags": ["tag1", "tag2"]
                }}
            ]
        }}
        
        IMPORTANT : 
        - Réponds UNIQUEMENT en JSON valide
        - Évite les doublons de recettes
        - Adapte selon le profil utilisateur
        - Assure-toi que chaque recette soit réalisable
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.deepseek_api_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [
                            {"role": "user", "content": base_prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    },
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    raise HTTPException(status_code=500, detail="AI service unavailable")
                
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]
                
                # Parser la réponse JSON
                recipes_data = json.loads(content)
                return recipes_data["recipes"]
                
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Invalid AI response format")
        except httpx.TimeoutException:
            raise HTTPException(status_code=500, detail="AI service timeout")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    
    @staticmethod
    async def generate_weekly_menu(
        user: User,
        existing_recipes: List[Dict[str, Any]],
        preferences: Optional[str] = None
    ) -> Dict[str, Dict[str, int]]:
        """Génère un menu hebdomadaire en utilisant les recettes existantes"""
        
        recipes_context = "\n".join([
            f"ID {r['id']}: {r['title']} ({r['meal_type']}) - {r.get('tags', [])}"
            for r in existing_recipes
        ])
        
        prompt = f"""
        Créer un menu hebdomadaire équilibré pour :
        
        Profil : {user.preferences_prompt or 'aucune préférence'}
        Préférences spéciales : {preferences or 'aucune'}
        
        Recettes disponibles :
        {recipes_context}
        
        Répondre UNIQUEMENT en JSON :
        {{
            "menu": {{
                "monday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "tuesday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "wednesday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "thursday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "friday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "saturday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}},
                "sunday": {{"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id}}
            }}
        }}
        
        Utilise les IDs des recettes disponibles. Assure la variété et l'équilibre.
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.deepseek_api_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.deepseek_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "deepseek-chat",
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.5,
                        "max_tokens": 1000
                    }
                )
                
                ai_response = response.json()
                content = ai_response["choices"][0]["message"]["content"]
                menu_data = json.loads(content)
                return menu_data["menu"]
                
        except Exception as e:
            # Fallback : menu simple avec rotation des recettes
            days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            breakfast_recipes = [r for r in existing_recipes if r["meal_type"] == "breakfast"]
            lunch_recipes = [r for r in existing_recipes if r["meal_type"] == "lunch"]
            dinner_recipes = [r for r in existing_recipes if r["meal_type"] == "dinner"]
            
            menu = {}
            for i, day in enumerate(days):
                menu[day] = {
                    "breakfast": breakfast_recipes[i % len(breakfast_recipes)]["id"] if breakfast_recipes else None,
                    "lunch": lunch_recipes[i % len(lunch_recipes)]["id"] if lunch_recipes else None,
                    "dinner": dinner_recipes[i % len(dinner_recipes)]["id"] if dinner_recipes else None
                }
            
            return menu
