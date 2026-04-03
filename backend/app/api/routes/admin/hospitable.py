from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
import httpx
from app.api.dependencies import get_admin_user
from app.core.config import settings

router = APIRouter()

HOSPITABLE_BASE_URL = "https://public.api.hospitable.com/v2"

async def get_hospitable_headers():
    if not settings.HOSPITABLE_ACCESS_TOKEN:
        raise HTTPException(status_code=500, detail="Hospitable access token not configured")
    return {
        "Authorization": f"Bearer {settings.HOSPITABLE_ACCESS_TOKEN}",
        "Accept": "application/json"
    }

@router.get("/reservations")
async def get_reservations(
    current_user: Annotated[dict, Depends(get_admin_user)],
    start_date: str = Query(...),
    end_date: str = Query(...),
    properties: list[str] = Query(default=[]),
    include: str = Query(default="guest,financials")
):
    """
    Fetch reservations from Hospitable for admin dashboard.
    Requires admin authentication via Supabase JWT.
    """
    headers = await get_hospitable_headers()
    
    # Construct properties query param manually since Hospitable uses properties[]=uuid
    prop_query = "&".join([f"properties[]={p}" for p in properties])
    url = f"{HOSPITABLE_BASE_URL}/reservations?start_date={start_date}&end_date={end_date}&include={include}"
    if prop_query:
        url += f"&{prop_query}"
        
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(url, headers=headers)
            res.raise_for_status()
            data = res.json().get("data", [])
            return {"reservations": data}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch reservations from Hospitable: {str(e)}")

@router.get("/properties/{uuid}/images")
async def get_admin_property_images(
    uuid: str,
    current_user: Annotated[dict, Depends(get_admin_user)]
):
    """
    Fetch images for a specific property (admin route).
    """
    headers = await get_hospitable_headers()
    
    async with httpx.AsyncClient() as client:
        try:
            res = await client.get(f"{HOSPITABLE_BASE_URL}/properties/{uuid}/images", headers=headers)
            res.raise_for_status()
            data = res.json().get("data", [])
            images = [img.get("url") for img in data if img.get("url")]
            return {"images": images}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Failed to fetch images from Hospitable: {str(e)}")
