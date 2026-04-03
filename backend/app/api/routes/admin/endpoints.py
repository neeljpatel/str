from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from supabase import create_client

from app.api.dependencies import get_db, get_admin_user
from app.core.config import settings
from app.schemas.auth import PasswordResetRequest

router = APIRouter()

@router.get("/status")
async def admin_status(
    current_user: Annotated[dict, Depends(get_admin_user)]
):
    """Admin-only status check."""
    return {
        "status": "online", 
        "message": "Admin API is accessible.",
        "user_id": current_user.get("sub")
    }

@router.post("/reset-password")
async def reset_user_password(
    request: PasswordResetRequest,
    current_user: Annotated[dict, Depends(get_admin_user)]
):
    """
    Allows an admin to securely reset a specified user's password.
    Requires SUPABASE_SERVICE_KEY to be configured in .env.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server Supabase credentials are not fully configured. Missing SUPABASE_SERVICE_KEY."
        )

    try:
        # We must initialize the backend client using the Service Role Key
        # because the Admin API is restricted.
        supabase_admin = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
        
        response = supabase_admin.auth.admin.update_user_by_id(
            request.user_id,
            {"password": request.new_password}
        )
        return {"message": "Password updated successfully", "user_id": request.user_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to reset password: {str(e)}"
        )

@router.get("/users")
async def list_users(
    current_user: Annotated[dict, Depends(get_admin_user)]
):
    """
    Returns a list of all registered users in the platform.
    Requires SUPABASE_SERVICE_KEY.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Missing SUPABASE_SERVICE_KEY."
        )

    try:
        supabase_admin = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_KEY
        )
        response = supabase_admin.auth.admin.list_users()
        
        users_list = []
        for u in response.users:
            users_list.append({"id": str(u.id), "email": str(u.email)})
            
        return {"users": users_list}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch users: {str(e)}"
        )
