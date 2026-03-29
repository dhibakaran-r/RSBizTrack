from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BusinessCreate(BaseModel):
    name: str
    description: Optional[str] = None

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    isActive: Optional[bool] = None

class BusinessResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    isActive: bool
    createdAt: datetime

    class Config:
        from_attributes = True