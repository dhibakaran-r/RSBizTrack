from sqlalchemy.orm import Session
from app.categories.model import Category
from app.categories.schema import CategoryCreate, CategoryUpdate

def create_category(db: Session, data: CategoryCreate):
    category = Category(
        business_id=data.business_id,
        name=data.name,
        description=data.description
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def get_all_categories(db: Session):
    return db.query(Category).filter(Category.isActive == True).all()

def get_category_by_id(db: Session, Category_id: int):
    return db.query(Category).filter(Category.id == Category_id).first()

def get_category_by_business_id(db: Session, business_id: int):
    return db.query(Category).filter(Category.business_id == business_id).all()

def update_category(db: Session, Category_id: int, data: CategoryUpdate):
    category = get_category_by_id(db, Category_id)
    if not category:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category 

def delete_category(db: Session, Category_id: int):
    category = get_category_by_id(db, Category_id)
    if not category:
        return None
    category.isActive = False
    db.commit()
    db.refresh(category)
    return category