from sqlalchemy.orm import Session
from app.businesses.model import Business
from app.businesses.schema import BusinessCreate, BusinessUpdate

def create_business(db: Session, data: BusinessCreate):
    business = Business(
        name=data.name,
        description=data.description
    )
    db.add(business)
    db.commit()
    db.refresh(business)
    return business

def get_all_businesses(db: Session):
    return db.query(Business).filter(Business.isActive == True).all()


def get_business_by_id(db: Session, business_id: int):
    return db.query(Business).filter(Business.id == business_id).first()

def update_business(db: Session, business_id: int, data: BusinessUpdate):
    business = get_business_by_id(db, business_id)
    if not business:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(business, key, value)
    db.commit()
    db.refresh(business)
    return business

def delete_business(db: Session, business_id: int):
    business = get_business_by_id(db, business_id)
    if not business:
        return None
    business.isActive = False
    db.commit()
    return business