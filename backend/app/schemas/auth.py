from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional
from app.models.user import UserRole
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: constr(min_length=2, max_length=255)
    role: UserRole = UserRole.IMPORTER


class UserCreate(UserBase):
    password: constr(min_length=8)
    confirm_password: str

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True
