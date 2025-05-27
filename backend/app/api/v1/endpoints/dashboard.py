from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.api.deps import get_db, check_permission
from app.core.permissions import Permission
from app.models.user import User, UserRole
from app.schemas.auth import UserResponse
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter()

# Mock data - In real app, this would come from database
MOCK_CONTRACTS = [
    {
        "id": "c1",
        "title": "Coffee Beans Import",
        "status": "pending",
        "value": 50000,
        "created_at": (datetime.utcnow() - timedelta(days=5)).isoformat(),
    },
    {
        "id": "c2",
        "title": "Tea Export Contract",
        "status": "active",
        "value": 75000,
        "created_at": (datetime.utcnow() - timedelta(days=2)).isoformat(),
    }
]

MOCK_SHIPMENTS = [
    {
        "id": "s1",
        "contract_id": "c1",
        "status": "in_transit",
        "location": "Port of Singapore",
        "eta": (datetime.utcnow() + timedelta(days=5)).isoformat(),
    },
    {
        "id": "s2",
        "contract_id": "c2",
        "status": "customs_clearance",
        "location": "Dubai Customs",
        "eta": (datetime.utcnow() + timedelta(days=1)).isoformat(),
    }
]

MOCK_DOCUMENTS = [
    {
        "id": "d1",
        "contract_id": "c1",
        "type": "bill_of_lading",
        "status": "verified",
        "uploaded_at": (datetime.utcnow() - timedelta(days=4)).isoformat(),
    },
    {
        "id": "d2",
        "contract_id": "c1",
        "type": "invoice",
        "status": "pending",
        "uploaded_at": (datetime.utcnow() - timedelta(days=3)).isoformat(),
    }
]


@router.get("/importer")
async def importer_dashboard(
    current_user: User = Depends(check_permission(Permission.READ_CONTRACT))
) -> Dict[str, Any]:
    """
    Dashboard for importers showing:
    - Active contracts
    - Pending shipments
    - Required documents
    - Recent transactions
    """
    if current_user.role != UserRole.IMPORTER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Importer dashboard is only for importers"
        )

    return {
        "active_contracts": [c for c in MOCK_CONTRACTS if c["status"] == "active"],
        "pending_shipments": [s for s in MOCK_SHIPMENTS if s["status"] == "in_transit"],
        "required_documents": [d for d in MOCK_DOCUMENTS if d["status"] == "pending"],
        "recent_activity": [
            {
                "type": "contract_created",
                "description": "New contract created: Coffee Beans Import",
                "timestamp": (datetime.utcnow() - timedelta(days=5)).isoformat()
            },
            {
                "type": "document_requested",
                "description": "Bill of Lading requested for Contract #C1",
                "timestamp": (datetime.utcnow() - timedelta(days=3)).isoformat()
            }
        ]
    }


@router.get("/exporter")
async def exporter_dashboard(
    current_user: User = Depends(check_permission(Permission.READ_CONTRACT))
) -> Dict[str, Any]:
    """
    Dashboard for exporters showing:
    - Contract requests
    - Active shipments
    - Document requirements
    - Payment status
    """
    if current_user.role != UserRole.EXPORTER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Exporter dashboard is only for exporters"
        )

    return {
        "contract_requests": [c for c in MOCK_CONTRACTS if c["status"] == "pending"],
        "active_shipments": MOCK_SHIPMENTS,
        "document_requirements": MOCK_DOCUMENTS,
        "payment_status": [
            {
                "contract_id": "c1",
                "amount": 50000,
                "status": "escrow_funded",
                "due_date": (datetime.utcnow() + timedelta(days=10)).isoformat()
            }
        ]
    }


