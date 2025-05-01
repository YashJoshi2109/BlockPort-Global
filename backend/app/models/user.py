from sqlalchemy import Boolean, Column, String, DateTime, Enum
from sqlalchemy.sql import func
import enum
from app.db.base_class import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    IMPORTER = "importer"
    EXPORTER = "exporter"
    LOGISTICS = "logistics"


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.IMPORTER)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
    refresh_token = Column(String(255), nullable=True)

    def __repr__(self):
        return f"<User {self.email}>"
