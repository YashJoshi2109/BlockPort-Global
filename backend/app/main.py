from dotenv import load_dotenv
from app.core.database import engine, Base
from app.api.v1.endpoints import auth, users, dashboard
from app.core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from pathlib import Path
import logging

# Add the app directory to the Python path
app_dir = Path(__file__).resolve().parent
sys.path.append(str(app_dir))


# Load environment variables
load_dotenv()

# Create database tables only in development/testing environments
if os.getenv("ENVIRONMENT") != "production":
    Base.metadata.create_all(bind=engine)
    logging.info("Database tables created/verified (development mode)")
else:
    logging.info("Production mode: Skipping table creation")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with API_V1_STR prefix
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(users.router, prefix=settings.API_V1_STR, tags=["users"])
app.include_router(
    dashboard.router, prefix=settings.API_V1_STR, tags=["dashboard"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to BlockPort Global API",
        "version": settings.VERSION,
        "environment": os.getenv("ENVIRONMENT", "development")
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "database": "connected"
    }
