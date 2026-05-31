from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.stock.schema import StockCreate, StockUpdate, StockResponse
from app.stock import service

router = APIRouter(
    prefix="/Stocks",
    tags=["Stocks"],
    dependencies=[Depends(get_current_user)]
)

# create Stock
@router.post("/create", response_model=StockResponse, status_code=status.HTTP_201_CREATED)
def create(data: StockCreate, db: Session = Depends(get_db)):
    return service.create_Stock(db, data)

# get all Stocks
@router.get("/all", response_model=List[StockResponse])
def get_all(db: Session = Depends(get_db)):
    return service.get_all_Stocks(db)

# get Stock by product id
@router.get("/product/{product_id}", response_model=List[StockResponse])
def get_by_product_id(product_id: int, db: Session = Depends(get_db)):
    stock = service.get_Stock_by_product_id(db, product_id)
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    return stock

# get Stock by id
@router.get("/{Stock_id}", response_model=StockResponse)
def get_one(Stock_id: int, db: Session = Depends(get_db)):
    stock = service.get_Stock_by_id(db, Stock_id)
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    return stock


# update Stock
@router.put("/update/{Stock_id}", response_model=StockResponse)
def update(Stock_id: int, data: StockUpdate, db: Session = Depends(get_db)):
    stock = service.update_Stock(db, Stock_id, data)
    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )
    return stock

# delete Stock
# @router.delete("/delete/{Stock_id}", response_model=StockResponse)
# def delete(Stock_id: int, db: Session = Depends(get_db)):
#     stock = service.delete_Stock(db, Stock_id)
#     if not stock:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Stock not found"
#         )
#     return stock