from dotenv import load_dotenv
from core.database import engine, Base
from api.v1.endpoints import auth, users, dashboard
from core.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from pathlib import Path

# Add the app directory to the Python path
app_dir = Path(__file__).resolve().parent
sys.path.append(str(app_dir))


# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite's default port
    "http://127.0.0.1:5173",
    "http://localhost:3001",  # Alternative port
    "http://127.0.0.1:3001",
    "https://block-port-global.vercel.app",  # Production domain
    "https://*.vercel.app",  # All Vercel preview deployments
    "https://blockportglobal.com",  # Custom domain if any
    "https://*.blockportglobal.com",  # Subdomains
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR +
                   "/auth", tags=["auth"])
app.include_router(users.router, prefix=settings.API_V1_STR +
                   "/users", tags=["users"])
app.include_router(dashboard.router, prefix=settings.API_V1_STR +
                   "/dashboard", tags=["dashboard"])


@app.get("/")
async def root():
    return {"message": "Welcome to BlockPort Global API"}
