from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.auth.model import User
from app.dashboard import service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return summary counts for dashboard cards."""
    return service.get_dashboard_stats(db)

@router.get("/recent-products")
def get_recent_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return last 5 added products."""
    products = service.get_recent_products(db)
    return [
        {
            "id": p.id,
            "name": p.name,
            "selling_price": float(p.selling_price),
            "created_at": p.created_at,
        }
        for p in products
    ]

@router.get("/low-stock")
def get_low_stock(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Return products below minimum stock level."""
    return service.get_low_stock_products(db)