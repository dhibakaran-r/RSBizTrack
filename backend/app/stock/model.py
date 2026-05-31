from sqlalchemy import Column, Integer, ForeignKey, DateTime, Numeric
from sqlalchemy.sql import func
from app.core.database import Base


class Stock(Base):
    __tablename__ = "stock"

    id  =   Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False, default=0.00)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())