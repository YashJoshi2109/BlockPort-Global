from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import verify_token
from app.core.database import SessionLocal
from app.models.user import User
from app.schemas.auth import TokenPayload
from app.core.permissions import Permission, has_permission

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_db() -> Generator:
    """Get database session."""
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Get current authenticated user."""
    try:
        user_id = verify_token(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def check_permission(required_permission: Permission):
    """Check if user has required permission."""
    async def permission_dependency(current_user: User = Depends(get_current_user)) -> User:
        # For now, we'll use a simple role-based check
        # In a real application, you would check against a permissions table
        if current_user.role.value == "admin":
            return current_user

        # Add role-specific permission checks here
        if required_permission == Permission.READ_CONTRACT:
            if current_user.role.value in ["importer", "exporter", "logistics"]:
                return current_user

        if required_permission == Permission.CREATE_CONTRACT:
            if current_user.role.value in ["importer", "exporter"]:
                return current_user

        if required_permission == Permission.MANAGE_USERS:
            if current_user.role.value == "admin":
                return current_user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return permission_dependency
