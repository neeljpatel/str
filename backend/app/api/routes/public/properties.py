from fastapi import APIRouter, HTTPException
from supabase import create_client
from app.core.config import settings

router = APIRouter()

def _get_supabase():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

def _format_property(prop: dict, gallery_images: list = None) -> dict:
    """Format a property record for the frontend, merging gallery images."""
    return {
        "id": prop["id"],
        "slug": prop["slug"],
        "title": prop["title"],
        "location": prop.get("location"),
        "summary": prop.get("summary"),
        "overview": prop.get("overview"),
        "checkin": prop.get("checkin"),
        "checkout": prop.get("checkout"),
        "iframeSrc": prop.get("iframe_src"),
        "capacity": prop.get("capacity"),
        "space_overview": prop.get("space_overview"),
        "amenities": prop.get("amenities"),
        "rooms": prop.get("rooms"),
        "rules": prop.get("rules"),
        "images": gallery_images or [],
    }

@router.get("/properties")
async def get_properties():
    """Fetch all properties with their gallery images."""
    sb = _get_supabase()
    props_result = sb.table("properties").select("*").order("title").execute()
    galleries_result = sb.table("galleries").select("property_slug, images").execute()

    # Build a lookup: slug -> images list
    gallery_map = {}
    for g in galleries_result.data:
        gallery_map[g["property_slug"]] = g.get("images", [])

    response = []
    for prop in props_result.data:
        images = gallery_map.get(prop["slug"], [])
        response.append(_format_property(prop, images))
    return response

@router.get("/properties/{slug}")
async def get_property_by_slug(slug: str):
    """Fetch a specific property by slug, including gallery images."""
    sb = _get_supabase()
    result = sb.table("properties").select("*").eq("slug", slug).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Property not found")

    prop = result.data[0]

    # Also fetch gallery images for this property
    gallery_result = sb.table("galleries").select("images").eq("property_slug", slug).execute()
    images = gallery_result.data[0].get("images", []) if gallery_result.data else []

    return _format_property(prop, images)

@router.get("/galleries/{slug}")
async def get_gallery(slug: str):
    """Fetch gallery images for a specific property."""
    sb = _get_supabase()
    result = sb.table("galleries").select("images").eq("property_slug", slug).execute()

    if not result.data:
        return {"images": []}

    return {"images": result.data[0].get("images", [])}
