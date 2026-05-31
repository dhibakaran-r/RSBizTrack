from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth.model import User
from app.core.database import get_db
from app.products.schema import ProductCreate, ProductUpdate, ProductResponse
from app.products import service
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/products",
    tags=["Products"],
    dependencies=[Depends(get_current_user)]
)

# create product
@router.post("/create", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create(data: ProductCreate, db: Session = Depends(get_db)):
    return service.create_product(db, data)

# get all products
@router.get("/all", response_model=List[ProductResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_products(db)

# get product by business id
@router.get("/business/{business_id}", response_model=List[ProductResponse])
def get_by_business_id(business_id: int, db: Session = Depends(get_db)):
    product = service.get_product_by_business_id(db, business_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# get product by category id
@router.get("/category/{category_id}", response_model=List[ProductResponse])
def get_by_category_id(category_id: int, db: Session = Depends(get_db)):
    product = service.get_product_by_category_id(db, category_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# get product by unit id
@router.get("/unit/{unit_id}", response_model=List[ProductResponse])
def get_by_unit_id(unit_id: int, db: Session = Depends(get_db)):
    product = service.get_product_by_unit_id(db, unit_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# get product by id
@router.get("/{product_id}", response_model=ProductResponse)
def get_one(product_id: int, db: Session = Depends(get_db)):
    product = service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


# update product
@router.put("/update/{product_id}", response_model=ProductResponse)
def update(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    product = service.update_product(db, product_id, data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

# delete product
@router.delete("/delete/{product_id}", response_model=ProductResponse)
def delete(product_id: int, db: Session = Depends(get_db)):
    product = service.delete_product(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="product not found"
        )
    return product