@router.get("/logistics")
async def logistics_dashboard(
    current_user: User = Depends(check_permission(Permission.READ_CONTRACT))
) -> Dict[str, Any]:
    """
    Dashboard for logistics providers showing:
    - Active shipments
    - Required documents
    - Customs status
    - Delivery schedule
    """
    if current_user.role != UserRole.LOGISTICS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Logistics dashboard is only for logistics providers"
        )

    return {
        "active_shipments": MOCK_SHIPMENTS,
        "required_documents": [d for d in MOCK_DOCUMENTS if d["type"] == "bill_of_lading"],
        "customs_status": [
            {
                "shipment_id": "s1",
                "status": "cleared",
                "location": "Port of Singapore",
                "updated_at": datetime.utcnow().isoformat()
            }
        ],
        "delivery_schedule": [
            {
                "shipment_id": "s1",
                "origin": "Vietnam",
                "destination": "Singapore",
                "eta": (datetime.utcnow() + timedelta(days=5)).isoformat(),
                "status": "on_schedule"
            }
        ]
    }


@router.get("/admin")
async def admin_dashboard(
    current_user: User = Depends(check_permission(Permission.MANAGE_USERS))
) -> Dict[str, Any]:
    """
    Dashboard for admins showing:
    - System statistics
    - User management
    - Contract oversight
    - Activity logs
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Admin dashboard is only for administrators"
        )

    return {
        "system_stats": {
            "total_users": 150,
            "active_contracts": 45,
            "pending_shipments": 23,
            "daily_transactions": 67
        },
        "user_distribution": {
            "importers": 80,
            "exporters": 45,
            "logistics": 24,
            "admins": 1
        },
        "recent_activity": [
            {
                "type": "user_registered",
                "description": "New exporter account created",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "type": "contract_signed",
                "description": "Contract #C2 signed by all parties",
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat()
            }
        ],
        "system_alerts": [
            {
                "type": "security",
                "level": "info",
                "message": "System backup completed successfully",
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
    }


@router.get("/summary")
async def dashboard_summary(
    current_user: User = Depends(check_permission(Permission.VIEW_PROFILE))
) -> Dict[str, Any]:
    """
    Get a role-specific summary of the dashboard.
    Accessible by any authenticated user.
    """
    role_summaries = {
        UserRole.IMPORTER: {
            "active_contracts": len([c for c in MOCK_CONTRACTS if c["status"] == "active"]),
            "pending_shipments": len([s for s in MOCK_SHIPMENTS if s["status"] == "in_transit"]),
            "pending_documents": len([d for d in MOCK_DOCUMENTS if d["status"] == "pending"])
        },
        UserRole.EXPORTER: {
            "contract_requests": len([c for c in MOCK_CONTRACTS if c["status"] == "pending"]),
            "active_shipments": len(MOCK_SHIPMENTS),
            "document_requirements": len(MOCK_DOCUMENTS)
        },
        UserRole.LOGISTICS: {
            "active_shipments": len(MOCK_SHIPMENTS),
            "pending_documents": len([d for d in MOCK_DOCUMENTS if d["type"] == "bill_of_lading"])
        },
        UserRole.ADMIN: {
            "total_users": 150,
            "active_contracts": 45,
            "pending_shipments": 23
        }
    }

    return {
        "role": current_user.role,
        "summary": role_summaries.get(current_user.role, {}),
        "last_login": current_user.last_login,
        "account_status": "active" if current_user.is_active else "inactive"
    }


@router.get("/stats")
async def get_dashboard_stats(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Get role-specific dashboard statistics
    """
    stats = {
        "user": {
            "role": current_user.role,
            "last_login": current_user.last_login,
        }
    }

    if current_user.role == UserRole.ADMIN:
        stats.update({
            "total_users": 150,
            "active_contracts": 45,
            "total_transactions": 1250,
            "monthly_revenue": 125000,
            "recent_activities": [
                {"type": "New User", "details": "New exporter registered",
                    "time": "2 hours ago"},
                {"type": "Contract", "details": "Contract #123 signed",
                    "time": "4 hours ago"},
                {"type": "Payment", "details": "Payment of $50,000 processed",
                    "time": "6 hours ago"}
            ]
        })
    elif current_user.role == UserRole.IMPORTER:
        stats.update({
            "active_orders": 12,
            "pending_payments": 3,
            "total_spent": 75000,
            "ongoing_shipments": 5,
            "recent_activities": [
                {"type": "Order", "details": "Order #456 placed", "time": "1 hour ago"},
                {"type": "Payment", "details": "Payment of $10,000 due",
                    "time": "3 hours ago"},
                {"type": "Shipment", "details": "Shipment #789 in transit",
                    "time": "5 hours ago"}
            ]
        })
    elif current_user.role == UserRole.EXPORTER:
        stats.update({
            "active_listings": 8,
            "pending_orders": 4,
            "total_revenue": 95000,
            "shipments_completed": 15,
            "recent_activities": [
                {"type": "Order", "details": "New order received",
                    "time": "30 minutes ago"},
                {"type": "Payment", "details": "Payment of $15,000 received",
                    "time": "2 hours ago"},
                {"type": "Shipment", "details": "Shipment #101 delivered",
                    "time": "4 hours ago"}
            ]
        })
    elif current_user.role == UserRole.LOGISTICS:
        stats.update({
            "active_shipments": 25,
            "completed_deliveries": 120,
            "pending_pickups": 8,
            "total_distance": 15000,
            "recent_activities": [
                {"type": "Pickup", "details": "New pickup scheduled",
                    "time": "1 hour ago"},
                {"type": "Delivery", "details": "Delivery #234 completed",
                    "time": "3 hours ago"},
                {"type": "Route", "details": "New route optimized",
                    "time": "5 hours ago"}
            ]
        })

    return stats


