from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.categories.schema import CategoryCreate, CategoryUpdate, CategoryResponse
from app.categories import service

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
    dependencies=[Depends(get_current_user)]
)

# create category
@router.post("/create", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create(data: CategoryCreate, db: Session = Depends(get_db)):
    return service.create_category(db, data)

# get all categories
@router.get("/all", response_model=List[CategoryResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_categories(db)

# get category by business id
@router.get("/business/{business_id}", response_model=List[CategoryResponse])
def get_by_business_id(business_id: int, db: Session = Depends(get_db)):
    category = service.get_category_by_business_id(db, business_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

# get category by id
@router.get("/{category_id}", response_model=CategoryResponse)
def get_one(category_id: int, db: Session = Depends(get_db)):
    category = service.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category


# update category
@router.put("/update/{category_id}", response_model=CategoryResponse)
def update(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    category = service.update_category(db, category_id, data)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

# delete category
@router.delete("/delete/{category_id}", response_model=CategoryResponse)
def delete(category_id: int, db: Session = Depends(get_db)):
    category = service.delete_category(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category