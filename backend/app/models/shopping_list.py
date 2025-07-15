from sqlalchemy import Column, Integer, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class ShoppingList(Base):
    __tablename__ = "shopping_lists"
    
    id = Column(Integer, primary_key=True, index=True)
    menu_id = Column(Integer, ForeignKey("weekly_menus.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    items = Column(JSON, nullable=False)
    # Structure items:
    # [
    #   {"name": "Tomates", "quantity": "6 pcs", "category": "Légumes", "checked": false},
    #   {"name": "Poulet", "quantity": "800g", "category": "Protéines", "checked": false}
    # ]
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relations
    menu = relationship("WeeklyMenu", back_populates="shopping_lists")
    user = relationship("User", back_populates="shopping_lists")