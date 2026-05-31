from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    business_id: int
    category_id: int
    unit_id: int
    selling_price: float
    cost_price: float
    min_stock: float

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    business_id: Optional[int] = None
    category_id: Optional[int] = None
    unit_id: Optional[int] = None
    selling_price: Optional[float] = None
    cost_price: Optional[float] = None
    min_stock: Optional[float] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    business_id: int
    category_id: int
    unit_id: int
    selling_price: float
    cost_price: float
    min_stock: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True