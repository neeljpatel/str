from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.dependencies import get_db

router = APIRouter()

@router.get("/status")
async def public_status():
    """Publicly accessible status check."""
    return {"status": "online", "message": "Public API is accessible."}
