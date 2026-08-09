import logging

from fastapi import HTTPException, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException
from app.core.response import ErrorResponse


logger = logging.getLogger(__name__)


async def app_exception_handler(
    request: Request,
    exc: AppException,
) -> JSONResponse:
    response = ErrorResponse(
        message=exc.message,
        data=exc.data,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(response),
    )


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    response = ErrorResponse(
        message=str(exc.detail),
    )

    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(response),
        headers=exc.headers,
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    response = ErrorResponse(
        message="Validation error",
        data=exc.errors(),
    )

    return JSONResponse(
        status_code=422,
        content=jsonable_encoder(response),
    )


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception(
        "Unhandled exception occurred",
        exc_info=exc,
    )

    response = ErrorResponse(
        message="Internal server error",
    )

    return JSONResponse(
        status_code=500,
        content=jsonable_encoder(response),
    )