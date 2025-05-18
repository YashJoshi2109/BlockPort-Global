from enum import Enum, auto
from typing import Dict, Set
from app.models.user import UserRole


class Permission(str, Enum):
    # Document Permissions
    CREATE_DOCUMENT = "create_document"
    READ_DOCUMENT = "read_document"
    UPDATE_DOCUMENT = "update_document"
    DELETE_DOCUMENT = "delete_document"

    # Contract Permissions
    CREATE_CONTRACT = "create_contract"
    READ_CONTRACT = "read_contract"
    UPDATE_CONTRACT = "update_contract"
    DELETE_CONTRACT = "delete_contract"
    SIGN_CONTRACT = "sign_contract"

    # Transaction Permissions
    CREATE_TRANSACTION = "create_transaction"
    READ_TRANSACTION = "read_transaction"
    UPDATE_TRANSACTION = "update_transaction"

    # User Management
    MANAGE_USERS = "manage_users"
    VIEW_USERS = "view_users"

    # Profile Permissions
    UPDATE_PROFILE = "update_profile"
    VIEW_PROFILE = "view_profile"


# Define role-based permissions
ROLE_PERMISSIONS: Dict[UserRole, Set[Permission]] = {
    UserRole.ADMIN: {
        # Admins have all permissions
        *Permission.__members__.values()
    },

    UserRole.IMPORTER: {
        # Document permissions
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.DELETE_DOCUMENT,

        # Contract permissions
        Permission.CREATE_CONTRACT,
        Permission.READ_CONTRACT,
        Permission.UPDATE_CONTRACT,
        Permission.SIGN_CONTRACT,

        # Transaction permissions
        Permission.CREATE_TRANSACTION,
        Permission.READ_TRANSACTION,
        Permission.UPDATE_TRANSACTION,

        # Profile permissions
        Permission.UPDATE_PROFILE,
        Permission.VIEW_PROFILE,
    },

    UserRole.EXPORTER: {
        # Document permissions
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.DELETE_DOCUMENT,

        # Contract permissions
        Permission.READ_CONTRACT,
        Permission.SIGN_CONTRACT,

        # Transaction permissions
        Permission.READ_TRANSACTION,
        Permission.UPDATE_TRANSACTION,

        # Profile permissions
        Permission.UPDATE_PROFILE,
        Permission.VIEW_PROFILE,
    },

    UserRole.LOGISTICS: {
        # Document permissions
        Permission.READ_DOCUMENT,
        Permission.CREATE_DOCUMENT,

        # Contract permissions
        Permission.READ_CONTRACT,

        # Transaction permissions
        Permission.READ_TRANSACTION,
        Permission.UPDATE_TRANSACTION,

        # Profile permissions
        Permission.UPDATE_PROFILE,
        Permission.VIEW_PROFILE,
    }
}


def get_permissions(role: UserRole) -> Set[Permission]:
    """Get permissions for a specific role."""
    return ROLE_PERMISSIONS.get(role, set())


def has_permission(role: UserRole, permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    return permission in get_permissions(role)
