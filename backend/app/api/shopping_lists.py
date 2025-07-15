from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.schemas.shopping_list import (
    ShoppingListResponse, ShoppingListCreate, ShoppingListUpdate, 
    ShoppingItemUpdate, ShoppingListGenerate
)
from app.services.shopping_service import ShoppingService
from app.utils.pdf_generator import PDFGenerator
import tempfile
import os

router = APIRouter()

@router.get("/", response_model=List[ShoppingListResponse])
def get_shopping_lists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Récupérer toutes les listes de courses de l'utilisateur"""
    return ShoppingService.get_user_shopping_lists(db, current_user.id)

@router.post("/generate", response_model=ShoppingListResponse)
def generate_shopping_list(
    generate_data: ShoppingListGenerate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Générer une liste de courses à partir d'un menu"""
    return ShoppingService.generate_from_menu(db, generate_data.menu_id, current_user.id)

@router.put("/{shopping_list_id}/items/{item_index}")
def update_shopping_item(
    shopping_list_id: int,
    item_index: int,
    item_update: ShoppingItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mettre à jour un item de la liste de courses"""
    return ShoppingService.update_shopping_item(
        db, shopping_list_id, current_user.id, item_index,
        item_update.checked, item_update.quantity
    )

@router.get("/{shopping_list_id}/export")
def export_shopping_list_pdf(
    shopping_list_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Exporter la liste de courses en PDF"""
    from app.models.shopping_list import ShoppingList
    
    shopping_list = db.query(ShoppingList).filter(
        ShoppingList.id == shopping_list_id,
        ShoppingList.user_id == current_user.id
    ).first()
    
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Shopping list not found")
    
    # Générer le PDF
    pdf_content = PDFGenerator.generate_shopping_list_pdf(shopping_list)
    
    # Créer un fichier temporaire
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(pdf_content)
        tmp_file.flush()
        
        return FileResponse(
            tmp_file.name,
            media_type="application/pdf",
            filename=f"liste_courses_{shopping_list.id}.pdf",
            background=lambda: os.unlink(tmp_file.name)  # Nettoyer après envoi
        )