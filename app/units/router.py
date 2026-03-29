from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.units.schema import UnitCreate, UnitUpdate, UnitResponse
from app.units import service

router = APIRouter(
    prefix="/units",
    tags=["units"]
)

@router.post("/create", response_model=UnitResponse, status_code=status.HTTP_201_CREATED)
def create(data: UnitCreate, db: Session = Depends(get_db)):
    return service.create_unit(db, data)

@router.get("/all", response_model=List[UnitResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_units(db)

@router.get("/{unit_id}", response_model=UnitResponse)
def get_one(unit_id: int, db: Session = Depends(get_db)):
    unit = service.get_unit_by_id(db, unit_id)
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="unit not found"
        )
    return unit

@router.put("/update/{unit_id}", response_model=UnitResponse)
def update(unit_id: int, data: UnitUpdate, db: Session = Depends(get_db)):
    unit = service.update_unit(db, unit_id, data)
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="unit not found"
        )
    return unit

@router.delete("/delete/{unit_id}", response_model=UnitResponse)
def delete(unit_id: int, db: Session = Depends(get_db)):
    unit = service.delete_unit(db, unit_id)
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="unit not found"
        )
    return unit