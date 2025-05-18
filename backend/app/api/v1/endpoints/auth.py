from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Any, Dict
from datetime import datetime, timedelta

from core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
    generate_uuid,
    verify_token
)
from core.config import settings
from core.database import get_db
from models.user import User, UserRole
from schemas.auth import (
    Token,
    TokenPayload,
    UserCreate,
    UserResponse,
    UserLogin
)
from core.rate_limit import rate_limit

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_token(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency to get the current token from the request.
    """
    return token

# Test accounts for different roles
TEST_ACCOUNTS = {
    "admin@test.com": {
        "email": "admin@test.com",
        "password": "Admin@123",
        "username": "admin",
        "role": UserRole.ADMIN,
        "is_active": True,
        "company": "BlockPort Global",
        "subscription": {
            "plan": "enterprise",
            "status": "active",
            "features": ["all"]
        }
    },
    "importer@test.com": {
        "email": "importer@test.com",
        "password": "Test@123",
        "username": "importer",
        "role": UserRole.IMPORTER,
        "is_active": True,
        "company": "Import Co Ltd",
        "subscription": {
            "plan": "professional",
            "status": "active",
            "features": ["contracts", "escrow", "analytics"]
        }
    },
    "exporter@test.com": {
        "email": "exporter@test.com",
        "password": "Test@123",
        "username": "exporter",
        "role": UserRole.EXPORTER,
        "is_active": True,
        "company": "Export Co Ltd",
        "subscription": {
            "plan": "professional",
            "status": "active",
            "features": ["contracts", "escrow", "analytics"]
        }
    },
    "logistics@test.com": {
        "email": "logistics@test.com",
        "password": "Test@123",
        "username": "logistics",
        "role": UserRole.LOGISTICS,
        "is_active": True,
        "company": "Logistics Co Ltd",
        "subscription": {
            "plan": "starter",
            "status": "active",
            "features": ["basic"]
        }
    }
}


@router.post("/register", response_model=UserResponse)
@rate_limit(limit=5, period=3600)  # 5 requests per hour
async def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """
    Register a new user.
    """
    # Check if user exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    if db.query(User).filter(User.username == user_in.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create new user
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/test-login")
@rate_limit(limit=10, period=60)  # 10 requests per minute
async def test_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Test login endpoint with pre-configured accounts.
    Test accounts:
    - Admin: admin@test.com / Admin@123
    - Importer: importer@test.com / Test@123
    - Exporter: exporter@test.com / Test@123
    - Logistics: logistics@test.com / Test@123
    """
    if form_data.username not in TEST_ACCOUNTS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user = TEST_ACCOUNTS[form_data.username]
    if form_data.password != user["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Create access and refresh tokens
    access_token = create_access_token(user["email"])
    refresh_token = create_refresh_token(user["email"])

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "username": user["username"],
            "role": user["role"],
            "is_active": user["is_active"],
            "company": user["company"],
            "subscription": user["subscription"]
        }
    }


@router.post("/login")
@rate_limit(limit=5, period=60)  # 5 requests per minute
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Dict:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.account_locked_until = datetime.utcnow() + timedelta(minutes=30)
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if user.account_locked_until and user.account_locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is locked. Please try again later."
        )

    # Reset failed attempts and update last login
    user.failed_login_attempts = 0
    user.last_login = datetime.utcnow()
    db.commit()

    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer"
    }


@router.post("/refresh-token")
async def refresh_token(
    current_token: str = Depends(get_current_token),
    db: Session = Depends(get_db)
) -> Dict:
    """
    Refresh access token.
    """
    user_id = verify_token(current_token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
        "token_type": "bearer"
    }


@router.post("/logout")
def logout(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    """
    Logout user and invalidate refresh token.
    """
    user_id = verify_token(token)
    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.refresh_token = None
            db.commit()
    return {"message": "Successfully logged out"}
