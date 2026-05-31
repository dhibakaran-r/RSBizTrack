from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Numeric
from sqlalchemy.sql import func
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id  =   Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    selling_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    cost_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    min_stock = Column(Numeric(10, 2), nullable=False, default=0.00)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())