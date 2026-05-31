from sqlalchemy.orm import Session
from app.stock.model import Stock
from app.stock.schema import StockCreate, StockUpdate

def create_Stock(db: Session, data: StockCreate):
    stock = Stock(
        product_id=data.product_id,
        quantity=data.quantity
    )

    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock


def get_all_Stocks(db: Session):
    return db.query(Stock).all()

def get_Stock_by_id(db: Session, Stock_id: int):
    return db.query(Stock).filter(Stock.id == Stock_id).first()

def get_Stock_by_product_id(db: Session, product_id: int):
    return db.query(Stock).filter(Stock.product_id == product_id).all()

def update_Stock(db: Session, Stock_id: int, data: StockUpdate):
    stock = get_Stock_by_id(db, Stock_id)
    if not stock:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(stock, key, value)
    db.commit()
    db.refresh(stock)
    return stock

# def delete_Stock(db: Session, Stock_id: int):
#     stock = get_Stock_by_id(db, Stock_id)
#     if not stock:
#         return None
#     stock.is_active = False
#     db.commit()
#     db.refresh(stock)
#     return stock