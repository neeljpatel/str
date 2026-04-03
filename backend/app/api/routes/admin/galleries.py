from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict
from supabase import create_client
from app.core.config import settings
from app.api.dependencies import get_admin_user

router = APIRouter()

def _get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

@router.post("/{slug}")
async def update_gallery(
    slug: str,
    payload: Dict[str, List[str]],
    current_user: dict = Depends(get_admin_user)
):
    """Secure endpoint to update a property's gallery"""
    if slug not in payload:
        raise HTTPException(status_code=400, detail="Payload key must match the route slug")

    images = payload[slug]
    sb = _get_supabase()

    # Check if gallery row exists
    existing = sb.table("galleries").select("property_slug").eq("property_slug", slug).execute()

    if existing.data:
        sb.table("galleries").update({"images": images}).eq("property_slug", slug).execute()
    else:
        sb.table("galleries").insert({"property_slug": slug, "images": images}).execute()

    return {"success": True, "data": {slug: images}}
