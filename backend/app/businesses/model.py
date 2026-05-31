from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Business(Base):
    __tablename__ = "businesses"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    isActive   = Column(Boolean, default=True)
    createdAt  = Column(DateTime, server_default=func.now())