from sqlalchemy.orm import Session
from app.menus.model import Menu, RoleMenu

def get_menus_by_role(db: Session, role: str):
    menu_ids = db.query(RoleMenu.menu_id).filter(
        RoleMenu.role == role
    ).all()

    ids = [m.menu_id for m in menu_ids]

    menus = db.query(Menu).filter(
        Menu.id.in_(ids),
        Menu.is_active == True
    ).order_by(Menu.order_index).all()

    return menus