from sqlalchemy.orm import Session
from app.suppliers.model import Supplier
from app.suppliers.schema import SupplierCreate, SupplierUpdate

def create_supplier(db: Session, data: SupplierCreate):
    supplier = Supplier(
        name=data.name,
        company=data.company,
        phone=data.phone,
        email=data.email,
        address=data.address,
        gstin=data.gstin
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

def get_all_suppliers(db: Session):
    return db.query(Supplier).filter(Supplier.is_active == True).all()


def get_supplier_by_id(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

def update_supplier(db: Session, supplier_id: int, data: SupplierUpdate):
    supplier = get_supplier_by_id(db, supplier_id)
    if not supplier:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(supplier, key, value)
    db.commit()
    db.refresh(supplier)
    return supplier

def delete_supplier(db: Session, supplier_id: int):
    supplier = get_supplier_by_id(db, supplier_id)
    if not supplier:
        return None
    supplier.is_active = False
    db.commit()
    return supplier