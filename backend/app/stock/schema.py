from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StockCreate(BaseModel):
    product_id: int
    quantity: Optional[float] = None


class StockUpdate(BaseModel):
    quantity: Optional[float] = None

class StockResponse(BaseModel):
    id: int
    product_id: int
    quantity: float
    last_updated: datetime

    class Config:
        from_attributes = True

class StockResponseWithProduct(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: float
    last_updated: datetime

    class Config:
        from_attributes = True