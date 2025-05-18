from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
import enum
from database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    IMPORTER = "importer"
    EXPORTER = "exporter"
    LOGISTICS = "logistics"


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.IMPORTER)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    account_locked_until = Column(DateTime(timezone=True), nullable=True)
    refresh_token = Column(String(255), nullable=True)

    def __repr__(self):
        return f"<User {self.email}>"
