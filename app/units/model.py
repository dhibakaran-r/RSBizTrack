from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Unit(Base):
    __tablename__ = "units"

    id  =   Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    shortName = Column(String(10), nullable=False)