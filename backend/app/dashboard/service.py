from sqlalchemy.orm import Session
from sqlalchemy import func
from app.businesses.model import Business
from app.products.model import Product
from app.suppliers.model import Supplier
from app.stock.model import Stock
from app.categories.model import Category

def get_dashboard_stats(db: Session):
    """Get summary statistics for dashboard cards."""

    total_businesses = db.query(func.count(Business.id)).filter(
        Business.isActive == True
    ).scalar()

    total_products = db.query(func.count(Product.id)).filter(
        Product.is_active == True
    ).scalar()

    total_suppliers = db.query(func.count(Supplier.id)).filter(
        Supplier.is_active == True
    ).scalar()

    total_categories = db.query(func.count(Category.id)).filter(
        Category.isActive == True
    ).scalar()

    # Low stock — quantity below min_stock
    low_stock_count = db.query(func.count(Stock.id)).join(
        Product, Stock.product_id == Product.id
    ).filter(
        Stock.quantity <= Product.min_stock,
        Product.is_active == True
    ).scalar()

    return {
        "total_businesses": total_businesses,
        "total_products": total_products,
        "total_suppliers": total_suppliers,
        "total_categories": total_categories,
        "low_stock_count": low_stock_count,
    }

def get_recent_products(db: Session, limit: int = 5):
    """Get recently added products with business and category info."""

    products = db.query(Product).filter(
        Product.is_active == True
    ).order_by(
        Product.created_at.desc()
    ).limit(limit).all()

    return products

def get_low_stock_products(db: Session, limit: int = 5):
    """Get products where current stock is below minimum stock level."""

    results = db.query(Product, Stock).join(
        Stock, Stock.product_id == Product.id
    ).filter(
        Stock.quantity <= Product.min_stock,
        Product.is_active == True
    ).order_by(
        Stock.quantity.asc()
    ).limit(limit).all()

    return [
        {
            "id": product.id,
            "name": product.name,
            "current_stock": float(stock.quantity),
            "min_stock": float(product.min_stock),
            "shortage": float(product.min_stock - stock.quantity),
        }
        for product, stock in results
    ]