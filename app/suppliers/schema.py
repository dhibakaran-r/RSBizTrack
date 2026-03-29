from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SupplierCreate(BaseModel):
    name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None

class SupplierUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    is_active: Optional[bool] = None

class SupplierResponse(BaseModel):
    id: int
    name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True