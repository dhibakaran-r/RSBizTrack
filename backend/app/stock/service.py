from sqlalchemy.orm import Session
from app.stock.model import Stock
from app.stock.schema import StockCreate, StockUpdate
from app.products.model import Product

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
    """
    Fetch all stocks with product name using JOIN.
    
    SQL equivalent:
    SELECT stock.*, products.name as product_name
    FROM stock
    JOIN products ON stock.product_id = products.id
    """

    # return db.query(Stock).all()
    results = (
        db.query(Stock, Product.name.label("product_name"))
        .join(Product, Stock.product_id == Product.id)
        .filter(Product.is_active == True)
        .order_by(Stock.id.asc())
        .all()
    )

    return [
        {
            "id": stock.id,
            "product_id": stock.product_id,
            "product_name": product_name,
            "quantity": float(stock.quantity),
            "last_updated": stock.last_updated,
        }
        for stock, product_name in results
    ]


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