from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.businesses.router import router as business_router
from app.categories.router import router as category_router
from app.units.router import router as unit_router
from app.suppliers.router import router as supplier_router

app = FastAPI(
    title="RSBizTrack API",
    version="1.0.0",
    description="Multi-business Inventory & Sales Management System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business_router)
app.include_router(category_router)
app.include_router(unit_router)
app.include_router(supplier_router)

@app.get("/health")
def health_check():
    return {
        "status": "RSBizTrack API is running!",
        "version": "1.0.0"
    }