from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional
from models.user import UserRole
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: constr(min_length=2, max_length=255)
    role: UserRole = UserRole.IMPORTER


class UserCreate(BaseModel):
    email: EmailStr
    username: constr(min_length=3, max_length=50)
    password: constr(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[datetime] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
