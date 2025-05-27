from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
import secrets
from pathlib import Path


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "BlockPort Global"
    VERSION: str = "1.0.0"

    # Environment
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_SECRET: str = secrets.token_urlsafe(32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"

    # Database - PostgreSQL configuration
    DATABASE_URL: str = "postgresql://blockport_global_user:Sxzyn1UBKOjRw7hY89eovoJBDg8zmkf8@dpg-d0pqn53uibrs73822m10-a/blockport_global"

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    CORS_ORIGINS: str = ""

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: str | List[str]) -> List[str] | str:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Security Headers
    SECURITY_HEADERS: dict = {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy": "default-src 'self'",
    }

    # Email Settings (for future use)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = None
    EMAILS_FROM_NAME: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow"


settings = Settings()
