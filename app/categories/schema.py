from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    business_id: int

class CategoryUpdate(BaseModel):
    name: str
    description: Optional[str] = None
    business_id: Optional[int] = None
    isActive: Optional[bool] = None

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    business_id: int
    isActive: bool
    createdAt: datetime

    class Config:
        from_attributes = True