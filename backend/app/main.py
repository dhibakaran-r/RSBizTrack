from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi 
from fastapi.security import HTTPBearer
from app.core.config import settings
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import AppException
from app.core.exception_handlers import (
    app_exception_handler,
    http_exception_handler,
    validation_exception_handler,
    unhandled_exception_handler,
)

from app.auth.router import router as auth_router
from app.menus.router import router as menu_router
from app.dashboard.router import router as dashboard_router
from app.businesses.router import router as business_router
from app.categories.router import router as category_router
from app.units.router import router as unit_router
from app.suppliers.router import router as supplier_router
from app.products.router import router as product_router
from app.stock.router import router as stock_router

app = FastAPI(
    title="RSBizTrack API",
    version="1.0.0",
    description="Multi-business Inventory & Sales Management System"
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="RSBizTrack API",
        version="1.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    open_routes = ["/auth/register", "/auth/login", "/health"]

    for path, path_item in openapi_schema["paths"].items():
        for operation in path_item.values():
            if path in open_routes:
                operation["security"] = []
            else:
                operation["security"] = [{"BearerAuth": []}] 

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(
    AppException,
    app_exception_handler,
)

app.add_exception_handler(
    HTTPException,
    http_exception_handler,
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler,
)

app.add_exception_handler(
    Exception,
    unhandled_exception_handler,
)

app.include_router(auth_router)
app.include_router(menu_router)
app.include_router(dashboard_router)
app.include_router(business_router)
app.include_router(category_router)
app.include_router(unit_router)
app.include_router(supplier_router)
app.include_router(product_router)
app.include_router(stock_router)

@app.get("/health")
def health_check():
    return {
        "status": "RSBizTrack API is running!",
        "version": "1.0.0"
    }


# Example admin-only route demonstrating dependency usage
# from app.core.dependencies import get_admin_user


# @app.get("/admin-only")
# def admin_only_route(current_user = Depends(get_admin_user)):
#     return {
#         "message": "Admin access granted",
#         "user_id": current_user.id,
#         "user_email": current_user.email
#     }