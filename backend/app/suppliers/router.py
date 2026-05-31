from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.suppliers.schema import SupplierCreate, SupplierUpdate, SupplierResponse
from app.suppliers import service

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/create", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create(data: SupplierCreate, db: Session = Depends(get_db)):
    return service.create_supplier(db, data)

@router.get("/all", response_model=List[SupplierResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_suppliers(db)

@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_one(supplier_id: int, db: Session = Depends(get_db)):
    supplier = service.get_supplier_by_id(db, supplier_id)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="supplier not found"
        )
    return supplier

@router.put("/update/{supplier_id}", response_model=SupplierResponse)
def update(supplier_id: int, data: SupplierUpdate, db: Session = Depends(get_db)):
    supplier = service.update_supplier(db, supplier_id, data)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="supplier not found"
        )
    return supplier

@router.delete("/delete/{supplier_id}", response_model=SupplierResponse)
def delete(supplier_id: int, db: Session = Depends(get_db)):
    supplier = service.delete_supplier(db, supplier_id)
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="supplier not found"
        )
    return supplier