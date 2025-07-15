from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime, date

class MenuBase(BaseModel):
    week_start_date: date
    menu_data: Dict[str, Dict[str, Optional[int]]]
    # Structure: {"monday": {"breakfast": 1, "lunch": 2, "dinner": 3}, ...}

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    menu_data: Optional[Dict[str, Dict[str, Optional[int]]]] = None

class MenuResponse(MenuBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class MenuGenerate(BaseModel):
    week_start_date: date
    preferences: Optional[str] = None  # Préférences spécifiques pour cette semaine

class MenuWithRecipes(BaseModel):
    """Réponse enrichie avec les détails des recettes"""
    id: int
    user_id: int
    week_start_date: date
    created_at: datetime
    menu_data: Dict[str, Dict[str, Any]]  # Contient les objets Recipe complets
    
    class Config:
        from_attributes = True
