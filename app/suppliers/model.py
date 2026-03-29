from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    company     = Column(String(100), nullable=True)
    phone       = Column(String(15), nullable=True)
    email       = Column(String(100), nullable=True)
    address     = Column(Text, nullable=True)
    gstin     = Column(String(20), nullable=True)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime, server_default=func.now())