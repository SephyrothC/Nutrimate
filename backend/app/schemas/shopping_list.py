from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ShoppingItemBase(BaseModel):
    name: str
    quantity: str
    category: str
    checked: bool = False

class ShoppingListBase(BaseModel):
    items: List[Dict[str, Any]]
    # Structure: [{"name": "Tomates", "quantity": "6 pcs", "category": "Légumes", "checked": false}]

class ShoppingListCreate(ShoppingListBase):
    menu_id: int

class ShoppingListUpdate(BaseModel):
    items: Optional[List[Dict[str, Any]]] = None
    is_active: Optional[bool] = None

class ShoppingListResponse(ShoppingListBase):
    id: int
    menu_id: int
    user_id: int
    generated_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class ShoppingItemUpdate(BaseModel):
    item_index: int  # Index de l'item dans la liste
    checked: Optional[bool] = None
    quantity: Optional[str] = None

class ShoppingListGenerate(BaseModel):
    menu_id: int