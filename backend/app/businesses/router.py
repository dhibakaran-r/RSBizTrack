from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.businesses.schema import BusinessCreate, BusinessUpdate, BusinessResponse
from app.businesses import service

router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/create", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
def create(data: BusinessCreate, db: Session = Depends(get_db)):
    return service.create_business(db, data)

@router.get("/all", response_model=List[BusinessResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_businesses(db)

@router.get("/{business_id}", response_model=BusinessResponse)
def get_one(business_id: int, db: Session = Depends(get_db)):
    business = service.get_business_by_id(db, business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    return business

@router.put("/update/{business_id}", response_model=BusinessResponse)
def update(business_id: int, data: BusinessUpdate, db: Session = Depends(get_db)):
    business = service.update_business(db, business_id, data)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    return business

@router.delete("/delete/{business_id}", response_model=BusinessResponse)
def delete(business_id: int, db: Session = Depends(get_db)):
    business = service.delete_business(db, business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    return business