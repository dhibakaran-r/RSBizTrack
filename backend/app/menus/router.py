from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.auth.model import User
from app.menus.schema import MenuResponse
from app.menus import service

router = APIRouter(
    prefix="/menus",
    tags=["Menus"]
)

@router.get("/my-menus", response_model=List[MenuResponse])
def get_my_menus(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.get_menus_by_role(db, current_user.role)