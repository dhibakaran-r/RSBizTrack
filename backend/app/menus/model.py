from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey
from app.core.database import Base

class Menu(Base):
    __tablename__ = "menus"

    id          = Column(Integer, primary_key=True, index=True)
    label       = Column(String(100), nullable=False)
    path        = Column(String(100), nullable=False)
    icon        = Column(String(50), nullable=False)
    order_index = Column(Integer, default=0)
    is_active   = Column(Boolean, default=True)

class RoleMenu(Base):
    __tablename__ = "role_menus"

    id      = Column(Integer, primary_key=True, index=True)
    role    = Column(Enum('admin', 'staff'), nullable=False)
    menu_id = Column(Integer, ForeignKey("menus.id"), nullable=False)