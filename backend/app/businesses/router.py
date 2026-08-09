from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.model import User
from app.businesses import service
from app.businesses.schema import (
    BusinessCreate,
    BusinessResponse,
    BusinessUpdate,
)
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.exceptions import (
    ConflictException,
    NotFoundException,
)
from app.core.response import SuccessResponse


router = APIRouter(
    prefix="/businesses",
    tags=["Businesses"],
    dependencies=[Depends(get_current_user)],
)


@router.post(
    "/create",
    response_model=SuccessResponse[BusinessResponse],
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: BusinessCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new business."""

    existing = service.get_business_by_name(
        db,
        data.name,
    )

    if existing:
        raise ConflictException(
            message=f"Business '{data.name}' already exists",
        )

    business = service.create_business(
        db,
        data,
    )

    return SuccessResponse(
        message="Business created successfully",
        data=business,
    )


@router.get(
    "/all",
    response_model=SuccessResponse[list[BusinessResponse]],
    status_code=status.HTTP_200_OK,
)
def get_all(
    db: Session = Depends(get_db),
):
    """Get all active businesses."""

    businesses = service.get_all_businesses(db)

    return SuccessResponse(
        message="Businesses fetched successfully",
        data=businesses,
    )


@router.get(
    "/{business_id}",
    response_model=SuccessResponse[BusinessResponse],
    status_code=status.HTTP_200_OK,
)
def get_one(
    business_id: int,
    db: Session = Depends(get_db),
):
    """Get a single business by ID."""

    business = service.get_business_by_id(
        db,
        business_id,
    )

    if not business:
        raise NotFoundException(
            message=f"Business with id {business_id} not found",
        )

    return SuccessResponse(
        message="Business fetched successfully",
        data=business,
    )


@router.put(
    "/update/{business_id}",
    response_model=SuccessResponse[BusinessResponse],
    status_code=status.HTTP_200_OK,
)
def update(
    business_id: int,
    data: BusinessUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing business."""

    updated = service.update_business(
        db,
        business_id,
        data,
    )

    if not updated:
        raise NotFoundException(
            message=f"Business with id {business_id} not found",
        )

    return SuccessResponse(
        message="Business updated successfully",
        data=updated,
    )


@router.delete(
    "/delete/{business_id}",
    response_model=SuccessResponse[dict[str, int]],
    status_code=status.HTTP_200_OK,
)
def delete(
    business_id: int,
    db: Session = Depends(get_db),
):
    """Soft delete a business."""

    deleted = service.delete_business(
        db,
        business_id,
    )

    if not deleted:
        raise NotFoundException(
            message=f"Business with id {business_id} not found",
        )

    return SuccessResponse(
        message="Business deleted successfully",
        data={
            "id": business_id,
        },
    )