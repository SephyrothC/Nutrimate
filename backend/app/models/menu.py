from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class WeeklyMenu(Base):
    __tablename__ = "weekly_menus"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start_date = Column(Date, nullable=False)  # Lundi de la semaine
    menu_data = Column(JSON, nullable=False)
    # Structure menu_data:
    # {
    #   "monday": {"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id},
    #   "tuesday": {"breakfast": recipe_id, "lunch": recipe_id, "dinner": recipe_id},
    #   ...
    # }
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    user = relationship("User", back_populates="menus")
    shopping_lists = relationship("ShoppingList", back_populates="menu", cascade="all, delete-orphan")
