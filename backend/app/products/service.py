from sqlalchemy.orm import Session
from app.products.model import Product
from app.stock.model import Stock
from app.products.schema import ProductCreate, ProductUpdate

def create_product(db: Session, data: ProductCreate):
    product = Product(
        business_id=data.business_id,
        category_id=data.category_id,
        unit_id=data.unit_id,
        name=data.name,
        description=data.description,
        selling_price=data.selling_price,
        cost_price=data.cost_price,
        min_stock=data.min_stock
    )
    db.add(product)
    db.commit()
    db.refresh(product)

    stock = Stock(
        product_id=product.id,
        quantity=0
    )
    db.add(stock)
    db.commit()

    return product


def get_all_products(db: Session):
    return db.query(Product).filter(Product.is_active == True).all()

def get_product_by_id(db: Session, Product_id: int):
    return db.query(Product).filter(Product.id == Product_id).first()

def get_product_by_business_id(db: Session, business_id: int):
    return db.query(Product).filter(Product.business_id == business_id).all()

def get_product_by_category_id(db: Session, category_id: int):
    return db.query(Product).filter(Product.category_id == category_id).all()

def get_product_by_unit_id(db: Session, unit_id: int):
    return db.query(Product).filter(Product.unit_id == unit_id).all()

def update_product(db: Session, Product_id: int, data: ProductUpdate):
    product = get_product_by_id(db, Product_id)
    if not product:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, Product_id: int):
    product = get_product_by_id(db, Product_id)
    if not product:
        return None
    product.is_active = False
    db.commit()
    db.refresh(product)
    return product