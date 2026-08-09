from typing import Any


class AppException(Exception):
    """Base exception for expected application errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        data: Any = None,
    ):
        self.message = message
        self.status_code = status_code
        self.data = data

        super().__init__(message)


class BadRequestException(AppException):
    """Raised when the request is invalid."""

    def __init__(
        self,
        message: str = "Bad request",
        data: Any = None,
    ):
        super().__init__(
            message=message,
            status_code=400,
            data=data,
        )


class NotFoundException(AppException):
    """Raised when a requested resource does not exist."""

    def __init__(
        self,
        message: str = "Resource not found",
        data: Any = None,
    ):
        super().__init__(
            message=message,
            status_code=404,
            data=data,
        )


class ConflictException(AppException):
    """Raised when a request conflicts with existing data."""

    def __init__(
        self,
        message: str = "Resource already exists",
        data: Any = None,
    ):
        super().__init__(
            message=message,
            status_code=409,
            data=data,
        )