@router.get("/notifications")
async def get_notifications(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Get user notifications
    """
    notifications = {
        UserRole.ADMIN: [
            {"type": "alert", "message": "New user registration spike detected",
                "time": "10 minutes ago"},
            {"type": "warning", "message": "System update scheduled for tonight",
                "time": "1 hour ago"},
            {"type": "info", "message": "Monthly report is ready", "time": "2 hours ago"}
        ],
        UserRole.IMPORTER: [
            {"type": "alert", "message": "Payment due for order #123",
                "time": "30 minutes ago"},
            {"type": "info", "message": "New shipment tracking available",
                "time": "1 hour ago"},
            {"type": "success", "message": "Order #456 confirmed", "time": "2 hours ago"}
        ],
        UserRole.EXPORTER: [
            {"type": "alert", "message": "New order received",
                "time": "15 minutes ago"},
            {"type": "info", "message": "Payment processed", "time": "1 hour ago"},
            {"type": "warning", "message": "Inventory running low", "time": "2 hours ago"}
        ],
        UserRole.LOGISTICS: [
            {"type": "alert", "message": "Urgent pickup request",
                "time": "5 minutes ago"},
            {"type": "info", "message": "Route optimization complete",
                "time": "1 hour ago"},
            {"type": "warning", "message": "Weather alert for route #789",
                "time": "2 hours ago"}
        ]
    }

    return {"notifications": notifications.get(current_user.role, [])}


@router.get("/tasks")
async def get_tasks(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Get user tasks
    """
    tasks = {
        UserRole.ADMIN: [
            {"id": 1, "title": "Review new registrations",
                "priority": "high", "due": "Today"},
            {"id": 2, "title": "Generate monthly report",
                "priority": "medium", "due": "Tomorrow"},
            {"id": 3, "title": "Update system settings",
                "priority": "low", "due": "Next week"}
        ],
        UserRole.IMPORTER: [
            {"id": 1, "title": "Complete order #123",
                "priority": "high", "due": "Today"},
            {"id": 2, "title": "Review shipment details",
                "priority": "medium", "due": "Tomorrow"},
            {"id": 3, "title": "Update payment information",
                "priority": "low", "due": "Next week"}
        ],
        UserRole.EXPORTER: [
            {"id": 1, "title": "Process new orders",
                "priority": "high", "due": "Today"},
            {"id": 2, "title": "Update inventory",
                "priority": "medium", "due": "Tomorrow"},
            {"id": 3, "title": "Prepare shipping documents",
                "priority": "low", "due": "Next week"}
        ],
        UserRole.LOGISTICS: [
            {"id": 1, "title": "Schedule new pickups",
                "priority": "high", "due": "Today"},
            {"id": 2, "title": "Optimize delivery routes",
                "priority": "medium", "due": "Tomorrow"},
            {"id": 3, "title": "Update tracking information",
                "priority": "low", "due": "Next week"}
        ]
    }

    return {"tasks": tasks.get(current_user.role, [])}
