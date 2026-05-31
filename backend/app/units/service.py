from sqlalchemy.orm import Session
from app.units.model import Unit
from app.units.schema import UnitCreate, UnitUpdate

def create_unit(db: Session, data: UnitCreate):
    unit = Unit(
        name=data.name,
        shortName=data.shortName
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return unit

def get_all_units(db: Session):
    return db.query(Unit).all()


def get_unit_by_id(db: Session, unit_id: int):
    return db.query(Unit).filter(Unit.id == unit_id).first()

def update_unit(db: Session, unit_id: int, data: UnitUpdate):
    unit = get_unit_by_id(db, unit_id)
    if not unit:
        return None
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(unit, key, value)
    db.commit()
    db.refresh(unit)
    return unit

def delete_unit(db: Session, unit_id: int):
    unit = get_unit_by_id(db, unit_id)
    if not unit:
        return None
    db.delete(unit)
    db.commit()
    return unit