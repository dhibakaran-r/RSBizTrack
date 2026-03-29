from typing import Optional
from pydantic import BaseModel

class UnitCreate(BaseModel):
    name: str
    shortName: str

class UnitUpdate(BaseModel):
    name: Optional[str] = None
    shortName: Optional[str] = None

class UnitResponse(BaseModel):
    id: int
    name: str
    shortName: str

    class Config:
        from_attributes = True