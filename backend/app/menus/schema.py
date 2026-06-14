from pydantic import BaseModel

class MenuResponse(BaseModel):
    id: int
    label: str
    path: str
    icon: str
    order_index: int

    class Config:
        from_attributes = True